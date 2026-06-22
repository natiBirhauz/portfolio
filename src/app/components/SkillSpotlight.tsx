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
    <section id="skills-section" className="relative z-10 px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-extrabold text-center bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent mb-4">
          {t.skillsSection.heading}
        </h2>
        <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
          {t.skillsSection.intro}
        </p>

        {/* sticky display + sentinels */}
        <div className="relative" style={{ minHeight: `${items.length * 60}vh` }}>
          {/* sticky card display */}
          <div className="sticky top-24 flex justify-center" style={{ height: "60vh" }}>
            <div className="relative w-full max-w-2xl flex items-center justify-center">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    opacity: active === i ? 1 : 0,
                    transform: active === i ? "translateY(0) scale(1)" : active < i ? "translateY(40px) scale(0.96)" : "translateY(-40px) scale(0.96)",
                    filter: active === i ? "blur(0px)" : "blur(6px)",
                    pointerEvents: active === i ? "auto" : "none",
                  }}
                >
                  {/* shimmer border */}
                  <div className="absolute -inset-[2px] rounded-3xl animate-shimmer-border pointer-events-none"
                    style={{ background: "linear-gradient(120deg, #6ee7b7, #2dd4bf, #34d399, #059669, #6ee7b7)" }} />
                  <div className="relative w-full rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-12 py-10 shadow-2xl z-10 text-left overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 rounded-t-3xl" />
                    {/* step counter */}
                    <span className="text-sm font-bold text-emerald-500 mb-3 block tracking-widest uppercase">
                      {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </span>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 bg-clip-text text-transparent mb-4">
                      {item.title}
                    </h3>
                    <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
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
      </div>
    </section>
  );
}
