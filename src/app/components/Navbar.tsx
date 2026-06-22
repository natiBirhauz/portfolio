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

  const links = [
    { href: "#about",          label: t.nav.about,    external: false },
    { href: "#skills-section", label: t.nav.skills,   external: false },
    { href: "#projects",       label: t.nav.projects, external: false },
    { href: "#contact",        label: t.nav.contact,  external: false },
    { href: "https://github.com/natibirhauz",                      label: t.nav.github,   external: true },
    { href: "https://www.linkedin.com/in/nati-birhauz-296724159/", label: t.nav.linkedin, external: true },
  ];

  return (
    <nav
      className={`
        fixed top-0 right-0 h-full w-20 z-50
        flex flex-col items-center justify-between py-6
        bg-white/85 dark:bg-[#061410]/90 backdrop-blur
        border-l border-emerald-200 dark:border-emerald-900 shadow-md
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* Nav links */}
      <ul className="flex flex-col gap-1 items-center w-full px-1">
        {links.map(({ href, label, external }) => (
          <li key={href} className="w-full">
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="block w-full text-center text-[11px] font-semibold py-2 px-1 rounded-xl
                text-gray-700 dark:text-emerald-300
                hover:bg-emerald-100 dark:hover:bg-emerald-900
                transition-colors leading-tight"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Bottom controls */}
      <div className="flex flex-col gap-2 items-center w-full px-2">

        {/* Language toggle — flag background */}
        <button
          onClick={toggleLang}
          title={lang === "en" ? "Switch to Hebrew" : "Switch to English"}
          className="w-full h-10 rounded-xl overflow-hidden border-2 border-emerald-300 dark:border-emerald-700 shadow hover:scale-105 transition-transform relative"
          style={{
            backgroundImage: `url(${lang === "en"
              ? "https://flagcdn.com/w40/il.png"
              : "https://flagcdn.com/w40/us.png"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            {lang === "en" ? "HE" : "EN"}
          </span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="w-full py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1
            border border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-200
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}
