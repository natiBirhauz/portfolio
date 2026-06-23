"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LangContext";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
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
        bg-white/90 backdrop-blur
        border-l border-emerald-200 shadow-md
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
                text-gray-700 hover:bg-emerald-100 transition-colors leading-tight"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Language toggle — flag background */}
      <div className="w-full px-2">
        <button
          onClick={toggleLang}
          title={lang === "en" ? "Switch to Hebrew" : "Switch to English"}
          className="w-full h-12 rounded-xl overflow-hidden border-2 border-emerald-300 shadow hover:scale-105 transition-transform relative"
          style={{
            backgroundImage: `url(${lang === "en"
              ? "https://flagcdn.com/w40/il.png"
              : "https://flagcdn.com/w40/us.png"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-gray-900 drop-shadow-[0_1px_3px_rgba(255,255,255,1)]">
            {lang === "en" ? "HE" : "EN"}
          </span>
        </button>
      </div>
    </nav>
  );
}
