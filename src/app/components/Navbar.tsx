"use client";

import { useEffect, useRef, useState } from "react";
import NBLogo from "./NBLogo";

export default function Navbar() {
  const [linksVisible, setLinksVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setLinksVisible(current < lastScrollY.current || current < 10);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* ── Logo row — always visible ── */}
      <div className="w-full flex justify-center bg-white border-b border-emerald-100 py-2 shadow-sm">
        <NBLogo scrollRange={600} />
      </div>

      {/* ── Links row — slides away on scroll down ── */}
      <div
        className={`w-full flex justify-center bg-white border-b border-emerald-200 shadow-sm
          transition-transform duration-300 ease-in-out
          ${linksVisible ? "translate-y-0" : "-translate-y-[200%]"}`}
      >
        <ul className="flex gap-6 text-base font-medium text-gray-700 py-2">
          <li><a href="#about"    className="hover:text-emerald-600 transition-colors">About</a></li>
          <li><a href="#projects" className="hover:text-emerald-600 transition-colors">Projects</a></li>
          <li><a href="#contact"  className="hover:text-emerald-600 transition-colors">Contact</a></li>
          <li>
            <a href="https://github.com/natibirhauz" target="_blank" rel="noopener noreferrer"
              className="hover:text-emerald-600 transition-colors">GitHub</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/nati-birhauz-296724159/" target="_blank" rel="noopener noreferrer"
              className="hover:text-emerald-600 transition-colors">LinkedIn</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
