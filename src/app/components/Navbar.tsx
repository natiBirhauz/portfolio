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
    <nav className={`w-full flex justify-between items-center px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-emerald-200 dark:border-emerald-900 shadow-sm fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out ${visible ? "translate-y-0" : "-translate-y-full"}`}>
      <ul className="flex gap-5 text-sm font-medium text-gray-700 dark:text-gray-200">
        <li><a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{t.nav.about}</a></li>
        <li><a href="#skills-section" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{t.nav.skills}</a></li>
        <li><a href="#projects" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{t.nav.projects}</a></li>
        <li><a href="#contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{t.nav.contact}</a></li>
        <li><a href="https://github.com/natibirhauz" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{t.nav.github}</a></li>
        <li><a href="https://www.linkedin.com/in/nati-birhauz-296724159/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{t.nav.linkedin}</a></li>
      </ul>
      <div className="flex gap-3 items-center">
        <button onClick={toggleLang} className="px-3 py-1 rounded-full text-xs font-bold border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors">
          {lang === "en" ? "HE" : "EN"}
        </button>
        <button onClick={toggleTheme} aria-label="Toggle dark mode" className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
