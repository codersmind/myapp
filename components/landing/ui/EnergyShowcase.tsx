"use client";

import { phase } from "../hooks/useSectionProgress";

const PIPELINE = [
  { label: "Solar array online", at: 0.1 },
  { label: "Inverter synchronized", at: 0.3 },
  { label: "Grid IEC 61850 linked", at: 0.5 },
  { label: "Smart meter streaming", at: 0.68 },
  { label: "Battery BMS balanced", at: 0.85 },
];

const SPECS = [
  { label: "Solar", value: "MPPT tracking" },
  { label: "Grid", value: "IEC 61850" },
  { label: "Metering", value: "Real-time kWh" },
  { label: "Storage", value: "Battery BMS" },
];

function EnergyFlowSvg({ flowProgress }: { flowProgress: number }) {
  const dashOffset = 1 - flowProgress;

  return (
    <svg viewBox="0 0 520 300" className="h-full w-full max-w-xl" aria-hidden>
      <defs>
        <linearGradient id="solarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0f2744" />
        </linearGradient>
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff9500" />
          <stop offset="100%" stopColor="#ffcc00" />
        </linearGradient>
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Solar array */}
      <g filter="url(#cardShadow)">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <g key={`${row}-${col}`} transform={`translate(${40 + col * 52}, ${60 + row * 38})`}>
              <rect width="48" height="32" rx="2" fill="url(#solarGrad)" />
              <line x1="4" y1="8" x2="44" y2="8" stroke="#3b82f6" strokeWidth="0.5" opacity="0.4" />
              <line x1="4" y1="16" x2="44" y2="16" stroke="#3b82f6" strokeWidth="0.5" opacity="0.4" />
              <line x1="4" y1="24" x2="44" y2="24" stroke="#3b82f6" strokeWidth="0.5" opacity="0.4" />
              <rect x="0" y="30" width="48" height="3" fill="#86868b" rx="1" />
            </g>
          ))
        )}
        <text x="95" y="48" textAnchor="middle" fill="#6e6e73" fontSize="10" fontWeight="600">
          SOLAR
        </text>
      </g>

      {/* Flow path */}
      <path
        id="energyPath"
        d="M 200 115 Q 260 90 320 115 L 400 115"
        fill="none"
        stroke="#d2d2d7"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 200 115 Q 260 90 320 115 L 400 115"
        fill="none"
        stroke="url(#flowGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset={dashOffset}
        pathLength={1}
        opacity={flowProgress > 0.05 ? 1 : 0}
      />

      {/* Inverter / substation */}
      <g transform="translate(210, 95)" filter="url(#cardShadow)">
        <rect width="80" height="70" rx="6" fill="#86868b" />
        <rect x="8" y="8" width="64" height="40" rx="3" fill="#48484a" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={18 + i * 18} y="-12" width="10" height="14" rx="2" fill="#e8e8ed" />
        ))}
        <text x="40" y="62" textAnchor="middle" fill="#f5f5f7" fontSize="9" fontWeight="600">
          INVERTER
        </text>
      </g>

      {/* Smart meter */}
      <g transform="translate(400, 88)" filter="url(#cardShadow)">
        <rect width="56" height="80" rx="6" fill="#e8e8ed" />
        <rect x="8" y="12" width="40" height="32" rx="3" fill="#1d1d1f" />
        <rect
          x="12"
          y="16"
          width="32"
          height="24"
          rx="2"
          fill={flowProgress > 0.6 ? "#34c759" : "#2d2d2f"}
          opacity="0.9"
        />
        <text x="28" y="72" textAnchor="middle" fill="#6e6e73" fontSize="9" fontWeight="600">
          METER
        </text>
      </g>

      {/* Battery */}
      <g transform="translate(320, 200)" filter="url(#cardShadow)">
        <rect width="70" height="44" rx="6" fill="#1d1d1f" />
        <rect x="62" y="14" width="6" height="16" rx="2" fill="#86868b" />
        <rect
          x="8"
          y="10"
          width="48"
          height="24"
          rx="3"
          fill={flowProgress > 0.8 ? "#34c759" : "#48484a"}
          opacity={0.7 + flowProgress * 0.3}
        />
        <text x="35" y="38" textAnchor="middle" fill="#86868b" fontSize="9" fontWeight="600">
          BMS
        </text>
      </g>

      {/* Flow particles */}
      {flowProgress > 0.2 &&
        [0, 1, 2].map((i) => {
          const t = (flowProgress * 0.85 + i * 0.15) % 1;
          const x = 200 + t * 200;
          const y = 115 - Math.sin(t * Math.PI) * 18;
          return <circle key={i} cx={x} cy={y} r="4" fill="#ff9500" opacity="0.9" />;
        })}
    </svg>
  );
}

