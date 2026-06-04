"use client";

import { useRef } from "react";
import { useSectionProgress } from "../hooks/useSectionProgress";

export { FadeBlock } from "./FadeBlock";

type Theme = "light" | "dark";

/** scroll = pinned viewport + short scroll track; flow = natural content height (embedded, energy) */
type SectionLayout = "scroll" | "flow";

interface StickySectionProps {
  id: string;
  layout?: SectionLayout;
  /** Total scroll track on desktop (scroll layout only). ~165–180vh keeps animations without huge gaps. */
  height?: string;
  theme?: Theme;
  children: (progress: number) => React.ReactNode;
  canvas?: (getProgress: () => number) => React.ReactNode;
}

export function StickySection({
  id,
  layout = "scroll",
  height = "170vh",
  theme = "light",
  children,
  canvas,
}: StickySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { progress, getProgress } = useSectionProgress(id, ref);
  const isDark = theme === "dark";
  const isFlow = layout === "flow";

  if (isFlow) {
    return (
      <div
        ref={ref}
        id={id}
        className={isDark ? "bg-black text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"}
      >
        {children(progress)}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id={id}
      style={{ ["--section-h" as string]: height, contentVisibility: "auto" }}
      className={`h-auto lg:h-[var(--section-h)] ${isDark ? "bg-black text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"}`}
    >
      <div className="relative flex w-full flex-col max-lg:min-h-0 lg:sticky lg:top-0 lg:h-[100dvh] lg:max-h-[100svh] lg:overflow-hidden">
        {canvas?.(getProgress)}
        <div className="relative z-20 flex w-full flex-col max-lg:min-h-0 lg:min-h-0 lg:justify-start">
          {children(progress)}
        </div>
      </div>
    </div>
  );
}

export function SectionEyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`text-xs font-semibold tracking-wide sm:text-xs md:text-sm ${
        dark ? "text-[#86868b]" : "text-[#6e6e73]"
      }`}
    >
      {children}
    </p>
  );
}

export function SectionTitle({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h2
      className={`mt-2 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${
        dark ? "text-white" : "text-[#1d1d1f]"
      }`}
    >
      {children}
    </h2>
  );
}

export function SectionBody({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`mt-4 max-w-lg text-sm leading-relaxed sm:mt-5 sm:text-base md:text-lg lg:text-xl ${
        dark ? "text-[#a1a1a6]" : "text-[#6e6e73]"
      }`}
    >
      {children}
    </p>
  );
}
