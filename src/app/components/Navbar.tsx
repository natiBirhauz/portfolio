"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLang } from "../context/LangContext";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { theme, toggle: toggleTheme } = useTheme();
  const { t, toggle: toggleLang, lang } = useLang();

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScrollY.current || current < 10);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 h-full w-16 z-50 flex flex-col items-center justify-between py-6
        bg-white/80 dark:bg-[#061410]/80 backdrop-blur
        border-r border-emerald-200 dark:border-emerald-900 shadow-sm
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Nav links — icons + tooltips */}
      <ul className="flex flex-col gap-5 items-center">
        {[
          { href: "#about",         label: t.nav.about,    icon: "👤" },
          { href: "#skills-section",label: t.nav.skills,   icon: "🧠" },
          { href: "#projects",      label: t.nav.projects, icon: "📁" },
          { href: "#contact",       label: t.nav.contact,  icon: "✉️" },
          { href: "https://github.com/natibirhauz", label: t.nav.github, icon: "🐙", external: true },
          { href: "https://www.linkedin.com/in/nati-birhauz-296724159/", label: t.nav.linkedin, icon: "💼", external: true },
        ].map(({ href, label, icon, external }) => (
          <li key={href}>
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              title={label}
              className="group relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
            >
              <span className="text-xl">{icon}</span>
              {/* tooltip */}
              <span className="absolute left-14 px-2 py-1 rounded-md bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {label}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Bottom controls */}
      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={toggleLang}
          title={lang === "en" ? "עברית" : "English"}
          className="w-10 h-10 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
        >
          {lang === "en" ? "HE" : "EN"}
        </button>
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
