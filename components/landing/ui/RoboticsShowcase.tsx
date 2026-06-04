"use client";

import { smoothPhase } from "../hooks/useSectionProgress";

const STEPS = [
  { id: 1, label: "Assemble arm", start: 0, end: 0.28 },
  { id: 2, label: "Reach target", start: 0.22, end: 0.52 },
  { id: 3, label: "Grip workpiece", start: 0.48, end: 0.72 },
  { id: 4, label: "Place on belt", start: 0.68, end: 1 },
] as const;

const JOINTS = [
  { key: "j1", short: "J1", name: "Base" },
  { key: "j2", short: "J2", name: "Shoulder" },
  { key: "j3", short: "J3", name: "Elbow" },
  { key: "j5", short: "J5", name: "Wrist" },
  { key: "grip", short: "GR", name: "Gripper" },
] as const;

function ArmDiagram({ progress }: { progress: number }) {
  const reach = smoothPhase(progress, 0.22, 0.52);
  const pick = smoothPhase(progress, 0.48, 0.72);
  const j2 = -28 + reach * -32 + pick * 8;
  const j3 = 42 + reach * 28 - pick * 18;
  const placeT = smoothPhase(progress, 0.68, 1);

  return (
    <div className="pointer-events-none relative z-30 -mx-4 flex items-center justify-center overflow-visible py-2 md:-mx-6">
      <svg
        viewBox="-50 -150 480 430"
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
        className="relative z-30 h-[240px] w-full max-w-[420px] overflow-visible sm:h-[280px] sm:max-w-[440px] md:h-[320px] md:max-w-[460px] lg:h-[360px]"
        aria-hidden
      >
        <defs>
          <linearGradient id="robotics-arm-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f7" />
            <stop offset="55%" stopColor="#d1d1d6" />
            <stop offset="100%" stopColor="#aeaeb2" />
          </linearGradient>
          <filter id="arm-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Environment — drawn behind arm */}
        <g style={{ opacity: 0.9 }}>
          <rect x="24" y="218" width="312" height="10" rx="3" fill="#d2d2d7" />
          <rect x="228" y="204" width="88" height="8" rx="2" fill="#48484a" opacity="0.45" />
          <rect
            x={248 - placeT * 62}
            y="178"
            width="28"
            height="18"
            rx="3"
            fill="#d2d2d7"
            opacity={pick > 0.4 && placeT < 0.9 ? 1 : 0.35}
          />
          <circle cx="248" cy="187" r="14" fill="none" stroke="#0071e3" strokeWidth="1.5" opacity={0.25 + reach * 0.35} />
        </g>

        <g filter="url(#arm-shadow)" transform="translate(88 218) scale(1.85)">
          <rect x="-22" y="-14" width="44" height="16" rx="4" fill="#1d1d1f" />
          <g transform={`rotate(${reach * 18 + pick * 6} 0 -10)`}>
            <rect x="0" y="-72" width="16" height="72" rx="5" fill="url(#robotics-arm-metal)" />
            <circle cx="8" cy="-72" r="9" fill="#2d2d2f" />
            <g transform={`translate(8 -72) rotate(${j2})`}>
              <rect x="0" y="-58" width="13" height="58" rx="4" fill="url(#robotics-arm-metal)" />
              <circle cx="6.5" cy="-58" r="8" fill="#2d2d2f" />
              <g transform={`translate(6.5 -58) rotate(${j3})`}>
                <rect x="0" y="-44" width="11" height="44" rx="3" fill="url(#robotics-arm-metal)" />
                <rect x="-2" y="-46" width="15" height="5" fill="#ff9500" rx="1" />
                <g transform="translate(5 -44)">
                  <rect x="0" y="-5" width="18" height="10" rx="2" fill="#48484a" />
                  <rect
                    x="2"
                    y={-7 + (pick > 0.55 && placeT < 0.35 ? 2.5 : 7)}
                    width="14"
                    height="4"
                    rx="1"
                    fill="#86868b"
                  />
                  <rect
                    x="2"
                    y={(pick > 0.55 && placeT < 0.35 ? -2.5 : -7)}
                    width="14"
                    height="4"
                    rx="1"
                    fill="#86868b"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

function MotionSequenceCard({ progress }: { progress: number }) {
  const activeStep =
    STEPS.find((s) => progress >= s.start && progress < s.end + 0.02)?.id ?? (progress >= 0.95 ? 4 : 1);

  return (
    <div className="rounded-2xl border border-[#d2d2d7]/60 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">Motion sequence</p>
      <ul className="mt-4 space-y-3">
        {STEPS.map((step) => {
          const p = smoothPhase(progress, step.start, step.end);
          const isActive = step.id === activeStep;
          const isDone = progress >= step.end - 0.02;

          return (
            <li key={step.id}>
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isDone
                      ? "bg-[#34c759] text-white"
                      : isActive
                        ? "bg-[#0071e3] text-white"
                        : "border border-[#d2d2d7] bg-[#f5f5f7] text-[#86868b]"
                  }`}
                >
                  {isDone ? "✓" : step.id}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate text-sm font-medium ${
                        isDone ? "text-[#1d1d1f]" : isActive ? "text-[#0071e3]" : "text-[#86868b]"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-[#86868b]">
                      {Math.round(p * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e8e8ed]">
                    <div
                      className={`h-full rounded-full transition-[width] duration-150 ${
                        isDone ? "bg-[#34c759]" : "bg-[#0071e3]"
                      }`}
                      style={{ width: `${Math.max(isDone ? 100 : 6, p * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function JointValueGrid({ progress }: { progress: number }) {
  const reach = smoothPhase(progress, 0.22, 0.52);
  const pick = smoothPhase(progress, 0.48, 0.72);
  const place = smoothPhase(progress, 0.68, 1);

  const values: Record<(typeof JOINTS)[number]["key"], string> = {
    j1: `${(-34 + reach * 52 + place * 18).toFixed(0)}°`,
    j2: `${(-31 - reach * 38 + pick * 12).toFixed(0)}°`,
    j3: `${(49 + reach * 22 - pick * 28).toFixed(0)}°`,
    j5: `${(12 + pick * 38 - place * 20).toFixed(0)}°`,
    grip: pick > 0.55 && place < 0.4 ? "Closed" : "Open",
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {JOINTS.map((joint, i) => (
        <div
          key={joint.key}
          className={`relative z-10 flex flex-col items-center justify-center rounded-2xl border border-[#e8e8ed]/80 bg-white/95 px-3 py-3.5 text-center shadow-sm backdrop-blur-sm ${
            i === 4 ? "col-span-2 sm:col-span-1" : ""
          }`}
        >
          <span className="text-lg font-semibold leading-none tracking-tight tabular-nums text-[#1d1d1f] sm:text-xl md:text-2xl">
            {values[joint.key]}
          </span>
          <span className="mt-2 text-[11px] font-medium leading-tight text-[#86868b]">
            <span className="text-[#6e6e73]">{joint.short}</span>
            <span className="mx-1 text-[#d2d2d7]">·</span>
            {joint.name}
          </span>
        </div>
      ))}
    </div>
  );
}

function KinematicsCard({ progress }: { progress: number }) {
  const reach = smoothPhase(progress, 0.22, 0.52);
  const pick = smoothPhase(progress, 0.48, 0.72);
  const place = smoothPhase(progress, 0.68, 1);

  const status =
    place > 0.85
      ? { label: "Cycle complete", className: "bg-[#34c759]/15 text-[#248a3d]" }
      : pick > 0.5
        ? { label: "Gripping", className: "bg-[#ff9500]/15 text-[#c93400]" }
        : reach > 0.2
          ? { label: "In motion", className: "bg-[#0071e3]/12 text-[#0071e3]" }
          : { label: "Standby", className: "bg-[#f5f5f7] text-[#86868b]" };

  const plcLine =
    place > 0.7
      ? "place_confirmed"
      : pick > 0.5
        ? "grip_closed"
        : reach > 0.3
          ? "moveL_active"
          : "homing";

  return (
    <div className="w-full max-w-md overflow-visible rounded-3xl border border-[#d2d2d7]/60 bg-white p-6 shadow-xl shadow-black/[0.08] sm:max-w-lg sm:p-8">
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e73]">
            Live kinematics
          </p>
          <p className="mt-1 text-sm text-[#86868b]">Joint angles · real time</p>
        </div>
        <span
          className={`relative z-10 shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="relative isolate min-h-[240px] overflow-visible sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px]">
        <ArmDiagram progress={progress} />
        <div className="relative z-10 -mt-4 sm:-mt-6">
          <JointValueGrid progress={progress} />
        </div>
      </div>

      <div className="relative z-10 mt-5 overflow-hidden rounded-2xl border border-[#d2d2d7]/50 bg-[#1d1d1f]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-[10px] text-[#86868b]">plc_main.st</span>
        </div>
        <p className="px-4 py-3 font-mono text-xs leading-relaxed text-[#a1a1a6] sm:text-[13px]">
          <span className="text-[#5ac8fa]">RUN</span>{" "}
          <span className="text-[#ffffff]">{plcLine}</span>
          <span className="text-[#86868b]"> → axis_sync OK</span>
        </p>
      </div>
    </div>
  );
}

export function RoboticsShowcase({ progress }: { progress: number }) {
  return (
    <div className="relative z-20 flex h-full min-h-0 w-full flex-col lg:flex-row">
      <aside className="relative flex w-full shrink-0 flex-col justify-start border-[#d2d2d7]/50 bg-[#f5f5f7] px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:w-[min(480px,44vw)] lg:max-w-[500px] lg:border-r lg:px-12 lg:pt-20 lg:pb-12 xl:px-14">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <p className="text-xs font-semibold tracking-wide text-[#6e6e73] sm:text-xs md:text-sm">Robotics</p>
          <h2 className="mt-2 text-2xl font-semibold leading-[1.08] tracking-tight text-[#1d1d1f] sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl">
            Precision in motion.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#6e6e73] sm:mt-4 sm:text-base md:text-lg">
            Six-axis control with sub-millimeter repeatability. Scroll to run the full pick-and-place
            sequence on the line.
          </p>

          <div className="mt-8">
            <MotionSequenceCard progress={progress} />
          </div>

          <p className="mt-6 text-center text-xs text-[#86868b] lg:hidden">3D preview on the right →</p>
        </div>
      </aside>

      <div className="relative flex min-h-[240px] flex-1 items-start justify-center px-4 py-6 sm:min-h-[300px] sm:px-6 sm:py-8 md:min-h-[320px] lg:min-h-0 lg:px-10 lg:pt-16 lg:pb-12 xl:px-12">
        <KinematicsCard progress={progress} />
      </div>
    </div>
  );
}
