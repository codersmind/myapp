"use client";

import { useCallback, useEffect, useRef } from "react";
import type { RobotSimState } from "./playgroundRunner";
import { ROBOT_LIMITS } from "./arduinoRobotParser";

const STEP = 4;

interface RobotArmControllerProps {
  state: RobotSimState;
  onChange: (state: RobotSimState) => void;
}

export function RobotArmController({ state, onChange }: RobotArmControllerProps) {
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const nudge = useCallback(
    (joint: "j1" | "j2" | "j3", delta: number) => {
      const lim = ROBOT_LIMITS[joint];
      const s = stateRef.current;
      const next = Math.max(lim.min, Math.min(lim.max, s[joint] + delta));
      const updated = { ...s, [joint]: next };
      stateRef.current = updated;
      onChange(updated);
    },
    [onChange]
  );

  const startHold = (joint: "j1" | "j2" | "j3", delta: number) => {
    nudge(joint, delta);
    holdRef.current = setInterval(() => nudge(joint, delta), 80);
  };

  const stopHold = () => {
    if (holdRef.current) clearInterval(holdRef.current);
    holdRef.current = null;
  };

  useEffect(() => () => stopHold(), []);

  return (
    <div className="rounded-2xl border border-[#d2d2d7]/60 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">
        Joystick controller
      </p>
      <p className="mt-1 text-xs text-[#86868b]">
        Hold arrows to move joints · updates arm live
      </p>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
        {/* D-pad */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#86868b]">
            Base / Shoulder
          </p>
          <button
            type="button"
            aria-label="Shoulder up"
            onPointerDown={() => startHold("j2", -STEP)}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d2d2d7] bg-white text-lg shadow-sm active:bg-[#0071e3] active:text-white"
          >
            ▲
          </button>
          <div
            className="flex gap-2"
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
          >
            <button
              type="button"
              aria-label="Base left"
              onPointerDown={() => startHold("j1", -STEP)}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d2d2d7] bg-white text-lg shadow-sm active:bg-[#0071e3] active:text-white"
            >
              ◀
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f7] ring-2 ring-[#d2d2d7]/80">
              <div className="h-4 w-4 rounded-full bg-[#0071e3]/80" />
            </div>
            <button
              type="button"
              aria-label="Base right"
              onPointerDown={() => startHold("j1", STEP)}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d2d2d7] bg-white text-lg shadow-sm active:bg-[#0071e3] active:text-white"
            >
              ▶
            </button>
          </div>
          <button
            type="button"
            aria-label="Shoulder down"
            onPointerDown={() => startHold("j2", STEP)}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d2d2d7] bg-white text-lg shadow-sm active:bg-[#0071e3] active:text-white"
          >
            ▼
          </button>
        </div>

        {/* Elbow + grip */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-wide text-[#86868b]">
              Elbow
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onPointerDown={() => startHold("j3", -STEP)}
                onPointerUp={stopHold}
                onPointerLeave={stopHold}
                className="rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] px-4 py-3 text-sm font-semibold active:bg-[#0071e3] active:text-white"
              >
                Elbow −
              </button>
              <button
                type="button"
                onPointerDown={() => startHold("j3", STEP)}
                onPointerUp={stopHold}
                onPointerLeave={stopHold}
                className="rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] px-4 py-3 text-sm font-semibold active:bg-[#0071e3] active:text-white"
              >
                Elbow +
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-wide text-[#86868b]">
              Gripper
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...state, grip: "open" })}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold ${
                  state.grip === "open"
                    ? "border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]"
                    : "border-[#d2d2d7] bg-white text-[#6e6e73]"
                }`}
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...state, grip: "closed" })}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold ${
                  state.grip === "closed"
                    ? "border-[#ff9500] bg-[#ff9500]/10 text-[#c93400]"
                    : "border-[#d2d2d7] bg-white text-[#6e6e73]"
                }`}
              >
                Close
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onChange({ j1: 25, j2: -45, j3: 70, grip: "open" })
            }
            className="w-full rounded-xl border border-[#d2d2d7] py-2 text-xs font-medium text-[#0071e3] hover:bg-[#f5f5f7]"
          >
            Home position
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {(["j1", "j2", "j3"] as const).map((j) => (
          <div key={j} className="rounded-xl bg-[#f5f5f7] px-2 py-2 text-center">
            <p className="text-[10px] text-[#86868b]">{ROBOT_LIMITS[j].label}</p>
            <p className="font-mono text-sm font-semibold tabular-nums">{state[j]}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}
