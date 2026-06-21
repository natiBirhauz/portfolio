"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-scrubbed video logo.
 *
 * - Uses rAF + lerp for smooth seeking (no jank)
 * - Loops: when the video reaches the end it wraps back to 0 and keeps going
 * - scrollRange: px of scroll = one full loop of the animation
 */
export default function NBLogo({ scrollRange = 500 }: { scrollRange?: number }) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const targetTime  = useRef(0);   // where we want the playhead
  const currentTime = useRef(0);   // where it actually is (lerped)
  const rafId       = useRef(0);
  const LERP        = 0.12;        // 0 = instant, 1 = never moves — 0.12 feels smooth

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    // ── scroll handler: update target time ──────────────────
    const onScroll = () => {
      const v = videoRef.current;
      if (!v || !v.duration || !isFinite(v.duration)) return;

      // How many full loops has the user scrolled through?
      const raw      = window.scrollY / scrollRange;       // e.g. 2.7 = 2 full loops + 70%
      const looped   = raw % 1;                            // fractional part → 0..1
      targetTime.current = looped * v.duration;
    };

    // ── rAF loop: lerp currentTime toward target ─────────────
    const tick = () => {
      const v = videoRef.current;
      if (v && v.duration && isFinite(v.duration)) {
        // Lerp
        currentTime.current += (targetTime.current - currentTime.current) * LERP;
        // Clamp
        const t = Math.max(0, Math.min(v.duration, currentTime.current));
        // Only seek if meaningfully different (avoids micro-seeks)
        if (Math.abs(v.currentTime - t) > 0.005) {
          v.currentTime = t;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    video.addEventListener("loadedmetadata", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId.current);
      video.removeEventListener("loadedmetadata", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, [scrollRange]);

  return (
    <video
      ref={videoRef}
      src="/nb-animation.mp4"
      muted
      playsInline
      preload="auto"
      className="h-10 w-auto object-contain"
      aria-label="NB logo animation"
    />
  );
}
