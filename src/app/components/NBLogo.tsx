"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-scrubbed video logo.
 *
 * Scrolling down plays the animation forward (0 → end).
 * Scrolling up plays it backward (end → 0).
 * scrollRange: how many px of scroll = one full pass of the animation.
 */
export default function NBLogo({ scrollRange = 600 }: { scrollRange?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    const update = () => {
      const v = videoRef.current;
      if (!v || !v.duration || !isFinite(v.duration)) return;

      // clamp scroll between 0 and scrollRange, map to 0..duration
      const progress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
      v.currentTime = progress * v.duration;
    };

    // run once after metadata is ready (in case page loaded mid-scroll)
    const onMeta = () => update();

    video.addEventListener("loadedmetadata", onMeta);
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("scroll", update);
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
