"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { scrollProgressManager } from "./scrollProgressManager";

const UI_FRAME_MS = 48;

export function useSectionProgress(id: string, ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const lastUiSync = useRef(0);
  const latestProgress = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const unsubscribe = scrollProgressManager.register(id, element, (value) => {
      latestProgress.current = value;
      const now = performance.now();
      if (now - lastUiSync.current >= UI_FRAME_MS) {
        lastUiSync.current = now;
        setProgress(value);
      }
    });

    let scrollEndTimer: ReturnType<typeof setTimeout>;
    const onScrollEnd = () => {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        setProgress(latestProgress.current);
      }, 80);
    };
    window.addEventListener("scroll", onScrollEnd, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0 }
    );
    observer.observe(element);

    return () => {
      unsubscribe();
      observer.disconnect();
      clearTimeout(scrollEndTimer);
      window.removeEventListener("scroll", onScrollEnd);
    };
  }, [id, ref]);

  const getProgress = useCallback(() => {
    return scrollProgressManager.getProgress(id);
  }, [id]);

  return { progress, getProgress, active, latestProgress };
}

export function phase(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

/** Smoothstep easing for scroll-driven motion */
export function smoothPhase(progress: number, start: number, end: number) {
  const t = phase(progress, start, end);
  return t * t * (3 - 2 * t);
}
