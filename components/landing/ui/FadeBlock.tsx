"use client";

import { memo } from "react";
import { smoothPhase } from "../hooks/useSectionProgress";

interface FadeBlockProps {
  progress: number;
  start: number;
  end: number;
  children: React.ReactNode;
  className?: string;
}

function FadeBlockInner({ progress, start, end, children, className = "" }: FadeBlockProps) {
  const t = smoothPhase(progress, start, end);
  const fadeOut =
    progress > 0.9 ? Math.max(0, 1 - (progress - 0.9) / 0.1) : 1;
  const opacity = t * fadeOut;

  return (
    <div
      className={className}
      style={{
        opacity,
        transform: `translate3d(0, ${(1 - t) * 12}px, 0)`,
        willChange: opacity > 0.02 && opacity < 0.98 ? "opacity, transform" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export const FadeBlock = memo(FadeBlockInner);
