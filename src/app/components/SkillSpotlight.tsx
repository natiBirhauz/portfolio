"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../context/LangContext";

/* ---------------------------------------------------- constants ---------------------------------------------------- */
const CARD_COLORS = [
  { from: "#059669", to: "#0d9488", glow: "rgba(5,150,105,0.35)"   },
  { from: "#7c3aed", to: "#2563eb", glow: "rgba(124,58,237,0.35)"  },
  { from: "#0891b2", to: "#059669", glow: "rgba(8,145,178,0.35)"   },
  { from: "#f59e0b", to: "#ef4444", glow: "rgba(245,158,11,0.35)"  },
];

const SKILLS = [
  {
    id: "skills",
    icon: "🧑‍💻",
    borderClass: "border-emerald-300",
    headerClass: "text-emerald-700",
    badgeBase: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    badgeActive: "bg-emerald-500 text-white ring-2 ring-emerald-400",
    chevron: "text-emerald-500",
    items: ["Programmer","QA","Network Engineer","Project Manager","AI/ML Engineer","Game Developer"],
  },
  {
    id: "tools",
    icon: "🛠️",
    borderClass: "border-violet-300",
    headerClass: "text-violet-700",
    badgeBase: "bg-violet-100 text-violet-800 hover:bg-violet-200",
    badgeActive: "bg-violet-500 text-white ring-2 ring-violet-400",
    chevron: "text-violet-500",
    items: ["TensorFlow","PyTorch","LangGraph","Wireshark","RF Analyzer","Jira","Git","Firebase","Unity","WordPress","Photoshop","Vercel"],
  },
  {
    id: "languages",
    icon: "💻",
    borderClass: "border-cyan-300",
    headerClass: "text-cyan-700",
    badgeBase: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    badgeActive: "bg-cyan-500 text-white ring-2 ring-cyan-400",
    chevron: "text-cyan-500",
    items: ["CUDA","Java","C","C++","C#","Python","JavaScript","TypeScript","HTML","CSS","Android"],
  },
] as const;

/* ---------------------------------------------------- props ---------------------------------------------------- */
interface Props {
  onBadgeClick: (item: string) => void;
  activeFilter: string | null;
  skillLabels: Record<string, string>;
}

/* ---------------------------------------------------- component ---------------------------------------------------- */
export default function SkillSpotlight({ onBadgeClick, activeFilter, skillLabels }: Props) {
  const { t } = useLang();
  const items = t.skillsSection.items;
  const n = items.length;

  // raw progress 0→1 driven purely by scrollY vs section offsetTop
  const [progress, setProgress] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      // absolute top of section from document top
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled = window.scrollY - sectionTop;
      setProgress(Math.min(Math.max(scrolled / scrollable, 0), 1));
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      update();
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // which card index is currently "active" (closest to center)
  const activeIdx = Math.round(progress * (n - 1));

  return (
    <section
      id="skills-section"
      ref={sectionRef}
      className="relative z-10"
      style={{ minHeight: `calc(${n + 1} * 100vh)` }}
    >
      {/* sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center gap-5 overflow-visible z-20">

        {/* -- heading -- */}
        <div className="text-center px-8 shrink-0">
          <h2 className="text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-violet-500 to-teal-500 bg-clip-text text-transparent mb-2">
            {t.skillsSection.heading}
          </h2>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto font-semibold drop-shadow-sm">
            {t.skillsSection.intro}
          </p>
        </div>

        {/* -- carousel -- */}
        {/*
          Card i is centred when progress = i/(n-1).
          At progress=0: card 0 has dist=0 → perfectly centred.
          Cards to the right have positive dist → shifted right; they scroll in as progress increases.
        */}
        <div className="relative w-full shrink-0" style={{ height: 320 }}>
          {items.map((item, i) => {
            const centerAt = n > 1 ? i / (n - 1) : 0;
            // dist: 0 = centred, positive = right of centre, negative = left
            const dist = (progress - centerAt) * (n - 1);
            const slideFactor = isMobile ? 28 : 40;
            const tx = -dist * slideFactor;          // vw — how far to slide
            const scale = Math.max(0.55, 1 - Math.abs(dist) * 0.20);
            const opacity = Math.max(0.25, 1 - Math.abs(dist) * 0.45);
            const zIndex = Math.round(100 - Math.abs(dist) * 25);
            const colors = CARD_COLORS[i % CARD_COLORS.length];
            const isCentered = Math.abs(dist) < 0.3;

            return (
              <div
                key={i}
                className="absolute top-0 left-1/2"
                style={{
                  width: "min(560px, 84vw)",
                  transform: `translateX(calc(-50% + ${tx}vw)) scale(${scale})`,
                  opacity,
                  zIndex,
                  // NO CSS transition — scroll drives this directly for instant response
                  willChange: "transform, opacity",
                }}
              >
                {/* glow halo — only on centred card */}
                {isCentered && (
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      boxShadow: `0 0 80px 20px ${colors.glow}`,
                      opacity: 1 - Math.abs(dist) * 2,
                    }}
                  />
                )}

                {/* glassmorphism card */}
                <motion.div
                  whileHover={isCentered ? { y: -6, scale: 1.02 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: `1.5px solid rgba(255,255,255,0.6)`,
                    boxShadow: isCentered
                      ? `0 32px 64px -12px ${colors.glow}, 0 0 0 1px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.9)`
                      : "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
                  }}
                >
                  {/* coloured top stripe */}
                  <div
                    className="h-[3px] w-full"
                    style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
                  />

                  <div className="px-10 py-8">
                    <span
                      className="text-sm font-bold tracking-[0.2em] uppercase mb-2 block"
                      style={{ color: colors.from }}
                    >
                      {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </span>

                    <h3
                      className="text-3xl font-black mb-3 bg-clip-text text-transparent"
                      style={{ backgroundImage: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                    >
                      {item.title}
                    </h3>

                    <p className="text-lg text-gray-600 leading-relaxed">{item.body}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* -- progress dots -- */}
        <div className="flex justify-center gap-3 shrink-0">
          {items.map((_, i) => {
            const active = i === activeIdx;
            const c = CARD_COLORS[i];
            return (
              <motion.div
                key={i}
                animate={{ width: active ? 32 : 10, opacity: active ? 1 : 0.4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="rounded-full h-[10px]"
                style={{ background: active ? `linear-gradient(90deg,${c.from},${c.to})` : "#d1fae5" }}
              />
            );
          })}
        </div>

        {/* -- skill filter cards -- */}
        <div className="grid grid-cols-1 gap-4 px-6 max-w-5xl mx-auto w-full shrink-0">
          {SKILLS.map((skill) => {
            const isOpen = openDropdown === skill.id;
            return (
              <motion.div
                key={skill.id}
                layout
                className={`rounded-2xl border-2 ${skill.borderClass} overflow-hidden`}
                style={{
                  background: "rgba(255,255,255,0.80)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: isOpen
                    ? "0 20px 40px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)"
                    : "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
                whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)" }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(prev => prev === skill.id ? null : skill.id);
                  }}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{skill.icon}</span>
                    <h3 className={`font-bold text-lg ${skill.headerClass}`}>{skillLabels[skill.id]}</h3>
                  </div>
                  <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-5 h-5 ${skill.chevron}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="dropdown"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 px-5 pb-5">
                        {skill.items.map(item => (
                          <motion.button
                            key={item}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onBadgeClick(item);
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-150 cursor-pointer select-none
                              ${activeFilter === item ? skill.badgeActive : skill.badgeBase}`}
                          >
                            {item}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
