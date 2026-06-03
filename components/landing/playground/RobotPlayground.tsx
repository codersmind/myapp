"use client";

import { useState } from "react";
import { CodePanel } from "./CodePanel";
import { RobotArmPreview } from "./RobotArmPreview";
import {
  runRobotScript,
  parseRobotScriptErrors,
  type RobotSimState,
} from "./playgroundRunner";

const DEFAULT_CODE = `// Robot arm — set joint angles (degrees)
j1 = 25
j2 = -45
j3 = 70
grip = open

// Try: grip = closed`;

const DEFAULT_STATE: RobotSimState = {
  j1: 25,
  j2: -45,
  j3: 70,
  grip: "open",
};

export function RobotPlayground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [state, setState] = useState<RobotSimState>(DEFAULT_STATE);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string | null>(null);

  const run = () => {
    const err = parseRobotScriptErrors(code);
    if (err) {
      setError(err);
      return;
    }
    const next = runRobotScript(code, state);
    setState(next);
    setError(null);
    setLog(`OK: J1=${next.j1}° J2=${next.j2}° J3=${next.j3}° grip=${next.grip}`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <CodePanel
        title="robot_arm.ino"
        hint="// Assign j1, j2, j3 (degrees) and grip = open | closed"
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
      <div className="flex items-center justify-center rounded-2xl border border-[#d2d2d7]/60 bg-white p-6 shadow-sm">
        <RobotArmPreview state={state} />
      </div>
    </div>
  );
}
