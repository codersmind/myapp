"use client";

import type { RobotSimState } from "./playgroundRunner";

export function RobotArmPreview({ state }: { state: RobotSimState }) {
  const { j1, j2, j3 } = state;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox="-50 -220 480 460"
        className="h-[min(52vh,480px)] w-full min-h-[360px] max-w-[560px]"
        aria-label="Robot arm simulation preview"
      >
        <defs>
          <linearGradient id="pg-arm-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8e8ed" />
            <stop offset="100%" stopColor="#aeaeb2" />
          </linearGradient>
        </defs>
        <rect x="24" y="228" width="312" height="10" rx="3" fill="#d2d2d7" />
        <g transform={`translate(88 228) scale(2.35)`}>
          <rect x="-22" y="-14" width="44" height="16" rx="4" fill="#1d1d1f" />
          <g transform={`rotate(${j1} 0 -10)`}>
            <rect x="0" y="-72" width="16" height="72" rx="5" fill="url(#pg-arm-metal)" />
            <circle cx="8" cy="-72" r="9" fill="#2d2d2f" />
            <g transform={`translate(8 -72) rotate(${j2})`}>
              <rect x="0" y="-58" width="13" height="58" rx="4" fill="url(#pg-arm-metal)" />
              <circle cx="6.5" cy="-58" r="8" fill="#2d2d2f" />
              <g transform={`translate(6.5 -58) rotate(${j3})`}>
                <rect x="0" y="-44" width="11" height="44" rx="3" fill="url(#pg-arm-metal)" />
                <rect x="-2" y="-46" width="15" height="5" fill="#ff9500" rx="1" />
                <g transform="translate(5 -44)">
                  <rect x="0" y="-5" width="18" height="10" rx="2" fill="#48484a" />
                  <rect
                    x="2"
                    y={state.grip === "closed" ? -2.5 : -7}
                    width="14"
                    height="4"
                    rx="1"
                    fill={state.grip === "closed" ? "#0071e3" : "#86868b"}
                  />
                  <rect
                    x="2"
                    y={state.grip === "closed" ? 2.5 : -2}
                    width="14"
                    height="4"
                    rx="1"
                    fill={state.grip === "closed" ? "#0071e3" : "#86868b"}
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <dl className="grid w-full max-w-sm grid-cols-4 gap-2 text-center">
        {(["j1", "j2", "j3"] as const).map((k) => (
          <div key={k} className="rounded-xl bg-[#f5f5f7] px-2 py-2">
            <dt className="text-[10px] uppercase text-[#86868b]">{k}</dt>
            <dd className="font-mono text-sm font-semibold tabular-nums">{state[k]}°</dd>
          </div>
        ))}
        <div className="rounded-xl bg-[#f5f5f7] px-2 py-2">
          <dt className="text-[10px] uppercase text-[#86868b]">Grip</dt>
          <dd className="text-sm font-semibold capitalize">{state.grip}</dd>
        </div>
      </dl>
    </div>
  );
}
