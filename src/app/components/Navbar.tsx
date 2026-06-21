"use client";

import { useEffect, useRef, useState } from "react";
import NBLogo from "./NBLogo";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
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
    <>
      {/* NB logo — always visible, independent of navbar slide */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[60]">
        <NBLogo scrollRange={600} />
      </div>

      {/* Nav links — slide away on scroll down */}
      <nav
        className={`w-full flex flex-col items-center px-8 py-3 bg-white border-b border-emerald-200 shadow-sm fixed top-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* spacer so links sit below the logo */}
        <div className="h-10 w-full" />

        <ul className="flex gap-6 text-base font-medium text-gray-700 mt-1">
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
      </nav>
    </>
  );
}
