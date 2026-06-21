"use client";

import { useEffect, useRef } from "react";

/**
 * Plays the NB animation video in sync with scroll.
 * The video is muted/paused — its currentTime is driven by
 * how far the user has scrolled through the page.
 *
 * scrollRange: how many pixels of scrolling = full animation (default 600px)
 */
export default function NBLogo({ scrollRange = 600 }: { scrollRange?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Make sure it's loaded so we can seek
    video.pause();
    video.currentTime = 0;

    const onScroll = () => {
      const progress = Math.min(window.scrollY / scrollRange, 1); // 0 → 1
      if (video.duration && isFinite(video.duration)) {
        video.currentTime = progress * video.duration;
      }
    };

    // Also seek once metadata is ready in case user already scrolled
    const onLoaded = () => onScroll();
    video.addEventListener("loadedmetadata", onLoaded);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
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
