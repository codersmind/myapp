"use client";

import { phase } from "../hooks/useSectionProgress";

const BOOT_STEPS = [
  { label: "Power on", at: 0.12 },
  { label: "Firmware flash", at: 0.32 },
  { label: "GPIO headers live", at: 0.52 },
  { label: "Sensor linked", at: 0.72 },
];

const SPECS = [
  { label: "MCU", value: "ESP32-WROOM" },
  { label: "GPIO", value: "30 pins" },
  { label: "Flash", value: "4 MB" },
  { label: "Wireless", value: "WiFi · BLE" },
];

function BoardSvg({ flashOn }: { flashOn: boolean }) {
  return (
    <svg
      viewBox="0 0 420 280"
      className="h-full w-full max-w-md drop-shadow-2xl"
      aria-hidden
    >
      <defs>
        <linearGradient id="pcb" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e6b47" />
          <stop offset="100%" stopColor="#145a3a" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.15" />
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <rect x="40" y="50" width="340" height="180" rx="8" fill="url(#pcb)" />
        <rect x="55" y="65" width="310" height="150" rx="4" fill="#0f4d32" opacity="0.4" />
        {/* MCU */}
        <rect x="155" y="105" width="90" height="70" rx="4" fill="#111" />
        <text x="200" y="148" textAnchor="middle" fill="#48484a" fontSize="11" fontFamily="system-ui">
          ESP32
        </text>
        {/* USB */}
        <rect x="48" y="118" width="22" height="44" rx="3" fill="#2d2d2f" />
        <rect x="52" y="128" width="14" height="24" rx="2" fill="#1d1d1f" />
        {/* Pins left */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <g key={`l${i}`}>
            <rect x="72" y={72 + i * 16} width="14" height="8" rx="1" fill="#1d1d1f" />
            <rect x="76" y={74 + i * 16} width="6" height="4" fill="#c9a227" />
          </g>
        ))}
        {/* Pins right */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <g key={`r${i}`}>
            <rect x="334" y={72 + i * 16} width="14" height="8" rx="1" fill="#1d1d1f" />
            <rect x="338" y={74 + i * 16} width="6" height="4" fill="#c9a227" />
          </g>
        ))}
        {/* Traces */}
        <path d="M100 140 H155" stroke="#c9a227" strokeWidth="1.5" opacity="0.6" />
        <path d="M245 140 H310" stroke="#c9a227" strokeWidth="1.5" opacity="0.6" />
        {/* LED */}
        <circle cx="95" cy="195" r="5" fill={flashOn ? "#ff3b30" : "#5c1a1a"}>
          {flashOn && <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite" />}
        </circle>
        {/* Antenna */}
        <path d="M280 75 H330 V95 H280 Z" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.5" />
      </g>
    </svg>
  );
}

export function EmbeddedShowcase({ progress }: { progress: number }) {
  const flash = phase(progress, 0.28, 0.55) > 0.4;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row lg:items-center lg:gap-12">
      {/* Subtle background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(#d2d2d7 1px, transparent 1px),
            linear-gradient(90deg, #d2d2d7 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Copy — left on desktop */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 md:px-12 lg:max-w-lg lg:py-0 lg:pl-16 lg:pr-0">
        <p className="text-xs font-semibold text-[#6e6e73] md:text-sm">Embedded Systems</p>
        <h2 className="mt-2 text-4xl font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] md:text-5xl lg:text-6xl">
          Real hardware.
          <br />
          Real firmware.
        </h2>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-[#6e6e73] md:text-xl">
          Production-ready ESP32 platforms — from pin-mapped GPIO to OTA updates and secure edge connectivity.
        </p>

        <ul className="mt-8 space-y-3">
          {BOOT_STEPS.map(({ label, at }) => {
            const done = phase(progress, at, at + 0.1) > 0.5;
            return (
              <li
                key={label}
                className={`flex items-center gap-3 text-sm font-medium transition-colors duration-300 md:text-base ${
                  done ? "text-[#1d1d1f]" : "text-[#86868b]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                    done ? "bg-[#34c759] text-white" : "border border-[#d2d2d7] bg-white text-[#86868b]"
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

      {/* Visual — right */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 lg:px-12 lg:pb-0 lg:pr-16">
        <div className="w-full max-w-lg rounded-3xl border border-[#d2d2d7]/60 bg-white/90 p-8 shadow-xl shadow-black/[0.06] backdrop-blur-sm md:p-10">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">ESP32 DevKit</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                flash ? "bg-[#34c759]/15 text-[#248a3d]" : "bg-[#f5f5f7] text-[#86868b]"
              }`}
            >
              {flash ? "● Online" : "○ Booting"}
            </span>
          </div>

          <div className="flex justify-center py-4">
            <BoardSvg flashOn={flash} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {SPECS.map((item) => (
              <div key={item.label} className="rounded-xl bg-[#f5f5f7] px-3 py-3 text-center md:text-left">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#86868b]">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-[#1d1d1f]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal strip */}
        <div className="mt-6 w-full max-w-lg overflow-hidden rounded-2xl border border-[#1d1d1f]/10 bg-[#1d1d1f] shadow-lg">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-[10px] text-[#86868b]">flash — firmware.bin</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-[#a1a1a6] md:text-xs">
            <span className="text-[#34c759]">$</span> esptool.py write_flash 0x1000 firmware.bin{"\n"}
            <span className="text-[#86868b]">
              {phase(progress, 0.32, 0.55) > 0.3 ? "Writing ████████░░  82%" : "Connecting..."}
            </span>
            {"\n"}
            {phase(progress, 0.72, 0.9) > 0.5 && (
              <span className="text-[#34c759]">OK — sensor DHT22 @ GPIO4</span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
