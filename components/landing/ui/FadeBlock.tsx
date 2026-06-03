"use client";

import { memo } from "react";
import { phase } from "../hooks/useSectionProgress";

interface FadeBlockProps {
  progress: number;
  start: number;
  end: number;
  children: React.ReactNode;
  className?: string;
}

function FadeBlockInner({ progress, start, end, children, className = "" }: FadeBlockProps) {
  const p = phase(progress, start, end);
  const fadeOut = progress > end + 0.05 ? Math.max(0, 1 - (progress - end - 0.05) / 0.08) : 1;
  const opacity = p * fadeOut;

  return (
    <div
      className={className}
      style={{
        opacity,
        transform: `translate3d(0, ${(1 - p) * 24}px, 0)`,
        willChange: opacity > 0 && opacity < 1 ? "transform, opacity" : "auto",
      }}
    >
      {children}
    </div>
  );
}

export const FadeBlock = memo(FadeBlockInner);
