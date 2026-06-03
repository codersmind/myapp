"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { scrollProgressManager } from "./scrollProgressManager";

export function useSectionProgress(id: string, ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const latestProgress = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const unsubscribe = scrollProgressManager.register(id, element, (value) => {
      latestProgress.current = value;
      setProgress(value);
    });

    return () => unsubscribe();
  }, [id, ref]);

  const getProgress = useCallback(() => {
    return scrollProgressManager.getProgress(id);
  }, [id]);

  return { progress, getProgress };
}

export function phase(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

export function smoothPhase(progress: number, start: number, end: number) {
  const t = phase(progress, start, end);
  return t * t * (3 - 2 * t);
}
