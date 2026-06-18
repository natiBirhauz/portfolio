"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./components/Reveal";

/* ── skill data ─────────────────────────────────────────── */
const skills = [
  {
    id: "skills",
    label: "Skills",
    icon: "🧑‍💻",
    color: "emerald",
    items: ["Programmer", "QA", "Network Engineer", "Project Manager", "AI/ML Engineer", "Game Developer"],
  },
  {
    id: "tools",
    label: "Tools I Use",
    icon: "🛠️",
    color: "teal",
    items: ["TensorFlow", "PyTorch", "LangGraph", "Wireshark", "RF Analyzer", "Jira", "Git", "Firebase", "Unity", "WordPress", "Photoshop", "Vercel"],
  },
  {
    id: "languages",
    label: "Languages",
    icon: "💻",
    color: "green",
    items: ["CUDA", "Java", "C", "C++", "C#", "Python", "JavaScript", "TypeScript", "HTML", "CSS", "Android"],
  },
];

const colorMap: Record<string, {
  border: string; header: string;
  badge: string; badgeActive: string; chevron: string;
}> = {
  emerald: {
    border:      "border-emerald-200",
    header:      "text-emerald-700",
    badge:       "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    badgeActive: "bg-emerald-500 text-white ring-2 ring-emerald-400 scale-110",
    chevron:     "text-emerald-400",
  },
  teal: {
    border:      "border-teal-200",
    header:      "text-teal-700",
    badge:       "bg-teal-100 text-teal-800 hover:bg-teal-200",
    badgeActive: "bg-teal-500 text-white ring-2 ring-teal-400 scale-110",
    chevron:     "text-teal-400",
  },
  green: {
    border:      "border-green-200",
    header:      "text-green-700",
    badge:       "bg-green-100 text-green-800 hover:bg-green-200",
    badgeActive: "bg-green-500 text-white ring-2 ring-green-400 scale-110",
    chevron:     "text-green-400",
  },
};

/* ── projects ───────────────────────────────────────────── */
const projects = [
  {
    title: "DataMap",
    description: "DataMap helps you map and understand data used for large language models. Python backend + web frontend for uploading, exploring, tagging, and visualizing prompt–response data.",
    image: "/globe.svg",
    link: "https://data-map-beta.vercel.app/",
    git: "https://github.com/natiBirhauz/DataMap",
    tags: ["Python", "JavaScript", "HTML", "CSS", "TensorFlow", "LangGraph", "Git", "Vercel", "AI/ML Engineer", "Programmer"],
    download: null,
  },
  {
    title: "תמצא לי",
    description: "An AI tool to check the availability and prices for EVERYTHING — from a pen to a house. This demo is made with AI search prediction.",
    image: "/window.svg",
    link: "https://isr-aeli.vercel.app/",
    git: null,
    tags: ["Python", "JavaScript", "HTML", "CSS", "LangGraph", "PyTorch", "Vercel", "AI/ML Engineer", "Programmer"],
    download: null,
  },
  {
    title: "BallStrike",
    description: "A fast-paced 3D arcade dodging game built with Unity as part of the Master's degree in Computer Science at Azrieli College of Engineering.",
    image: "/file.svg",
    link: "https://github.com/natiBirhauz/BallStrike",
    git: "https://github.com/natiBirhauz/BallStrike",
    tags: ["C#", "Unity", "Git", "Game Developer", "Programmer"],
    download: null,
  },
];

const normalize = (s: string) => s.toLowerCase().trim();
const skillDirections = ["left", "up", "right"] as const;

