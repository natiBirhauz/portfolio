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
        fixed z-50
        bg-white/90 backdrop-blur shadow-md
        transition-transform duration-300 ease-in-out
        
        /* Mobile: top horizontal bar */
        top-0 left-0 right-0 h-16
        flex flex-row items-center justify-between px-4
        border-b border-emerald-200
        ${visible ? "translate-y-0" : "-translate-y-full"}
        
        /* Desktop: right vertical sidebar */
        md:top-0 md:right-0 md:left-auto md:bottom-0 md:h-full md:w-20
        md:flex-col md:justify-between md:py-6 md:px-0
        md:border-l md:border-b-0
        md:${visible ? "translate-x-0 translate-y-0" : "translate-x-full translate-y-0"}
      `}
    >
      {/* Nav links */}
      <ul className="flex flex-row md:flex-col gap-1 items-center md:w-full md:px-1">
        {links.map(({ href, label, external }) => (
          <li key={href} className="md:w-full">
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="block text-center text-[11px] font-semibold py-2 px-2 md:px-1 rounded-xl
                text-gray-700 hover:bg-emerald-100 transition-colors leading-tight whitespace-nowrap"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Language toggle — flag background */}
      <div className="md:w-full md:px-2">
        <button
          onClick={toggleLang}
          title={lang === "en" ? "Switch to Hebrew" : "Switch to English"}
          className="w-12 h-12 md:w-full rounded-xl overflow-hidden border-2 border-emerald-300 shadow hover:scale-105 transition-transform relative"
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
