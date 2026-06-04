"use client";

import { useState } from "react";
import { CodePanel } from "./CodePanel";
import { RobotArmPreview } from "./RobotArmPreview";
import { RobotArmController } from "./RobotArmController";
import { runRobotScript, parseRobotScriptErrors, type RobotSimState } from "./robotRunner";
import { robotStateToArduinoCode } from "./arduinoRobotParser";

const DEFAULT_CODE = `#include <Servo.h>

Servo servoBase;
Servo servoShoulder;
Servo servoElbow;
Servo servoGrip;

const int PIN_BASE = 3;
const int PIN_SHOULDER = 5;
const int PIN_ELBOW = 6;
const int PIN_GRIP = 9;

int angleBase = 25;
int angleShoulder = -45;
int angleElbow = 70;
int gripClosed = 0;

void setup() {
  Serial.begin(9600);
  servoBase.attach(PIN_BASE);
  servoShoulder.attach(PIN_SHOULDER);
  servoElbow.attach(PIN_ELBOW);
  servoGrip.attach(PIN_GRIP);
  applyArmPosition();
}

void applyArmPosition() {
  servoBase.write(constrain(angleBase + 90, 0, 180));
  servoShoulder.write(constrain(angleShoulder + 90, 0, 180));
  servoElbow.write(constrain(angleElbow, 0, 180));
  servoGrip.write(gripClosed ? 30 : 110);
}

void loop() {
  // Joystick panel updates angles, then call applyArmPosition()
}`;

const HOME_STATE: RobotSimState = {
  j1: 25,
  j2: -45,
  j3: 70,
  grip: "open",
};

function buildInitialState(): RobotSimState {
  return runRobotScript(DEFAULT_CODE, HOME_STATE);
}

export function RobotPlayground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [state, setState] = useState<RobotSimState>(() => buildInitialState());
  const [mode, setMode] = useState<"code" | "joystick">("code");
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string | null>("Arduino sketch loaded");

  const run = () => {
    const err = parseRobotScriptErrors(code);
    if (err) {
      setError(err);
      return;
    }
    const next = runRobotScript(code, state);
    setState(next);
    setError(null);
    setLog(`OK: base ${next.j1}° · shoulder ${next.j2}° · elbow ${next.j3}° · grip ${next.grip}`);
  };

  const syncJoystickToCode = () => {
    setCode(robotStateToArduinoCode(state));
    setMode("code");
    setLog("Joystick angles synced to .ino — Run to verify");
  };

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-[1fr_minmax(340px,580px)] xl:gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              mode === "code" ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#6e6e73]"
            }`}
          >
            Arduino .ino
          </button>
          <button
            type="button"
            onClick={() => setMode("joystick")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              mode === "joystick" ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#6e6e73]"
            }`}
          >
            Joystick
          </button>
        </div>

        {mode === "code" ? (
          <>
            <CodePanel
              title="robot_arm.ino"
              hint="// Real Arduino — Servo.h · void setup() · applyArmPosition()"
              code={code}
              onChange={setCode}
              onRun={run}
              onReset={() => {
                setCode(DEFAULT_CODE);
                setState(buildInitialState());
                setError(null);
                setLog("Reset to example sketch");
              }}
              error={error}
              log={log}
            />
            <details className="rounded-2xl border border-[#d2d2d7]/60 bg-white p-4 text-sm">
              <summary className="cursor-pointer font-semibold text-[#1d1d1f]">
                Servo API reference
              </summary>
              <ul className="mt-3 space-y-1.5 font-mono text-[10px] text-[#48484a] sm:text-[11px]">
                <li className="rounded-lg bg-[#f5f5f7] px-2 py-1">angleBase / angleShoulder / angleElbow</li>
                <li className="rounded-lg bg-[#f5f5f7] px-2 py-1">servoBase.write(0–180)</li>
                <li className="rounded-lg bg-[#f5f5f7] px-2 py-1">gripClosed = 0 | 1</li>
                <li className="rounded-lg bg-[#f5f5f7] px-2 py-1">applyArmPosition()</li>
              </ul>
            </details>
          </>
        ) : (
          <>
            <RobotArmController
              state={state}
              onChange={(next) => {
                setState(next);
                setLog("Live control — sync to sketch when ready");
              }}
            />
            <button
              type="button"
              onClick={syncJoystickToCode}
              className="w-full rounded-xl bg-[#0071e3] py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Sync angles to Arduino code
            </button>
          </>
        )}
      </div>

      <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-[#d2d2d7]/60 bg-white p-4 shadow-sm sm:min-h-[320px] sm:p-6 md:min-h-[380px] md:p-8 lg:sticky lg:top-24 xl:min-h-[420px]">
        <RobotArmPreview state={state} />
      </div>
    </div>
  );
}
