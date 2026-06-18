"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";

type Direction = "left" | "right" | "up" | "down" | "fade";

interface RevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;   // tailwind delay index: 0,75,150,300,500 ms
  className?: string;
}

const translateMap: Record<Direction, string> = {
  left:  "-translate-x-16",
  right: "translate-x-16",
  up:    "translate-y-16",
  down:  "-translate-y-16",
  fade:  "",
};

const delayMap: Record<number, string> = {
  0:   "delay-0",
  75:  "delay-75",
  150: "delay-150",
  200: "delay-200",
  300: "delay-300",
  500: "delay-500",
  700: "delay-700",
};

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: RevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const translate = translateMap[direction];
  const delayClass = delayMap[delay] ?? "delay-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${delayClass}
        ${visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${translate}`}
        ${className}`}
    >
      {children}
    </div>
  );
}
