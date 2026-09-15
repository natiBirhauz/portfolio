import { AGENT_DOCS } from './docs';
import SYSTEM_PROMPT from './systemPrompt';

// In-memory rate limiter per IP
const RATE_LIMIT_MAP: Map<string, number[]> = new Map();
const MAX_MSGS = parseInt(process.env.MAX_MSGS_PER_IP || '20', 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(60 * 60 * 1000), 10); // 1 hour

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

function retrieveRelevant(query: string) {
  const normalized = query.toLowerCase().replace(/[^\w\s\u0590-\u05FF]/g, ' ');
  const terms = normalized
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !['the', 'and', 'for', 'are', 'what', 'who', 'how', 'is', 'in', 'of', 'to', 'with', 'about', 'tell', 'me', 'את', 'של', 'על', 'מה', 'מי', 'איך', 'האם'].includes(w));

  if (terms.length === 0) {
    return AGENT_DOCS.slice(0, 3);
  }

  const scored = AGENT_DOCS.map((doc) => {
    let score = 0;
    const docTitle = doc.title.toLowerCase();
    const docText = doc.text.toLowerCase();
    for (const term of terms) {
      if (docTitle.includes(term)) score += 3;
      if (docText.includes(term)) score += 1;
    }
    return { ...doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const hits = scored.filter((d) => d.score > 0).slice(0, 4);
  return hits.length > 0 ? hits : AGENT_DOCS.slice(0, 3);
}

function generateLocalAnswer(query: string, retrievedDocs: typeof AGENT_DOCS): string {
  const q = query.toLowerCase();
  const isHebrew = /[\u0590-\u05FF]/.test(query);

  // Identity / Name query
  if (
    q.includes('name') ||
    q.includes('who are you') ||
    q.includes('who is nati-bot') ||
    q.includes('what is your name') ||
    q.includes('שם') ||
    q.includes('מי אתה') ||
    q.includes('מי זה') ||
    q.includes('איך קוראים לך')
  ) {
    if (isHebrew) {
      return `נעים להכיר! אני **Nati-Bot**, העוזר החכם הרשמי של **נתנאל (נתי) בירהאוז**.\n\nאני כאן כדי לספק לך מידע מקיף על הכישורים הטכנולוגיים של נתי, הפרויקטים שלו (כמו DataMap ו-EmotionFlow), לימודי התואר השני שלו ב-AI במכללת עזריאלי, והניסיון המקצועי והצבאי שלו כראש צוות ביחידת חושן.\n\nמוזמן לשאול אותי כל שאלה!`;
    }
    return `Hello! I am **Nati-Bot**, the official AI portfolio assistant for **Netanel (Nati) Birhauz**.\n\nI am here to help you learn about Nati's technical expertise, his AI and full-stack projects (such as **DataMap** and **EmotionFlow-LLM**), his academic background (M.Sc. in Software Engineering with AI specialization), and his career achievements.\n\nFeel free to ask me anything about his skills, experience, or projects!`;
  }

  // Skills / Stack query
  if (
    q.includes('skill') ||
    q.includes('stack') ||
    q.includes('technolog') ||
    q.includes('abilities') ||
    q.includes('כישור') ||
    q.includes('יכול') ||
    q.includes('סטאק') ||
    q.includes('טכנולוג')
  ) {
    if (isHebrew) {
      return `הנה תחומי המומחיות והכישורים העיקריים של **נתנאל (נתי) בירהאוז**:\n\n` +
        `• **בינה מלאכותית (AI & ML):** ארכיטקטורת סוכני AI (Agentic Workflows), מערכות RAG (Retrieval-Augmented Generation), אימון וכוונון מודלים (Fine-Tuning), עבודה עם LangGraph, PyTorch ו-TensorFlow.\n` +
        `• **פיתוח Full-Stack ו-Web:** Next.js, React, TypeScript, Node.js, FastAPI, Python, Tailwind CSS, ו-Three.js/WebGL לתצוגות תלת-ממד אינטראקטיביות.\n` +
        `• **שפות תכנות:** Python, C#, C++, Java, JavaScript, TypeScript, C, HTML/CSS, CUDA.\n` +
        `• **תשתיות ותקשורת נתונים:** ניתוב ופרוטוקולי TCP/IP, ציוד Cisco, Juniper, הצפנות Check Point, מערכות RF וסלולר, לינוקס, Docker, Git, CI/CD ו-Vercel.\n` +
        `• **השכלה ומנהיגות טכנולוגית:** סטודנט לתואר שני (M.Sc.) בהתמחות AI במכללת עזריאלי (תואר ראשון בציון 87), ומעל 400 ימי שירות מילואים כראש צוות תקשורת ביחידת חושן-מב"א.\n\n` +
        `לפרטים נוספים או יצירת קשר ישיר: nati4455@gmail.com | 054-6350098`;
    }
    return `Here are **Netanel (Nati) Birhauz's** core technical competencies and skills:\n\n` +
      `• **Artificial Intelligence & Machine Learning:** AI agent architectures, RAG (Retrieval-Augmented Generation), LLM fine-tuning, LangGraph, PyTorch, and TensorFlow.\n` +
      `• **Full-Stack & Web Engineering:** Next.js, React, TypeScript, Node.js, FastAPI, Python, Tailwind CSS, and Three.js/WebGL for interactive graphics.\n` +
      `• **Programming Languages:** Python, C#, C++, Java, JavaScript, TypeScript, C, HTML/CSS, and CUDA.\n` +
      `• **Network Engineering & Infrastructure:** Advanced TCP/IP routing, enterprise Cisco & Juniper hardware, Check Point encryptors, RF/cellular systems, Linux, Docker, Git, CI/CD, and Vercel.\n` +
      `• **Academics & Leadership:** M.Sc. candidate in Software Engineering (AI Specialization) at Azrieli College of Engineering (B.Sc. graduated with 87 GPA); IDF Unit Hoshen-MABA Reservist Team Leader with 400+ active duty days managing critical infrastructure.\n\n` +
      `For inquiries or opportunities, reach out directly at **nati4455@gmail.com** or **054-6350098**.`;
  }

  // Projects query
  if (
    q.includes('datamap') ||
    q.includes('emotion') ||
    q.includes('find me') ||
    q.includes('תמצא') ||
    q.includes('ballstrike') ||
    q.includes('amitsim') ||
    q.includes('project') ||
    q.includes('פרויקט')
  ) {
    if (isHebrew) {
      return `הפרויקטים המרכזיים שנתנאל פיתח כוללים:\n\n` +
        `1. **DataMap:** פלטפורמת Full-Stack לחקירה, מיפוי ויזואלי ותיוג של מערכי נתוני Prompt-Response עבור מודלי שפה (LLMs), הכוללת Embeddings וניתוח סמנטי.\n` +
        `2. **EmotionFlow-LLM:** כלי כתיבה יצירתית מבוסס AI המאפשר שליטה בגוון הרגשי של טקסטים על פני 8 רגשות יסוד, בעברית ובאנגלית, תוך שימוש ב-Python, LangGraph וממשק אינטראקטיבי.\n` +
        `3. **תמצא לי (Find Me):** מנוע חיפוש וחיזוי זמינות ומחירים עבור מוצרי צריכה בישראל בעזרת אלגוריתמי AI.\n` +
        `4. **BallStrike:** משחק פעולה תלת-ממדי שפותח במנוע Unity ב-C++.\n` +
        `5. **Amitsim:** אפליקציית Web מבוססת React ו-Firebase עבור עמותת עמיתסים.\n\n` +
        `לשאלות נוספות: nati4455@gmail.com`;
    }
    return `Here are the key projects developed by **Netanel Birhauz**:\n\n` +
      `1. **DataMap:** A full-stack application designed to map, explore, tag, and visualize prompt-response datasets for LLMs, featuring clustering and semantic search.\n` +
      `2. **EmotionFlow-LLM:** An AI-powered creative writing tool allowing fine-grained control over text emotion across 8 core dimensions in both Hebrew and English, built with Python, LangGraph, and modern UI.\n` +
      `3. **Find Me (תמצא לי):** An AI tool predicting consumer goods pricing and availability across Israeli retail platforms.\n` +
      `4. **BallStrike:** A 3D arcade physics dodging game built in Unity (C++).\n` +
      `5. **Amitsim:** A dynamic React & Firebase web application built for the Amitsim non-profit organization.\n\n` +
      `Feel free to ask for technical deep dives into any of these projects!`;
  }

  // General grounded response using retrieved documents
  const docSummary = retrievedDocs.map((d) => `• **${d.title}:** ${d.text}`).join('\n\n');
  if (isHebrew) {
    return `על פי המידע בתיק העבודות של נתנאל:\n\n${docSummary}\n\nלפרטים נוספים וקביעת ראיון, ניתן ליצור קשר עם נתנאל במייל: nati4455@gmail.com או בטלפון: 054-6350098.`;
  }
  return `Based on Netanel Birhauz's professional portfolio:\n\n${docSummary}\n\nFor more details or to get in touch, you can reach Nati directly at **nati4455@gmail.com** or **054-6350098**.`;
}

function streamLocalResponse(text: string): Response {
  const encoder = new TextEncoder();
  const words = text.split(/(\s+)/);
  let index = 0;

  const stream = new ReadableStream({
    async pull(controller) {
      if (index >= words.length) {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
        return;
      }
      const chunkWords = words.slice(index, index + 3).join('');
      index += 3;
      const payload = JSON.stringify({
        choices: [{ delta: { content: chunkWords }, finish_reason: null }],
      });
      controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function createGeminiToOpenAITransformer() {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let lineBuffer = '';

  return new TransformStream({
    transform(chunk, controller) {
      lineBuffer += decoder.decode(chunk, { stream: true });
      const lines = lineBuffer.split('\n');
      // Keep the last partial line in lineBuffer across chunk boundaries
      lineBuffer = lines.pop() ?? '';

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line.startsWith('data:')) continue;
        const data = line.replace(/^data:\s*/, '').trim();
        if (!data || data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const content = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            const openAIChunk = JSON.stringify({
              choices: [{ delta: { content }, finish_reason: null }],
            });
            controller.enqueue(encoder.encode(`data: ${openAIChunk}\n\n`));
          }
        } catch {
          // Line was incomplete or malformed; buffered for next chunk
        }
      }
    },
    flush(controller) {
      if (lineBuffer.trim().startsWith('data:')) {
        const data = lineBuffer.trim().replace(/^data:\s*/, '').trim();
        try {
          const parsed = JSON.parse(data);
          const content = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            const openAIChunk = JSON.stringify({
              choices: [{ delta: { content }, finish_reason: null }],
            });
            controller.enqueue(encoder.encode(`data: ${openAIChunk}\n\n`));
          }
        } catch {
          // ignore parse errors
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
    },
  });
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
      return new Response(
        JSON.stringify({ error: 'rate_limited', msg: 'Too many requests from your IP. Try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    recent.push(now);
    RATE_LIMIT_MAP.set(ip, recent);

    const retrieved = retrieveRelevant(query);
    const contextText = retrieved.map((r) => `- ${r.title}: ${r.text}`).join('\n');
    const systemPrompt = `${SYSTEM_PROMPT}\n\nContext:\n${contextText}`;

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const OPENAI_KEY = process.env.OPENAI_API_KEY;

    // --- Tier 1 & 2: Google Gemini with Cascading Model Fallback ---
    if (GEMINI_KEY) {
      const geminiContents = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const requestPayload = {
        contents: geminiContents.length > 0 ? geminiContents : [{ role: 'user', parts: [{ text: query || 'Hello' }] }],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      };

      // Try modern models with fallback to 1.5-flash (resilient to peak loads)
      const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];

      for (const model of modelsToTry) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestPayload),
              signal: AbortSignal.timeout(8000), // 8s timeout to prevent Vercel FUNCTION_INVOCATION_TIMEOUT
            }
          );

          if (geminiRes.ok && geminiRes.body) {
            const transformed = createGeminiToOpenAITransformer();
            geminiRes.body.pipeThrough(transformed);
            return new Response(transformed.readable, {
              headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
              },
            });
          }
          console.warn(`Gemini model ${model} failed with status:`, geminiRes.status);
        } catch (err: any) {
          console.warn(`Gemini model ${model} fetch error:`, err?.message || err);
        }
      }
    }

    // --- Tier 3: OpenAI Fallback ---
    if (OPENAI_KEY) {
      try {
        const outMessages: Message[] = [{ role: 'system', content: systemPrompt }, ...messages];
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
          body: JSON.stringify({ model: 'gpt-4o-mini', messages: outMessages, stream: true }),
          signal: AbortSignal.timeout(8000),
        });

        if (res.ok && res.body) {
          return new Response(res.body, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
            },
          });
        }
        console.warn('OpenAI failed with status:', res.status);
      } catch (err: any) {
        console.warn('OpenAI fetch error:', err?.message || err);
      }
    }

    // --- Tier 4: Intelligent Grounded Local Streamer (Guaranteed 100% Uptime) ---
    const localAnswer = generateLocalAnswer(query, retrieved);
    return streamLocalResponse(localAnswer);

  } catch (err: any) {
    // If any unexpected error occurs, still return a clean stream fallback
    const fallbackAnswer = `Hello! I am Nati-Bot, Netanel Birhauz's portfolio assistant. If you have any inquiries or would like to discuss technical projects, please contact Netanel directly at nati4455@gmail.com or 054-6350098.`;
    return streamLocalResponse(fallbackAnswer);
  }
}

export const runtime = 'edge';
export const maxDuration = 30;
