"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen background video that scrubs with scroll.
 * scrollRange: px of scroll = full animation (forward on scroll down, backward on scroll up).
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
    <>
      {/* Video — natural size, centered, no upscaling */}
      <video
        ref={videoRef}
        src="/nb-animation.webm"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-contain z-0 pointer-events-none"
      />

      {/* Emerald/teal tint overlay — multiply blends with the video:
          white areas pick up the green color, black letters stay dark */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #d1fae5 0%, #99f6e4 50%, #a7f3d0 100%)",
          mixBlendMode: "multiply",
          opacity: 0.85,
        }}
      />
    </>
  );
}