export function EnergyShowcase({ progress }: { progress: number }) {
  const flow = phase(progress, 0.15, 0.9);
  const solarKw = Math.round(phase(progress, 0.2, 0.8) * 42.8 * 10) / 10;
  const gridOk = phase(progress, 0.5, 0.7) > 0.5;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col md:flex-row md:items-start md:gap-8 lg:py-12 xl:gap-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #fff9f0 0%, #f5f5f7 45%, #f0f4ff 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col justify-start px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-14 lg:max-w-md lg:pt-16 lg:pb-8 lg:pl-16 xl:pl-20">
        <p className="text-xs font-semibold text-[#6e6e73] sm:text-xs md:text-sm">Energy IoT</p>
        <h2 className="mt-2 text-3xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[3.5rem]">
          Power,
          <br />
          measured.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[#6e6e73] sm:mt-5 sm:text-lg md:text-xl">
          Solar, grid, metering, and storage — unified at the edge with standards-based telemetry and live kWh analytics.
        </p>

        <ul className="mt-8 space-y-3">
          {PIPELINE.map(({ label, at }) => {
            const done = phase(progress, at, at + 0.08) > 0.5;
            return (
              <li
                key={label}
                className={`flex items-center gap-3 text-sm font-medium md:text-base ${
                  done ? "text-[#1d1d1f]" : "text-[#86868b]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                    done ? "bg-[#ff9500] text-white" : "border border-[#d2d2d7] bg-white"
                  }`}
                >
                  {done ? "✓" : ""}
                </span>
                {label}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center px-4 pb-10 sm:px-6 sm:pb-12 md:px-10 md:pb-14 lg:px-12 lg:pb-0 lg:pr-16 xl:pr-20">
        <div className="w-full max-w-xl rounded-3xl border border-[#d2d2d7]/50 bg-white/95 p-4 shadow-xl shadow-black/[0.06] backdrop-blur-sm sm:p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">
              Edge energy hub
            </span>
            <div className="flex gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  gridOk ? "bg-[#34c759]/15 text-[#248a3d]" : "bg-[#f5f5f7] text-[#86868b]"
                }`}
              >
                {gridOk ? "Grid synced" : "Connecting"}
              </span>
              <span className="rounded-full bg-[#ff9500]/15 px-3 py-1 text-xs font-medium text-[#c93400]">
                {solarKw > 0 ? `${solarKw} kW` : "— kW"}
              </span>
            </div>
          </div>

          <EnergyFlowSvg flowProgress={flow} />

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {SPECS.map((item) => (
              <div key={item.label} className="rounded-xl bg-[#f5f5f7] px-3 py-3">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#86868b]">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-[#1d1d1f]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid w-full max-w-xl grid-cols-1 gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
          {[
            { label: "Generation", value: `${solarKw} kW`, sub: "solar now" },
            { label: "Consumption", value: `${Math.round(solarKw * 0.7 * 10) / 10} kW`, sub: "site load" },
            { label: "Storage", value: gridOk ? "94%" : "—", sub: "SOC" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-[#d2d2d7]/40 bg-white/90 px-3 py-3 text-center shadow-sm sm:px-4 sm:py-4"
            >
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#86868b] sm:text-[11px]">{m.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-[#1d1d1f] sm:text-xl">{m.value}</p>
              <p className="mt-0.5 text-[10px] text-[#86868b]">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
