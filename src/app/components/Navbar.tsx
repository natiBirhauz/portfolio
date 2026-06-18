"use client";

import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      // Show when scrolling up or at the very top; hide when scrolling down
      if (current < lastScrollY.current || current < 10) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full flex justify-between items-center px-8 py-5 bg-white border-b border-emerald-200 shadow-sm fixed top-0 left-0 z-50
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <span className="font-bold text-xl tracking-tight text-emerald-700">
        Nati Birhauz
      </span>
      <ul className="flex gap-6 text-base font-medium text-gray-700">
        <li><a href="#about"    className="hover:text-emerald-600 transition-colors">About</a></li>
        <li><a href="#projects" className="hover:text-emerald-600 transition-colors">Projects</a></li>
        <li><a href="#contact"  className="hover:text-emerald-600 transition-colors">Contact</a></li>
        <li>
          <a href="https://github.com/natibirhauz" target="_blank" rel="noopener noreferrer"
            className="hover:text-emerald-600 transition-colors">
            GitHub
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/nati-birhauz-296724159/" target="_blank" rel="noopener noreferrer"
            className="hover:text-emerald-600 transition-colors">
            LinkedIn
          </a>
        </li>
      </ul>
    </nav>
  );
}
