"use client";

import { useState } from "react";
import { RobotPlayground } from "./RobotPlayground";
import { WeatherOledPlayground } from "./WeatherOledPlayground";
import { RelayPlayground } from "./RelayPlayground";

const TABS = [
  {
    id: "robot" as const,
    label: "Robot arm",
    desc: "Set joint angles & gripper",
  },
  {
    id: "weather" as const,
    label: "Arduino OLED",
    desc: "Real .ino + SSD1306",
  },
  {
    id: "relay" as const,
    label: "Smart relay",
    desc: "Thresholds, fan & alerts",
  },
];

export function PlaygroundSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("robot");

  return (
    <section
      id="playground"
      className="relative scroll-mt-20 border-t border-[#d2d2d7]/50 bg-[#f5f5f7] px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-10 lg:py-28 xl:px-12"
    >
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <p className="text-center text-xs font-semibold tracking-wide text-[#6e6e73] md:text-sm">
          IoT Playground
        </p>
        <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl md:text-5xl lg:text-[2.75rem]">
          Write code. Run the simulation.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-[#6e6e73] sm:mt-4 sm:text-base md:text-lg">
          Three edge-device examples — edit simple IoT-style scripts, press Run, and watch the
          hardware respond. Customize the OLED live or tune relay logic without flashing firmware.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-[#1d1d1f] text-white shadow-md"
                  : "bg-white text-[#6e6e73] shadow-sm hover:bg-[#e8e8ed]"
              }`}
            >
              {t.label}
              <span className="ml-1.5 hidden text-xs opacity-70 sm:inline">— {t.desc}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-[#d2d2d7]/60 bg-white/80 p-4 shadow-lg shadow-black/[0.04] backdrop-blur-sm sm:p-6 md:p-8">
          {tab === "robot" && <RobotPlayground />}
          {tab === "weather" && <WeatherOledPlayground />}
          {tab === "relay" && <RelayPlayground />}
        </div>

        <p className="mt-6 text-center text-xs text-[#86868b]">
          Sandbox uses assignment-only scripts (no network). Safe for demos and workshops.
        </p>
      </div>
    </section>
  );
}
