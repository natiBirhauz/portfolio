"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Reveal from "./components/Reveal";
import NBLogo from "./components/NBLogo";
import SkillSpotlight from "./components/SkillSpotlight";
import PerformanceMetrics from "./components/PerformanceMetrics";
import ThreeBackground from "./components/ThreeBackground";
import { useLang } from "./context/LangContext";
import ChatAgent from "./components/AIChat/ChatAgent";

/* ---------------------------------------------------
   Static data
--------------------------------------------------- */
const PROJECTS = [
  {
    key: 0,
    title: "DataMap",
    image: "/datamap.png",
    link: "https://data-map-beta.vercel.app/",
    git: "https://github.com/natiBirhauz/DataMap",
    tags: ["Python", "JavaScript", "TensorFlow", "LangGraph", "Git", "Vercel", "AI/ML Engineer", "Programmer"],
    download: null,
    hideViewProject: false,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    key: 1,
    title: "EmotionFlow",
    image: "/emotionflow.png",
    link: "https://emotion-flow-llm-six.vercel.app/",
    git: "https://github.com/natiBirhauz/EmotionFlow-LLM",
    tags: ["Python", "JavaScript", "AI/ML Engineer", "LangGraph", "Programmer"],
    download: null,
    hideViewProject: false,
    accent: "from-purple-500 to-pink-500",
  },
  {
    key: 2,
    title: "תמצא לי",
    image: "/tmtza.png",
    link: "https://isr-aeli.vercel.app/",
    git: null,
    tags: ["Python", "JavaScript", "LangGraph", "PyTorch", "Vercel", "AI/ML Engineer"],
    download: null,
    hideViewProject: false,
    accent: "from-violet-500 to-blue-500",
  },
  {
    key: 3,
    title: "BallStrike",
    image: "/ballstrike.png",
    link: "https://github.com/natiBirhauz/BallStrike",
    git: "https://github.com/natiBirhauz/BallStrike",
    tags: ["C#", "Unity", "Git", "Game Developer", "Programmer"],
    download: "https://natibirhauz.itch.io/ball-strike",
    hideViewProject: true,
    accent: "from-orange-500 to-red-500",
  },
] as const;

const normalize = (s: string) => s.toLowerCase().trim();

