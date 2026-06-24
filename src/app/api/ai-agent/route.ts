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

    // Rate limiting per IP (in-memory). Replace with Upstash/Vercel KV for production.
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

    // Combine the long system prompt from file with the retrieved context
    const systemPrompt = `${SYSTEM_PROMPT}\n\nContext:\n${contextText}`;

    const outMessages: Message[] = [{ role: 'system', content: systemPrompt }, ...(messages || [])];

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_KEY) {
      // Proxy to OpenAI with streaming
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: outMessages, stream: true }),
      });

      if (!res.ok) {
        const txt = await res.text();
        return new Response(txt, { status: 500 });
      }

      // Forward the streaming body to the client
      const headers = new Headers();
      headers.set('Content-Type', 'text/event-stream');
      headers.set('Cache-Control', 'no-cache');
      return new Response(res.body, { headers });
    }

    // Local fallback: simple, grounded answer using retrieved docs
    let answer = '';
    if (retrieved.length) {
      answer = `I found these relevant notes:\n${contextText}\n\nAnswer: Based on the above, here are suggestions and highlights about your work.`;
    } else {
      answer = `I don't have documents that match that query exactly. You can ask about RAG, agentic workflows, or specific projects in this portfolio.`;
    }

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(answer));
        controller.close();
      },
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (err: any) {
    return new Response(String(err?.message || err), { status: 500 });
  }
}

export const runtime = 'edge';
