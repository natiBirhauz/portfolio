"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LangContext";

/**
 * Scroll-driven horizontal carousel.
 * As the user scrolls through the section, skill cards travel across
 * the screen from right → left. The card nearest the center is at
 * full size; cards farther from center shrink and fade.
 */
export default function SkillSpotlight() {
  const { t } = useLang();
  const items = t.skillsSection.items;

  // progress: 0 → 1 over the full scroll range of this section
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      // how far we've scrolled through this section (0–1)
      const p = Math.min(Math.max(-top / (height - window.innerHeight), 0), 1);
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const CARD_COLORS = [
    { from: "#059669", to: "#0d9488", border: "#6ee7b7" }, // emerald→teal
    { from: "#7c3aed", to: "#2563eb", border: "#a78bfa" }, // violet→blue
    { from: "#0891b2", to: "#059669", border: "#67e8f9" }, // cyan→emerald
    { from: "#f59e0b", to: "#ef4444", border: "#fcd34d" }, // amber→red
  ];

  return (
    <section
      id="skills-section"
      ref={sectionRef}
      className="relative z-10"
      style={{ minHeight: "400vh" }} // tall section so scroll is slow
    >
      {/* sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

        {/* heading */}
        <div className="text-center mb-10 px-8">
          <h2 className="text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-violet-500 to-teal-500 bg-clip-text text-transparent mb-4">
            {t.skillsSection.heading}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            {t.skillsSection.intro}
          </p>
        </div>

        {/* carousel track */}
        <div className="relative w-full overflow-visible" style={{ height: "320px" }}>
          {items.map((item, i) => {
            // Each card's "natural" position is spread across 0–1
            // Card i is centered when progress = i/(items.length-1)
            const centerAt = i / (items.length - 1);
            // Distance from center in progress units (−1 to +1 range)
            const dist = (progress - centerAt) * (items.length - 1);
            // Horizontal offset: 50vw per unit distance
            const tx = -dist * 55; // vw
            // Scale peaks at 1 when dist=0, falls off as |dist| grows
            const scale = Math.max(0.55, 1 - Math.abs(dist) * 0.22);
            // Opacity peaks at 1, fades out beyond ±1.5 units
            const opacity = Math.max(0, 1 - Math.abs(dist) * 0.5);
            // Z-index: closer to center = higher
            const zIndex = Math.round(100 - Math.abs(dist) * 30);

            const colors = CARD_COLORS[i % CARD_COLORS.length];

            return (
              <div
                key={i}
                className="absolute top-0 left-1/2 transition-none"
                style={{
                  width: "min(520px, 80vw)",
                  marginLeft: "min(-260px, -40vw)",
                  transform: `translateX(${tx}vw) scale(${scale})`,
                  opacity,
                  zIndex,
                  willChange: "transform, opacity",
                }}
              >
                {/* glowing border */}
                <div
                  className="absolute -inset-[3px] rounded-3xl pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${colors.border}, ${colors.from}, ${colors.to}, ${colors.border})`,
                    opacity: Math.max(0, 1 - Math.abs(dist) * 0.6),
                  }}
                />
                <div className="relative rounded-3xl bg-white px-10 py-10 shadow-2xl overflow-hidden">
                  {/* colored top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl"
                    style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
                  />

                  {/* step counter */}
                  <span
                    className="text-base font-bold mb-3 block tracking-widest uppercase"
                    style={{ color: colors.from }}
                  >
                    {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>

                  <h3
                    className="text-3xl font-black mb-4 bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* progress dots */}
        <div className="flex justify-center gap-3 mt-8">
          {items.map((_, i) => {
            const centerAt = i / (items.length - 1);
            const dist = Math.abs(progress - centerAt) * (items.length - 1);
            const active = dist < 0.5;
            return (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: active ? "32px" : "10px",
                  height: "10px",
                  background: active
                    ? `linear-gradient(90deg, ${CARD_COLORS[i].from}, ${CARD_COLORS[i].to})`
                    : "#d1fae5",
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