/* ---------------------------------------------------
   Component
--------------------------------------------------- */
export default function Home() {
  const { t } = useLang();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const skillLabels: Record<string, string> = {
    skills: t.skills.heading,
    tools: t.skills.tools,
    languages: t.skills.languages,
  };

  // Reset scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBadgeClick = (item: string) => {
    const next = activeFilter === item ? null : item;
    setActiveFilter(next);
    if (next) setTimeout(() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const isHighlighted = (tags: readonly string[]) =>
    activeFilter === null || tags.some(tag => normalize(tag) === normalize(activeFilter));

  return (
    <div className="relative overflow-x-clip min-h-screen w-full pt-16 md:pt-0">

      {/* 3D Background */}
      <ThreeBackground />

      {/* 2D Low-Poly Triangulated Background - Delaunay Triangulation */}
      <div className="fixed inset-0 z-[1]">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          {/* Animated morphing triangular mesh */}
          {(() => {
            const triangles = [];
            // Pure light green/mint colors, no yellow
            const colors = [
              '#86efac', // light green
              '#bbf7d0', // very light green
              '#a7f3d0', // mint green
              '#6ee7b7', // emerald light
              '#d1fae5', // pale mint
              '#dcfce7', // very pale green
              '#ccfbf1', // cyan-green
              '#a5f3fc', // light cyan
              '#5eead4', // teal light
            ];
            
            // Create a grid of points with random offsets (vertices)
            const rows = 8;  // reduced from 15 for bigger triangles
            const cols = 12; // reduced from 25 for bigger triangles
            const points: [number, number][] = [];
            
            for (let row = 0; row <= rows; row++) {
              for (let col = 0; col <= cols; col++) {
                const x = (col / cols) * 1920 + (Math.random() - 0.5) * 60;
                const y = (row / rows) * 1080 + (Math.random() - 0.5) * 60;
                points.push([x, y]);
              }
            }
            
            // Simple grid-based triangulation (two triangles per quad)
            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < cols; col++) {
                const i = row * (cols + 1) + col;
                const topLeft = points[i];
                const topRight = points[i + 1];
                const bottomLeft = points[i + cols + 1];
                const bottomRight = points[i + cols + 2];
                
                // Create unique animation delays for each triangle
                const delay1 = (row * 0.3 + col * 0.2).toFixed(1);
                const delay2 = (row * 0.3 + col * 0.2 + 0.15).toFixed(1);
                
                // First triangle (top-left, top-right, bottom-left)
                triangles.push(
                  <polygon
                    key={`${row}-${col}-a`}
                    points={`${topLeft[0]},${topLeft[1]} ${topRight[0]},${topRight[1]} ${bottomLeft[0]},${bottomLeft[1]}`}
                    fill={colors[Math.floor(Math.random() * colors.length)]}
                    opacity={0.9}
                    style={{
                      animation: `triangleWiggle 8s ease-in-out infinite`,
                      animationDelay: `${delay1}s`,
                      transformOrigin: 'center',
                    }}
                  />
                );
                
                // Second triangle (top-right, bottom-right, bottom-left)
                triangles.push(
                  <polygon
                    key={`${row}-${col}-b`}
                    points={`${topRight[0]},${topRight[1]} ${bottomRight[0]},${bottomRight[1]} ${bottomLeft[0]},${bottomLeft[1]}`}
                    fill={colors[Math.floor(Math.random() * colors.length)]}
                    opacity={0.9}
                    style={{
                      animation: `triangleWiggle 8s ease-in-out infinite`,
                      animationDelay: `${delay2}s`,
                      transformOrigin: 'center',
                    }}
                  />
                );
              }
            }
            
            return triangles;
          })()}
        </svg>
      </div>

      {/* ---------------------------------------------------- Background animation (NB Logo) ---------------------------------------------------- */}
      <div className="relative z-[3]">
        <NBLogo scrollRange={1600} />
      </div>

      {/* ---------------------------------------------------- ABOUT ---------------------------------------------------- */}
      <section id="about" className="flex flex-col items-center justify-center min-h-screen gap-10 text-center relative z-10 px-6 pt-8">

        {/* Avatar */}
        <Reveal direction="down">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse-ring" />
            <div className="relative rounded-full border-[10px] border-emerald-400 shadow-2xl overflow-hidden w-[280px] h-[280px] bg-white">
              <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1.2 }}
                whileHover={{ scale: 1.27, rotate: 2 }}
                whileTap={{ scale: 1.0, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-full h-full flex items-center justify-center"
              >
                <Image
                  src="/Picture.png"
                  alt="Nati Birhauz"
                  width={280}
                  height={280}
                  className="animate-float cursor-pointer"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </Reveal>

        {/* Name */}
        <Reveal direction="up" delay={150}>
          <h1 className="text-8xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent leading-tight">
            {t.hero.title}
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal direction="up" delay={300}>
          <h2 className="text-4xl font-bold animate-color-cycle">
            {t.hero.subtitle}
          </h2>
        </Reveal>

        {/* Bio card — glassmorphism */}
        <Reveal direction="up" delay={400} className="w-full max-w-4xl">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
          >
            {/* shimmer border */}
            <div
              className="absolute -inset-[3px] rounded-3xl animate-shimmer-border pointer-events-none"
              style={{ background: "linear-gradient(120deg, #6ee7b7, #7c3aed, #2dd4bf, #059669, #6ee7b7)" }}
            />
            <div
              className="relative rounded-3xl px-16 py-14 shadow-2xl flex flex-col gap-6 text-center overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1.5px solid rgba(255,255,255,0.7)",
                boxShadow: "0 40px 80px -20px rgba(5,150,105,0.18), 0 0 0 1px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-emerald-400 via-violet-500 to-teal-400" />

              <p className="animate-blur-up text-5xl font-black bg-gradient-to-r from-emerald-500 via-violet-500 to-teal-500 bg-clip-text text-transparent" style={{ animationDelay: "0.5s" }}>
                {t.bio.greeting}
              </p>

              <div className="animate-blur-up h-px bg-gradient-to-r from-emerald-300 via-violet-300 to-transparent" style={{ animationDelay: "0.65s" }} />

              <p className="animate-blur-up text-2xl text-gray-700 leading-relaxed font-medium" style={{ animationDelay: "0.75s" }}>
                {t.bio.line1}
              </p>
              <p className="animate-blur-up text-2xl text-gray-700 leading-relaxed" style={{ animationDelay: "0.9s" }}>
                {t.bio.line2a}{" "}
                <span className="font-extrabold text-emerald-600">{t.bio.line2b}</span>{" "}
                {t.bio.line2c}{" "}
                <span className="font-extrabold text-violet-600">{t.bio.line2d}</span>.
              </p>
              <p className="animate-blur-up text-2xl text-gray-700 leading-relaxed" style={{ animationDelay: "1.05s" }}>
                {t.bio.line3a}{" "}
                <span className="font-extrabold text-teal-600">{t.bio.line3b}</span>.
              </p>
              <p className="animate-blur-up text-2xl text-gray-700 leading-relaxed" style={{ animationDelay: "1.2s" }}>
                <span className="font-extrabold text-violet-600">{t.bio.line4a}</span>
                {t.bio.line4b}
              </p>
            </div>
          </motion.div>
        </Reveal>

      </section>

      {/* ---------------------------------------------------- AI AGENT CHAT ---------------------------------------------------- */}
      <section id="ai-agent" className="flex flex-col items-center gap-8 py-12 relative z-10 px-6">
        <ChatAgent />
      </section>

      {/* ---------------------------------------------------- WHAT I DO (carousel + skill filter) ---------------------------------------------------- */}
      <SkillSpotlight
        onBadgeClick={handleBadgeClick}
        activeFilter={activeFilter}
        skillLabels={skillLabels}
      />

      {/* ---------------------------------------------------- PROJECTS ---------------------------------------------------- */}
      <section id="projects" className="flex flex-col items-center gap-10 py-20 relative z-10 px-6">

        <Reveal direction="up">
          <h2 className="text-7xl font-extrabold text-center bg-gradient-to-r from-emerald-600 via-violet-500 to-teal-500 bg-clip-text text-transparent">
            {t.projects.heading}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {PROJECTS.map((project, idx) => {
            const highlighted = isHighlighted(project.tags);
            const dirs = ["left", "up", "right"] as const;
            const delays = [0, 150, 300] as const;
            return (
              <Reveal key={project.key} direction={dirs[idx % 3]} delay={delays[idx % 3]}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className={`relative rounded-2xl flex flex-col gap-4 p-6 border-2 h-full overflow-hidden
                    ${highlighted ? "border-emerald-400" : "border-white/60"}`}
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: highlighted && activeFilter
                      ? "0 24px 48px -8px rgba(5,150,105,0.20), inset 0 1px 0 rgba(255,255,255,0.9)"
                      : "0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.85)",
                  }}
                >
                  {highlighted && activeFilter && (
                    <span className="absolute inset-0 rounded-2xl ring-2 ring-emerald-400 pointer-events-none" />
                  )}

                  {/* Colored top accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r ${project.accent}`} />

                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="block mt-1 rounded-xl overflow-hidden shadow-md">
                    <div className="relative w-full h-48 sm:h-56 lg:h-48">
                      <Image
                        src={project.image}
                        alt={t.projectList[project.key].title}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                  </a>

                  <h3 dir="ltr" className={`text-2xl font-extrabold text-center bg-gradient-to-r ${project.accent} bg-clip-text text-transparent`}>
                    {t.projectList[project.key].title}
                  </h3>

                  <p className="text-base text-gray-600 leading-relaxed">
                    {t.projectList[project.key].description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => {
                      const active = activeFilter !== null && normalize(tag) === normalize(activeFilter);
                      return (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200
                            ${active ? "bg-emerald-500 text-white ring-2 ring-emerald-300 scale-110" : "bg-emerald-50 text-emerald-700"}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 mt-auto pt-2 justify-center flex-wrap">
                    {!project.hideViewProject && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer"
                        className={`px-5 py-2 rounded-full bg-gradient-to-r ${project.accent} text-white text-sm font-bold shadow hover:scale-105 transition-transform`}>
                        {t.projects.viewProject}
                      </a>
                    )}
                    {project.git && (
                      <a href={project.git} target="_blank" rel="noopener noreferrer"
                        className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-bold shadow hover:scale-105 transition-transform">
                        {t.projects.github}
                      </a>
                    )}
                    {project.download && (
                      <a href={project.download} target="_blank" rel="noopener noreferrer"
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold shadow hover:scale-105 transition-transform">
                        {t.projects.play}
                      </a>
                    )}
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- CONTACT ---------------------------------------------------- */}
      <section id="contact" className="flex flex-col items-center gap-8 py-20 relative z-10 px-6 text-center">

        <Reveal direction="up">
          <h2 className="text-6xl font-extrabold text-gray-800">{t.contact.heading}</h2>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <div className="flex gap-5 flex-wrap justify-center">
            {[
              { href: "https://github.com/natibirhauz",                              label: t.nav.github,   cls: "from-gray-800 to-emerald-700" },
              { href: "https://www.linkedin.com/in/nati-birhauz-296724159/",         label: t.nav.linkedin, cls: "from-blue-600 to-teal-500"    },
              { href: "mailto:nati4455@gmail.com",                                   label: t.contact.email,cls: "from-violet-500 to-emerald-500" },
            ].map(({ href, label, cls }) => (
              <motion.a
                key={href}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                whileHover={{ y: -4, scale: 1.06, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className={`px-8 py-3 rounded-full bg-gradient-to-r ${cls} text-white text-lg font-bold shadow-lg`}
              >
                {label}
              </motion.a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Performance Metrics */}
      <PerformanceMetrics />

    </div>
  );
}