/* ── component ──────────────────────────────────────────── */
export default function Home() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeFilter, setActiveFilter]  = useState<string | null>(null);

  const toggleDropdown = (id: string) =>
    setOpenDropdown(openDropdown === id ? null : id);

  const handleBadgeClick = (item: string) => {
    setActiveFilter(activeFilter === item ? null : item);
    if (activeFilter !== item) {
      setTimeout(() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const isProjectHighlighted = (project: typeof projects[number]) =>
    activeFilter === null ||
    project.tags.some((tag) => normalize(tag) === normalize(activeFilter));

  return (
    <div className="relative overflow-x-clip min-h-screen w-full bg-white">

      {/* ── ABOUT ─────────────────────────────────────── */}
      <section id="about" className="flex flex-col items-center justify-center min-h-[90vh] gap-10 text-center relative z-10 mt-16 px-4">

        <Reveal direction="down">
          <div className="group relative">
            <Image
              src="/nati-avatar.webp"
              alt="Nati Birhauz Avatar"
              width={260} height={260}
              className="rounded-full shadow-2xl border-8 border-emerald-400 group-hover:scale-105 transition-transform duration-500 bg-white"
              priority
            />
            <span className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-full blur-sm animate-bounce" />
          </div>
        </Reveal>

        <Reveal direction="up" delay={150}>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
            Netanel Birhauz
          </h1>
        </Reveal>

        <Reveal direction="up" delay={300}>
          <h2 className="text-2xl font-semibold text-gray-700">
            Programmer &amp; A.I Specialist
          </h2>
        </Reveal>

        <Reveal direction="left" delay={300}>
          <p className="max-w-xl text-lg text-gray-600">
            Hi!<br /><br />
            Welcome to my portfolio where you can see my projects!<br />
            My main focus is on AI and networks.<br />
            I&apos;ve been a software engineer since I was 15 years old.<br />
            M.Sc. in Software Engineering with a specialization in A.I.
          </p>
        </Reveal>

        {/* Skill cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-4 items-start">
          {skills.map((skill, i) => {
            const isOpen = openDropdown === skill.id;
            const colors = colorMap[skill.color];
            return (
              <Reveal key={skill.id} direction={skillDirections[i]} delay={i === 1 ? 200 : 0}>
                <div className={`bg-white rounded-2xl shadow-lg border ${colors.border} transition-all duration-300 ${isOpen ? "shadow-2xl scale-105" : "hover:scale-105 hover:shadow-xl"}`}>
                  <button onClick={() => toggleDropdown(skill.id)} className="w-full flex items-center justify-between p-6 cursor-pointer focus:outline-none">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{skill.icon}</span>
                      <h3 className={`font-bold text-lg ${colors.header}`}>{skill.label}</h3>
                    </div>
                    <svg className={`w-5 h-5 transition-transform duration-300 ${colors.chevron} ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap gap-2 px-6 pb-6">
                        {skill.items.map((item) => (
                          <button key={item} onClick={() => handleBadgeClick(item)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer select-none ${activeFilter === item ? colors.badgeActive : colors.badge}`}
                            title={`Filter projects by "${item}"`}
                          >{item}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────── */}
      <section id="projects" className="flex flex-col items-center justify-center min-h-[70vh] gap-8 py-16 relative z-10 px-4">
        <Reveal direction="right">
          <div className="flex flex-col items-center gap-2 w-full">
            <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
              Projects
            </h1>
            

          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {projects.map((project, idx) => {
            const highlighted = isProjectHighlighted(project);
            const dirs    = ["left", "up", "right"] as const;
            const delays  = [0, 150, 300]            as const;
            return (
              <Reveal key={idx} direction={dirs[idx % 3]} delay={delays[idx % 3]}>
                <div className={`relative bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border transition-all duration-500 h-full
                  ${highlighted
                    ? "border-emerald-400 shadow-emerald-100 shadow-xl scale-[1.03]"
                    : "border-gray-200"}
                  hover:scale-[1.05] hover:shadow-2xl`}
                >
                  {highlighted && activeFilter && (
                    <span className="absolute inset-0 rounded-2xl ring-2 ring-emerald-400 pointer-events-none" />
                  )}

                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="block mx-auto">
                    <Image src={project.image} alt={project.title} width={100} height={100}
                      className="rounded-xl shadow-md hover:scale-110 transition-transform duration-300 bg-white p-2" />
                  </a>

                  <h2 dir="ltr" className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {project.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.tags.map((tag, i) => {
                      const active = activeFilter !== null && normalize(tag) === normalize(activeFilter ?? "");
                      return (
                        <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200
                          ${active ? "bg-emerald-500 text-white ring-2 ring-emerald-300 scale-110" : "bg-emerald-50 text-emerald-800"}`}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex gap-4 mt-auto pt-2 justify-center flex-wrap">
                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow hover:scale-105 transition-transform duration-200">
                      View Project
                    </a>
                    {project.git && (
                      <a href={project.git} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-full bg-gray-800 text-white text-sm font-semibold shadow hover:scale-105 transition-transform duration-200">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────── */}
      <section id="contact" className="flex flex-col items-center justify-center min-h-[40vh] gap-8 py-16 relative z-10 px-4">
        <Reveal direction="left">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Where to find me</h1>
        </Reveal>
        <Reveal direction="up" delay={200}>
          <div className="flex gap-6">
            <a href="https://github.com/natibirhauz" target="_blank" rel="noopener noreferrer"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-800 to-emerald-700 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/nati-birhauz-296724159/" target="_blank" rel="noopener noreferrer"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300">
              LinkedIn
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
