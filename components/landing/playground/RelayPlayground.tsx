"use client";

import { useState } from "react";
import { CodePanel } from "./CodePanel";
import {
  runRelayScript,
  parseRobotScriptErrors,
  type RelaySimState,
} from "./playgroundRunner";

const DEFAULT_CODE = `// Smart relay — temp threshold + fan
temperature = 28
humidity = 72
threshold = 26
relay = auto
fan_speed = 85
alert_msg = Heat alert!

// relay = on | off | auto`;

const DEFAULT_STATE: RelaySimState = {
  temperature: 22,
  humidity: 55,
  threshold: 26,
  relayOn: false,
  fanSpeed: 0,
  message: "OK: Standby",
  mode: "auto",
};

export function RelayPlayground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [state, setState] = useState<RelaySimState>(DEFAULT_STATE);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string | null>(null);

  const run = () => {
    const err = parseRobotScriptErrors(code);
    if (err) {
      setError(err);
      return;
    }
    const next = runRelayScript(code, state);
    setState(next);
    setError(null);
    setLog(`OK: ${next.relayOn ? "RELAY ON" : "relay off"} · fan ${next.fanSpeed}%`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <CodePanel
        title="relay_control.ino"
        hint="// temperature, threshold, relay, fan_speed, alert_msg"
        code={code}
        onChange={setCode}
        onRun={run}
        onReset={() => {
          setCode(DEFAULT_CODE);
          setState(DEFAULT_STATE);
          setError(null);
          setLog(null);
        }}
        error={error}
        log={log}
      />
      <div className="flex flex-col gap-4 rounded-2xl border border-[#d2d2d7]/60 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">
            Edge relay simulator
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              state.relayOn ? "bg-[#ff3b30]/15 text-[#d70015]" : "bg-[#34c759]/15 text-[#248a3d]"
            }`}
          >
            {state.relayOn ? "RELAY ON" : "RELAY OFF"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
            <p className="text-[10px] uppercase text-[#86868b]">Temperature</p>
            <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-[#1d1d1f]">
              {state.temperature}
              <span className="text-lg text-[#6e6e73]">°C</span>
            </p>
          </div>
          <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
            <p className="text-[10px] uppercase text-[#86868b]">Humidity</p>
            <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-[#1d1d1f]">
              {state.humidity}
              <span className="text-lg text-[#6e6e73]">%</span>
            </p>
          </div>
        </div>

        {/* Threshold gauge */}
        <div className="rounded-xl border border-[#d2d2d7]/50 p-4">
          <div className="mb-2 flex justify-between text-xs text-[#6e6e73]">
            <span>0°C</span>
            <span>Threshold {state.threshold}°C</span>
            <span>40°C</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-[#e8e8ed]">
            <div
              className="absolute top-0 h-full rounded-full bg-gradient-to-r from-[#5ac8fa] to-[#ff9500] transition-all duration-500"
              style={{ width: `${Math.min(100, (state.temperature / 40) * 100)}%` }}
            />
            <div
              className="absolute top-0 h-full w-0.5 bg-[#1d1d1f]"
              style={{ left: `${(state.threshold / 40) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-[#86868b]">mode: {state.mode}</p>
        </div>

        {/* Relay + fan visual */}
        <div className="flex items-center gap-6">
          <div
            className={`flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
              state.relayOn
                ? "border-[#ff3b30] bg-[#ff3b30]/10 shadow-[0_0_24px_rgba(255,59,48,0.25)]"
                : "border-[#d2d2d7] bg-[#f5f5f7]"
            }`}
          >
            <div
              className={`h-10 w-10 rounded-lg transition-colors ${
                state.relayOn ? "bg-[#ff3b30]" : "bg-[#d2d2d7]"
              }`}
            />
            <span className="mt-2 text-[10px] font-semibold uppercase text-[#6e6e73]">Relay</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase text-[#86868b]">Cooling fan</p>
            <div
              className="mt-2 flex justify-center transition-transform duration-300"
              style={{
                animation: state.fanSpeed > 0 ? "pg-fan-spin 0.4s linear infinite" : "none",
              }}
            >
              <svg viewBox="0 0 64 64" className="h-16 w-16 text-[#0071e3]" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <ellipse
                    key={i}
                    cx="32"
                    cy="32"
                    rx="28"
                    ry="8"
                    fill="currentColor"
                    opacity={0.35 + (state.fanSpeed / 100) * 0.5}
                    transform={`rotate(${i * 45} 32 32)`}
                  />
                ))}
                <circle cx="32" cy="32" r="6" fill="#1d1d1f" />
              </svg>
            </div>
            <p className="mt-1 text-center font-mono text-sm tabular-nums text-[#1d1d1f]">
              {state.fanSpeed}%
            </p>
          </div>
        </div>

        <p className="rounded-xl bg-[#1d1d1f] px-4 py-3 font-mono text-xs text-[#5ae05a]">
          ▸ {state.message}
        </p>
      </div>
    </div>
  );
}
