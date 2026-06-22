"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen background video that scrubs with scroll.
 * Edges fade top/bottom so it blends into the page background.
 */
export default function NBLogo({ scrollRange = 1600 }: { scrollRange?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    const update = () => {
      const v = videoRef.current;
      if (!v || !v.duration || !isFinite(v.duration)) return;
      const progress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
      v.currentTime = progress * v.duration;
    };

    video.addEventListener("loadedmetadata", update);
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      video.removeEventListener("loadedmetadata", update);
      window.removeEventListener("scroll", update);
    };
  }, [scrollRange]);

  return (
    <video
      ref={videoRef}
      src="/nb-animation.webm"
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        opacity: 0.22,
      }}
    />
  );
}
