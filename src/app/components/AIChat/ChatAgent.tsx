"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "../../context/LangContext";

type Msg = { role: 'user' | 'assistant'; content: string; ts?: string };

export default function ChatAgent() {
  const { lang, t } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const appendMessage = (m: Msg) => setMessages((s) => [...s, m]);
  const quickPrompts =
    lang === 'he'
      ? [
          'מה היכולות העיקריות של נתנאל בירהאוז?',
          'ספר על ניסיונו וכישוריו של נתנאל',
          'איך נבנה DataMap ומה התפקיד של RAG בפרויקט?',
        ]
      : [
          "What are Netanel's (Nati) core skills?",
          "Tell me about Nati's experience and strengths",
          'How was DataMap built and what role does RAG play?',
        ];

  const [placeholder, setPlaceholder] = useState('');
  useEffect(() => {
    const phrases =
      lang === 'he'
        ? ['שאל על הסטאק של נתי...', 'איך בניתי את DataMap...', 'ספר על מחקר התואר השני שלי...']
        : ['Ask about Nati\'s tech stack...', 'Ask how I built DataMap...', 'Ask about my M.Sc. research...'];
    let i = 0;
    setPlaceholder(phrases[0]);
    const iv = setInterval(() => {
      i = (i + 1) % phrases.length;
      setPlaceholder(phrases[i]);
    }, 3000);
    return () => clearInterval(iv);
  }, [lang]);

  const send = async (overrideInput?: string) => {
    const payload = overrideInput !== undefined ? overrideInput : input;
    const trimmed = payload.trim();
    if (!trimmed) return;
    const userMsg: Msg = { role: 'user', content: trimmed, ts: new Date().toISOString() };
    // Build the outgoing messages array immediately to avoid stale state issues
    const outgoing = [...messages, userMsg];
    appendMessage(userMsg);
    setInput("");
    setLoading(true);

    // placeholder assistant
    appendMessage({ role: 'assistant', content: '', ts: new Date().toISOString() });

    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: outgoing }),
      });

      if (!res.body) {
        const txt = await res.text();
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: 'assistant', content: txt, ts: new Date().toISOString() };
          return copy;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';
      const contentType = res.headers.get('content-type') || '';
      const isSSE = contentType.includes('event-stream');

      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (!value) continue;
        const chunk = decoder.decode(value, { stream: true });

        if (isSSE || chunk.includes('data:')) {
          // Accumulate and parse Server-Sent Events from OpenAI
          buffer += chunk;
          let splitIndex;
          while ((splitIndex = buffer.indexOf('\n\n')) !== -1) {
            const event = buffer.slice(0, splitIndex);
            buffer = buffer.slice(splitIndex + 2);
            const lines = event.split('\n');
            for (const line of lines) {
              if (!line.startsWith('data:')) continue;
              const data = line.replace(/^data:\s*/, '').trim();
              if (data === '[DONE]') {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta;
                const text = delta?.content || parsed.choices?.[0]?.message?.content || '';
                if (text) {
                  setMessages((m) => {
                    const copy = [...m];
                    const last = copy[copy.length - 1];
                    copy[copy.length - 1] = { role: 'assistant', content: (last?.content || '') + text, ts: new Date().toISOString() };
                    return copy;
                  });
                }
              } catch (e) {
                // ignore parse errors for partial events
              }
            }
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        } else {
          // Plain text fallback
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = { role: 'assistant', content: (last?.content || '') + chunk, ts: new Date().toISOString() };
            return copy;
          });
          scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    } catch (err: any) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'assistant', content: 'Error: ' + String(err?.message || err), ts: new Date().toISOString() };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const sendQuick = (msg: string) => {
    send(msg);
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto mt-12 p-6 rounded-3xl border border-white/10"
      style={{
        background:
          "radial-gradient(600px 220px at 10% 20%, rgba(240,249,255,0.9), transparent), radial-gradient(400px 160px at 80% 80%, rgba(245,240,255,0.85), transparent), linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.95))",
        boxShadow: "0 20px 60px rgba(10,20,40,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        borderRadius: 18,
        fontFamily: "var(--font-inter)",
        backdropFilter: "blur(6px)",
        padding: 20,
      }}
    >
      <motion.div
        initial={false}
        whileHover={{ boxShadow: "0 40px 140px rgba(30,130,120,0.12), inset 0 0 40px rgba(255,255,255,0.02)" }}
        className="p-2 rounded-2xl"
      >
        <div className="mb-4 text-center">
          <div className="text-lg font-semibold text-gray-900">{lang === 'he' ? 'שוחחו עם נתי-בוט' : 'Interact with the Nati-Bot'}</div>
          <div className="text-xs text-gray-600">{lang === 'he' ? 'שאל על נתנאל בירהאוז — כישורים, פרויקטים ומחקר' : "Ask about Netanel Birhauz — skills, projects, and research"}</div>
        </div>

        <div className="flex flex-col gap-3 max-h-80 overflow-auto p-2">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-8">{lang === 'he' ? "נסה: 'ספר לי על היכולות של נתי'" : 'Try: "Tell me about Nati\'s skills"'}</div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] p-3 rounded-xl whitespace-pre-wrap ${
                m.role === 'user' ? 'ml-auto bg-emerald-100 text-emerald-900' : 'mr-auto bg-white text-gray-900'
              }`}
              style={{ boxShadow: m.role === 'assistant' ? 'inset 0 1px 0 rgba(0,0,0,0.03)' : undefined }}
            >
              <div className="text-sm leading-relaxed">{m.content || (m.role === 'assistant' && loading ? (
                <div className="flex items-center gap-2">
                  <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                  <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.12 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                  <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.24 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                </div>
              ) : null)}</div>
              <div className="text-[10px] text-gray-500 mt-2 text-right">{m.ts ? new Date(m.ts).toLocaleTimeString() : ''}</div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        <div className="mt-4 relative">
          <div
            className="rounded-xl p-1"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.28), rgba(255,255,255,0.02))',
              boxShadow: 'inset 0 6px 18px rgba(0,0,0,0.6)',
              borderRadius: 12,
            }}
          >
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                className="flex-1 p-3 rounded-lg bg-white/95 border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200 text-slate-900 placeholder-slate-500"
                rows={2}
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label={lang === 'he' ? 'שדה הודעה' : 'Message input'}
                style={{ minHeight: 56, color: '#111827' }}
              />

              <button
                onClick={() => send()}
                disabled={loading}
                aria-live="polite"
                className="p-3 rounded-lg flex items-center justify-center"
                style={{
                  background: input.length ? 'linear-gradient(90deg,#0ea5b7,#7c3aed)' : 'transparent',
                  boxShadow: input.length ? '0 8px 30px rgba(124,58,237,0.18)' : undefined,
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={input.length ? '#fff' : '#9ca3af'} strokeWidth="1.5">
                  <path d="M2 12L22 2L13 22L9 13L2 12Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-3 flex gap-2 flex-wrap">
              {quickPrompts.map((p) => (
                <button key={p} onClick={() => sendQuick(p)} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-sm hover:bg-emerald-100 border border-transparent">
                  {p}
                </button>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
