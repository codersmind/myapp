"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSectionProgress } from "../hooks/useSectionProgress";
import { SectionCanvas } from "./SectionCanvas";
import { SceneRunner } from "./SceneRunner";
import { SectionEyebrow } from "./StickySection";
import { HeroAppleBackdrop } from "./HeroAppleBackdrop";

/** No HTML `loading` UI — dynamic fallback renders inside R3F Canvas and breaks WebGL */
const QuantumHeroScene = dynamic(
  () => import("../scene/QuantumHeroScene").then((m) => m.QuantumHeroScene),
  { ssr: false }
);

const HERO_SPECS = [
  { label: "Qubits", value: "128 logical" },
  { label: "Coherence", value: "42 μs" },
  { label: "Edge link", value: "< 8 ms" },
  { label: "Stack", value: "IoT · ML · AI" },
];

function HeroScenePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div className="h-48 w-48 animate-pulse rounded-full border border-[#0071e3]/20 bg-gradient-to-br from-[#0071e3]/5 to-[#5ac8fa]/10" />
    </div>
  );
}

export function HeroQuantumSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { progress, getProgress } = useSectionProgress("hero", ref);
  const scrollOut = Math.min(1, progress * 1.4);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    import("../scene/QuantumHeroScene").then(() => setSceneReady(true));
  }, []);

  return (
    <div
      ref={ref}
      id="hero"
      style={{ height: "130vh", contentVisibility: "auto" }}
      className="relative bg-[#f5f5f7] text-[#1d1d1f]"
    >
      <div className="relative flex min-h-[100svh] w-full flex-col overflow-hidden">
        <HeroAppleBackdrop progress={progress} />

        {/* Copy — always visible on load (no scroll-gated FadeBlock) */}
        <div
          className="relative z-20 shrink-0 px-6 pt-24 text-center md:px-12 md:pt-28"
          style={{
            opacity: 1 - scrollOut * 0.85,
            transform: `translate3d(0, ${scrollOut * -12}px, 0)`,
          }}
        >
          <div className="hero-fade-in" style={{ animationDelay: "0.05s" }}>
            <SectionEyebrow>Quantum edge · IoT · Machine learning · AI</SectionEyebrow>
          </div>

          <h1
            className="hero-fade-in mx-auto mt-3 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] md:text-6xl lg:text-[4.25rem]"
            style={{ animationDelay: "0.12s" }}
          >
            Intelligence at
            <br />
            <span className="text-[#0071e3]">every edge.</span>
          </h1>

          <p
            className="hero-fade-in mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6e6e73] md:text-xl"
            style={{ animationDelay: "0.2s" }}
          >
            NexEdge builds quantum-ready edge systems — connected devices, on-device ML, and autonomous AI agents from silicon to cloud.
          </p>

          <div className="hero-fade-in mt-6 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.28s" }}>
            <a
              href="#microcontroller"
              className="rounded-full bg-[#0071e3] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Explore platforms
            </a>
            <a
              href="#contact"
              className="rounded-full border border-[#d2d2d7] bg-white/90 px-6 py-2.5 text-sm font-medium text-[#1d1d1f] shadow-sm backdrop-blur-sm transition-colors hover:border-[#0071e3]/40"
            >
              Talk to us
            </a>
          </div>
        </div>

        {/* 3D — dedicated band so it reads large, not lost in whitespace */}
        <div
          className="relative z-0 mx-auto w-full flex-1 min-h-[42vh] max-h-[52vh] md:min-h-[46vh]"
          style={{ opacity: 1 - scrollOut * 0.5 }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f5f5f7] to-transparent" />
          {!sceneReady && (
            <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center" aria-hidden>
              <HeroScenePlaceholder />
            </div>
          )}
          <SectionCanvas bg="#f5f5f7" camera={[0, 0.15, 4.8]} fov={42} opaque>
            <SceneRunner getProgress={getProgress} Scene={QuantumHeroScene} />
          </SectionCanvas>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f5f5f7] to-transparent" />
        </div>

        {/* Specs + status — visible immediately */}
        <div
          className="relative z-20 shrink-0 px-4 pb-10 md:px-8"
          style={{
            opacity: 1 - scrollOut,
            transform: `translate3d(0, ${scrollOut * 16}px, 0)`,
          }}
        >
          <div className="hero-fade-in mx-auto grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#d2d2d7]/60 shadow-sm md:grid-cols-4" style={{ animationDelay: "0.35s" }}>
            {HERO_SPECS.map((item) => (
              <div key={item.label} className="bg-white px-4 py-3 md:px-5 md:py-4">
                <p className="text-[11px] text-[#6e6e73] md:text-xs">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-[#1d1d1f] md:text-base">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="hero-fade-in mt-5 flex flex-col items-center gap-3" style={{ animationDelay: "0.42s" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0071e3]/25 bg-white px-4 py-2 text-xs font-medium text-[#0071e3] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0071e3] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0071e3]" />
              </span>
              Qubit lattice online · edge nodes syncing
            </div>

            <div className="flex flex-col items-center gap-2" style={{ opacity: Math.max(0.4, 1 - progress * 2.5) }}>
              <span className="text-xs text-[#86868b]">Scroll to explore</span>
              <div className="h-9 w-px bg-[#86868b]/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
