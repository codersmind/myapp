"use client";

import { phase } from "../hooks/useSectionProgress";

interface FadeBlockProps {
  progress: number;
  start: number;
  end: number;
  children: React.ReactNode;
  className?: string;
}

export function FadeBlock({ progress, start, end, children, className = "" }: FadeBlockProps) {
  const p = phase(progress, start, end);
  const fadeOut = progress > end + 0.05 ? Math.max(0, 1 - (progress - end - 0.05) / 0.08) : 1;

  return (
    <div
      className={className}
      style={{
        opacity: p * fadeOut,
        transform: `translateY(${(1 - p) * 28}px)`,
      }}
    >
      {children}
    </div>
  );
}
