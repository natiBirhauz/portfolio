"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-scrubbed video logo.
 *
 * - Uses rAF + lerp for smooth seeking (no jank)
 * - Ping-pong: plays forward on scroll down, then reverses back to start, repeat
 * - scrollRange: px of scroll = one full forward pass (then another scrollRange to go back)
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

      // Ping-pong: scroll forward plays 0→end, then end→0, then 0→end …
      // raw goes 0, 0.5, 1.0, 1.5, 2.0 …
      // triangle wave: even half-loops go forward, odd half-loops go backward
      const raw      = (window.scrollY / scrollRange) * 2; // 2× so one full ping-pong = scrollRange px
      const cycle    = Math.floor(raw);                     // which half-loop we're in
      const frac     = raw - cycle;                         // 0..1 within this half-loop
      const pingpong = cycle % 2 === 0 ? frac : 1 - frac;  // forward on even, backward on odd
      targetTime.current = pingpong * v.duration;
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
