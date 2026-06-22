"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen background video scrubbed by scroll.
 * In light mode: white bg + cyan-green tint overlay on top.
 * Edges fade into background via mask.
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

  const edgeMask = "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)";

  return (
    <>
      {/* Video — sharp, contained, edges fade */}
      <video
        ref={videoRef}
        src="/nb-animation.webm"
        muted playsInline preload="auto" aria-hidden="true"
        className="fixed inset-0 w-full h-full object-contain z-0 pointer-events-none"
        style={{
          opacity: 0.35,
          maskImage: edgeMask,
          WebkitMaskImage: edgeMask,
        }}
      />

      {/* Bright green-cyan tint — screen blend so it lightens/tints without darkening.
          Only visible in light mode (dark mode the bg is already dark green). */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[1] pointer-events-none dark:hidden"
        style={{
          background: "linear-gradient(160deg, rgba(110,231,183,0.18) 0%, rgba(34,211,238,0.14) 50%, rgba(52,211,153,0.18) 100%)",
        }}
      />
    </>
  );
}
