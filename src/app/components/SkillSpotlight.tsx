"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LangContext";

const CARD_COLORS = [
  { from: "#059669", to: "#0d9488", border: "#6ee7b7" },
  { from: "#7c3aed", to: "#2563eb", border: "#a78bfa" },
  { from: "#0891b2", to: "#059669", border: "#67e8f9" },
  { from: "#f59e0b", to: "#ef4444", border: "#fcd34d" },
];

const SKILLS = [
  {
    id: "skills",
    icon: "🧑‍💻",
    borderClass: "border-emerald-300",
    headerClass: "text-emerald-700",
    badgeClass: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    badgeActiveClass: "bg-emerald-500 text-white ring-2 ring-emerald-400 scale-110",
    chevronClass: "text-emerald-500",
    items: ["Programmer", "QA", "Network Engineer", "Project Manager", "AI/ML Engineer", "Game Developer"],
  },
  {
    id: "tools",
    icon: "🛠️",
    borderClass: "border-violet-300",
    headerClass: "text-violet-700",
    badgeClass: "bg-violet-100 text-violet-800 hover:bg-violet-200",
    badgeActiveClass: "bg-violet-500 text-white ring-2 ring-violet-400 scale-110",
    chevronClass: "text-violet-500",
    items: ["TensorFlow", "PyTorch", "LangGraph", "Wireshark", "RF Analyzer", "Jira", "Git", "Firebase", "Unity", "WordPress", "Photoshop", "Vercel"],
  },
  {
    id: "languages",
    icon: "💻",
    borderClass: "border-cyan-300",
    headerClass: "text-cyan-700",
    badgeClass: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    badgeActiveClass: "bg-cyan-500 text-white ring-2 ring-cyan-400 scale-110",
    chevronClass: "text-cyan-500",
    items: ["CUDA", "Java", "C", "C++", "C#", "Python", "JavaScript", "TypeScript", "HTML", "CSS", "Android"],
  },
] as const;

interface SkillSpotlightProps {
  onBadgeClick: (item: string) => void;
  activeFilter: string | null;
  skillLabels: Record<string, string>;
}

export default function SkillSpotlight({ onBadgeClick, activeFilter, skillLabels }: SkillSpotlightProps) {
  const { t } = useLang();
  const items = t.skillsSection.items;

  const [progress, setProgress] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      // progress 0→1 as we scroll through the section
      // starts at 0 when section top hits viewport top
      const scrolled = -top;
      const scrollable = height - window.innerHeight;
      const p = scrollable > 0 ? Math.min(Math.max(scrolled / scrollable, 0), 1) : 0;
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="skills-section"
      ref={sectionRef}
      className="relative z-10"
      style={{ minHeight: "500vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center gap-6">

        {/* ── Heading + intro ─────────────────────────── */}
        <div className="text-center px-8">
          <h2 className="text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-violet-500 to-teal-500 bg-clip-text text-transparent mb-3">
            {t.skillsSection.heading}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            {t.skillsSection.intro}
          </p>
        </div>

        {/* ── Horizontal carousel ──────────────────────── */}
        {/*
          Card i is centered when progress = i/(n-1).
          At progress=0, card 0 (i=0, centerAt=0) has dist=0 → centered from the start.
          Each unit of dist shifts the card 55vw horizontally.
        */}
        <div className="relative w-full overflow-visible" style={{ height: "300px" }}>
          {items.map((item, i) => {
            const n = items.length;
            const centerAt = n > 1 ? i / (n - 1) : 0;
            const dist = (progress - centerAt) * (n - 1);
            const tx = -dist * 55;
            const scale = Math.max(0.52, 1 - Math.abs(dist) * 0.22);
            const opacity = Math.max(0, 1 - Math.abs(dist) * 0.5);
            const zIndex = Math.round(100 - Math.abs(dist) * 30);
            const colors = CARD_COLORS[i % CARD_COLORS.length];

            return (
              <div
                key={i}
                className="absolute top-0 left-1/2"
                style={{
                  width: "min(540px, 82vw)",
                  marginLeft: "min(-270px, -41vw)",
                  transform: `translateX(${tx}vw) scale(${scale})`,
                  opacity,
                  zIndex,
                  willChange: "transform, opacity",
                  transition: "none",
                }}
              >
                {/* glow border */}
                <div
                  className="absolute -inset-[3px] rounded-3xl pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${colors.border}, ${colors.from}, ${colors.to}, ${colors.border})`,
                    opacity: Math.max(0, 1 - Math.abs(dist) * 0.6),
                  }}
                />
                <div className="relative rounded-3xl bg-white px-10 py-9 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl"
                    style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }} />

                  <span className="text-base font-bold mb-2 block tracking-widest uppercase" style={{ color: colors.from }}>
                    {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                  </span>

                  <h3 className="text-3xl font-black mb-3 bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
                    {item.title}
                  </h3>

                  <p className="text-lg text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* progress dots */}
        <div className="flex justify-center gap-3">
          {items.map((_, i) => {
            const n = items.length;
            const centerAt = n > 1 ? i / (n - 1) : 0;
            const dist = Math.abs(progress - centerAt) * n;
            const active = dist < 0.5;
            return (
              <div key={i} className="rounded-full transition-all duration-300" style={{
                width: active ? "32px" : "10px",
                height: "10px",
                background: active
                  ? `linear-gradient(90deg, ${CARD_COLORS[i].from}, ${CARD_COLORS[i].to})`
                  : "#d1fae5",
              }} />
            );
          })}
        </div>

        {/* ── Skill filter cards ───────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 max-w-5xl mx-auto w-full">
          {SKILLS.map((skill) => {
            const isOpen = openDropdown === skill.id;
            return (
              <div
                key={skill.id}
                className={`box-card rounded-2xl shadow-md border-2 ${skill.borderClass} transition-all duration-300 ${isOpen ? "shadow-xl scale-[1.02]" : "hover:scale-[1.02] hover:shadow-lg"}`}
              >
                <button
                  onClick={() => setOpenDropdown(prev => prev === skill.id ? null : skill.id)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{skill.icon}</span>
                    <h3 className={`font-bold text-lg ${skill.headerClass}`}>{skillLabels[skill.id]}</h3>
                  </div>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${skill.chevronClass} ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="flex flex-wrap gap-2 px-5 pb-5">
                      {skill.items.map(item => (
                        <button
                          key={item}
                          onClick={() => onBadgeClick(item)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer select-none
                            ${activeFilter === item ? skill.badgeActiveClass : skill.badgeClass}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
