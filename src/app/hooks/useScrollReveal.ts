"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  threshold?: number;
}

/**
 * Returns a ref and a `visible` boolean.
 * visible = true  → element is inside the viewport
 * visible = false → element is outside (animates back out)
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: Options = {}
) {
  const { threshold = 0.1 } = options;
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
