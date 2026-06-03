"use client";

import { useRef } from "react";
import { useSectionProgress } from "../hooks/useSectionProgress";

export { FadeBlock } from "./FadeBlock";

type Theme = "light" | "dark";

interface StickySectionProps {
  id: string;
  height?: string;
  theme?: Theme;
  children: (progress: number) => React.ReactNode;
  canvas?: (getProgress: () => number) => React.ReactNode;
}

export function StickySection({
  id,
  height = "280vh",
  theme = "light",
  children,
  canvas,
}: StickySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { progress, getProgress, active } = useSectionProgress(id, ref);
  const isDark = theme === "dark";

  return (
    <div
      ref={ref}
      id={id}
      style={{ height, contentVisibility: "auto", containIntrinsicSize: "0 100vh" }}
      className={isDark ? "bg-black text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {active && canvas?.(getProgress)}
        <div className="relative z-10 flex h-full flex-col will-change-transform">{children(progress)}</div>
      </div>
    </div>
  );
}

export function SectionEyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`text-xs font-semibold tracking-wide md:text-sm ${
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
      className={`mt-2 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl ${
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
      className={`mt-5 max-w-lg text-lg leading-relaxed md:text-xl ${
        dark ? "text-[#a1a1a6]" : "text-[#6e6e73]"
      }`}
    >
      {children}
    </p>
  );
}
