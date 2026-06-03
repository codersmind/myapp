"use client";

import { phase } from "../hooks/useScrollProgress";

interface SectionProps {
  id: string;
  scrollProgress: number;
  phaseStart: number;
  phaseEnd: number;
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

export function ScrollSection({ id, scrollProgress, phaseStart, phaseEnd, align = "left", children }: SectionProps) {
  const visibility = phase(scrollProgress, phaseStart, phaseStart + 0.08) * (1 - phase(scrollProgress, phaseEnd - 0.05, phaseEnd));
  const translateY = (1 - visibility) * 40;

  return (
    <section
      id={id}
      className="relative flex min-h-screen items-center px-6 md:px-16 lg:px-24"
      style={{ opacity: Math.max(0, visibility), transform: `translateY(${translateY}px)` }}
    >
      <div
        className={`relative z-10 max-w-xl ${
          align === "center" ? "mx-auto text-center" : align === "right" ? "ml-auto text-right" : ""
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export function ScrollSections({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      {/* Hero */}
      <ScrollSection id="hero" scrollProgress={scrollProgress} phaseStart={0} phaseEnd={0.15} align="center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-cyan-400/80">
          Quantum Edge Systems
        </p>
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
          Where IoT meets
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
            Machine Intelligence
          </span>
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-400 md:text-base">
          Scroll to boot the quantum core — watch microcontrollers wire up, firmware compile, and AI agents execute in real time.
        </p>
        <div className="mt-10 flex animate-bounce flex-col items-center gap-2 text-cyan-500/60">
          <span className="font-mono text-[10px] uppercase tracking-widest">Initialize</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </ScrollSection>

      {/* IoT / MCU */}
      <ScrollSection id="iot" scrollProgress={scrollProgress} phaseStart={0.12} phaseEnd={0.32}>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
          Phase 01 — Hardware
        </div>
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          Microcontroller<br />Architecture
        </h2>
        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
          ATOM-X boards initialize on scroll. GPIO pins activate, circuit traces illuminate, and sensor nodes prepare for data acquisition across the quantum mesh.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-[10px] text-cyan-500/70 md:text-xs">
          <div className="rounded border border-cyan-500/20 bg-slate-950/50 px-3 py-2">
            <span className="text-slate-500">PIN</span> GPIO_0..11
          </div>
          <div className="rounded border border-cyan-500/20 bg-slate-950/50 px-3 py-2">
            <span className="text-slate-500">CLK</span> 240 MHz
          </div>
          <div className="rounded border border-cyan-500/20 bg-slate-950/50 px-3 py-2">
            <span className="text-slate-500">MEM</span> 512 KB SRAM
          </div>
          <div className="rounded border border-cyan-500/20 bg-slate-950/50 px-3 py-2">
            <span className="text-slate-500">STATUS</span> BOOT OK
          </div>
        </div>
      </ScrollSection>

      {/* Wiring */}
      <ScrollSection id="wire" scrollProgress={scrollProgress} phaseStart={0.28} phaseEnd={0.48} align="right">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Phase 02 — Connect
        </div>
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          Wire Join<br />&amp; Mesh Link
        </h2>
        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
          Copper traces extend from the MCU to sensors, actuators, and edge gateways. Each connection forms a live data pathway through the quantum grid.
        </p>
        <ul className="mt-6 space-y-2 font-mono text-xs text-emerald-400/80">
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">→</span> SENSOR node linked
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">→</span> ACTUATOR node linked
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">→</span> GATEWAY node linked
          </li>
        </ul>
      </ScrollSection>

      {/* Code / Execute */}
      <ScrollSection id="code" scrollProgress={scrollProgress} phaseStart={0.42} phaseEnd={0.68}>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-yellow-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />
          Phase 03 — Execute
        </div>
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          Conditional<br />Programming
        </h2>
        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
          Firmware compiles with branching logic — if/else conditions mapped to assembly-level instructions. Signals pulse through wires as code executes on-device.
        </p>
        <div className="mt-6 rounded-lg border border-yellow-500/20 bg-slate-950/60 p-4 font-mono text-xs">
          <div className="text-yellow-400/60">pipeline status</div>
          <div className="mt-2 space-y-1 text-slate-300">
            <div><span className="text-emerald-400">[OK]</span> parse AST</div>
            <div><span className="text-emerald-400">[OK]</span> optimize branches</div>
            <div><span className="text-emerald-400">[OK]</span> flash memory</div>
            <div><span className="text-cyan-400 animate-pulse">[RUN]</span> signal propagation...</div>
          </div>
        </div>
      </ScrollSection>

      {/* AI Agent */}
      <ScrollSection id="ai" scrollProgress={scrollProgress} phaseStart={0.62} phaseEnd={0.85} align="right">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-fuchsia-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400" />
          Phase 04 — Intelligence
        </div>
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          AI Agent<br />Neural Core
        </h2>
        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
          Deep learning agents analyze edge sensor streams in real time. Neural pathways activate as the agent predicts, decides, and dispatches autonomous actions.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["TensorFlow Lite", "Edge TPU", "Reinforcement", "Anomaly Detect"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-fuchsia-500/30 bg-fuchsia-950/30 px-3 py-1 font-mono text-[10px] text-fuchsia-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </ScrollSection>

      {/* CTA */}
      <ScrollSection id="contact" scrollProgress={scrollProgress} phaseStart={0.82} phaseEnd={1} align="center">
        <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
          Access the Quantum Core
        </h2>
        <p className="mx-auto mb-8 max-w-md text-sm text-slate-400 md:text-base">
          Build IoT systems that think. From silicon to software to autonomous AI — we engineer the full stack.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105">
            <span className="relative z-10">Start Project</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </button>
          <button className="rounded-lg border border-slate-600 px-8 py-3 font-mono text-sm uppercase tracking-wider text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-400">
            View Docs
          </button>
        </div>
        <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
          © 2026 QubitLab — IoT · ML · AI Systems
        </p>
      </ScrollSection>
    </>
  );
}
