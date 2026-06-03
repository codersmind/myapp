"use client";

import { phase } from "../hooks/useSectionProgress";

export function HeroAppleBackdrop({ progress }: { progress: number }) {
  const reveal = phase(progress, 0, 0.35);
  const drift = progress * 40;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 bg-gradient-to-b from-white via-[#f5f5f7] to-[#ebebed]"
        style={{ opacity: 1 - progress * 0.15 }}
      />

      <div
        className="hero-orb hero-orb-a absolute -left-[12%] top-[18%] h-[55vmin] w-[55vmin] rounded-full"
        style={{ transform: `translate3d(${drift * 0.15}px, ${drift * 0.08}px, 0)` }}
      />
      <div
        className="hero-orb hero-orb-b absolute -right-[8%] top-[32%] h-[45vmin] w-[45vmin] rounded-full"
        style={{ transform: `translate3d(${-drift * 0.12}px, ${drift * 0.1}px, 0)` }}
      />
      <div
        className="hero-orb hero-orb-c absolute left-[30%] bottom-[8%] h-[38vmin] w-[38vmin] rounded-full"
        style={{ transform: `translate3d(0, ${-drift * 0.06}px, 0)` }}
      />

      <div
        className="hero-ring-pulse absolute left-1/2 top-[58%] h-[min(65vw,440px)] w-[min(65vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0071e3]/15"
        style={{ opacity: 0.5 + reveal * 0.3 }}
      />
      <div
        className="hero-ring-pulse hero-ring-delay absolute left-1/2 top-[58%] h-[min(52vw,360px)] w-[min(52vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5ac8fa]/20"
        style={{ opacity: 0.4 + reveal * 0.25 }}
      />
    </div>
  );
}
