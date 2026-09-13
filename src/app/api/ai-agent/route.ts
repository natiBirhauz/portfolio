import { AGENT_DOCS } from './docs';
import SYSTEM_PROMPT from './systemPrompt';

// Simple in-memory rate limiter (per-process). For production use Upstash or Vercel KV.
const RATE_LIMIT_MAP: Map<string, number[]> = new Map();
const MAX_MSGS = parseInt(process.env.MAX_MSGS_PER_IP || '10', 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(60 * 60 * 1000), 10); // 1 hour

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

async function retrieveRelevant(query: string) {
  const q = query.toLowerCase();
  const hits = AGENT_DOCS
    .map((d) => ({ ...d, score: d.text.toLowerCase().includes(q) ? 1 : 0 }))
    .filter((d) => d.score > 0)
    .slice(0, 3);
  return hits;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: Message[] = body.messages || [];
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const query = lastUser?.content || '';

    // Rate limiting per IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
    const now = Date.now();
    const recent = (RATE_LIMIT_MAP.get(ip) || []).filter((ts) => ts > now - WINDOW_MS);
    if (recent.length >= MAX_MSGS) {
      return new Response(JSON.stringify({ error: 'rate_limited', msg: 'Too many requests from your IP. Try again later.' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }
    recent.push(now);
    RATE_LIMIT_MAP.set(ip, recent);

    const retrieved = await retrieveRelevant(query);
    const contextText = retrieved.map((r) => `- ${r.title}: ${r.text}`).join('\n');
    const systemPrompt = `${SYSTEM_PROMPT}\n\nContext:\n${contextText}`;

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const OPENAI_KEY = process.env.OPENAI_API_KEY;

    // --- Gemini (free tier: 1500 req/day) ---
    if (GEMINI_KEY) {
      // Convert messages to Gemini format (no system role — prepend to first user message)
      const geminiContents = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      // Prepend system prompt into the first user turn
      if (geminiContents.length > 0 && geminiContents[0].role === 'user') {
        geminiContents[0].parts[0].text = `${systemPrompt}\n\nUser: ${geminiContents[0].parts[0].text}`;
      } else {
        geminiContents.unshift({ role: 'user', parts: [{ text: systemPrompt }] });
      }

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: geminiContents }),
        }
      );

      if (!geminiRes.ok) {
        const txt = await geminiRes.text();
        return new Response(txt, { status: 500 });
      }

      // Transform Gemini SSE → OpenAI-compatible SSE so the frontend works unchanged
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const transformed = new TransformStream({
        transform(chunk, controller) {
          const text = decoder.decode(chunk, { stream: true });
          const lines = text.split('\n');
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.replace(/^data:\s*/, '').trim();
            if (!data || data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (content) {
                const openAIChunk = JSON.stringify({
                  choices: [{ delta: { content }, finish_reason: null }],
                });
                controller.enqueue(encoder.encode(`data: ${openAIChunk}\n\n`));
              }
              if (parsed?.candidates?.[0]?.finishReason) {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              }
            } catch {
              // ignore parse errors
            }
          }
        },
      });

      geminiRes.body!.pipeThrough(transformed);
      return new Response(transformed.readable, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    }

    // --- OpenAI fallback ---
    if (OPENAI_KEY) {
      const outMessages: Message[] = [{ role: 'system', content: systemPrompt }, ...messages];
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: outMessages, stream: true }),
      });
      if (!res.ok) return new Response(await res.text(), { status: 500 });
      return new Response(res.body, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
    }

    // --- Local fallback (no API key) ---
    const answer = retrieved.length
      ? `Based on the available information:\n${contextText}`
      : `I don't have specific information about that. Contact Nati at nati4455@gmail.com`;

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(answer));
        controller.close();
      },
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

  } catch (err: any) {
    return new Response(String(err?.message || err), { status: 500 });
  }
}

export const runtime = 'edge';
