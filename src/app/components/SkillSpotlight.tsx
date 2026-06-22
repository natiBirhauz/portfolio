"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LangContext";

export default function SkillSpotlight() {
  const { t } = useLang();
  const items = t.skillsSection.items;
  const [active, setActive] = useState(0);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sentinelRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i); },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [items]);

  return (
    <section id="skills-section" className="relative z-10 py-16">

      {/* heading + intro */}
      <div className="max-w-3xl mx-auto text-center mb-16 px-4">
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent mb-6">
          {t.skillsSection.heading}
        </h2>
        <div className="inline-block rounded-2xl bg-white/80 dark:bg-[#0a2318]/80 backdrop-blur px-8 py-4 shadow-md border border-emerald-100 dark:border-emerald-900">
          <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
            {t.skillsSection.intro}
          </p>
        </div>
      </div>

      {/* sticky area */}
      <div className="relative w-full" style={{ minHeight: `${items.length * 70}vh` }}>

        <div className="sticky top-20 w-full" style={{ height: "65vh" }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out"
              style={{
                opacity: active === i ? 1 : 0,
                transform: active === i
                  ? "translateY(0) scale(1)"
                  : active < i
                  ? "translateY(48px) scale(0.97)"
                  : "translateY(-48px) scale(0.97)",
                filter: active === i ? "blur(0px)" : "blur(8px)",
                pointerEvents: active === i ? "auto" : "none",
              }}
            >
              {/* Card — full viewport width, edges faded via mask */}
              <div
                className="w-full bg-white/85 dark:bg-[#0a2318]/85 backdrop-blur-md py-12 px-16 text-center shadow-2xl relative overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                }}
              >
                {/* top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400" />

                {/* step counter */}
                <span className="text-sm font-bold text-emerald-500 mb-4 block tracking-widest uppercase">
                  {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>

                <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 bg-clip-text text-transparent mb-6">
                  {item.title}
                </h3>

                <p className="text-xl text-gray-700 dark:text-gray-200 leading-relaxed max-w-3xl mx-auto">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* scroll sentinels */}
        {items.map((_, i) => (
          <div
            key={i}
            ref={el => { sentinelRefs.current[i] = el; }}
            className="absolute w-full"
            style={{ top: `${(i / items.length) * 100}%`, height: `${100 / items.length}%` }}
          />
        ))}
      </div>
    </section>
  );
}
