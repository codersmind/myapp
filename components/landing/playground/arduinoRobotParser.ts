/**
 * Parse Arduino Servo-style robot arm sketches for simulation.
 */

import type { RobotSimState } from "./playgroundRunner";

const J1_MIN = -90;
const J1_MAX = 90;
const J2_MIN = -85;
const J2_MAX = 35;
const J3_MIN = 0;
const J3_MAX = 120;

function clampJ1(v: number) {
  return Math.max(J1_MIN, Math.min(J1_MAX, v));
}
function clampJ2(v: number) {
  return Math.max(J2_MIN, Math.min(J2_MAX, v));
}
function clampJ3(v: number) {
  return Math.max(J3_MIN, Math.min(J3_MAX, v));
}

export function isArduinoRobotSketch(code: string): boolean {
  return (
    /#include\s*[<"]/i.test(code) ||
    /void\s+setup\s*\(/i.test(code) ||
    /\bServo\b/i.test(code) ||
    /\.write\s*\(/i.test(code) ||
    /PIN_BASE|servoBase|angleBase/i.test(code)
  );
}

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function extractBalancedBody(code: string, openBraceIndex: number): string {
  let depth = 0;
  for (let i = openBraceIndex; i < code.length; i++) {
    if (code[i] === "{") depth++;
    else if (code[i] === "}") {
      depth--;
      if (depth === 0) return code.slice(openBraceIndex + 1, i);
    }
  }
  return "";
}

function extractFunctionBody(code: string, name: string): string {
  const re = new RegExp(`void\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, "i");
  const m = re.exec(code);
  if (!m) return "";
  const braceStart = code.indexOf("{", m.index);
  if (braceStart < 0) return "";
  return extractBalancedBody(code, braceStart);
}

function extractGlobalAssignments(code: string): string {
  const lines: string[] = [];
  for (const raw of code.split("\n")) {
    const t = raw.trim();
    if (/^(?:int|bool|float)\s+\w+\s*=\s*[-\d]+/i.test(t)) {
      lines.push(t.replace(/^(?:int|bool|float)\s+/, ""));
    }
  }
  return lines.join(";");
}

function extractAllBodies(code: string): string {
  const cleaned = stripComments(code)
    .replace(/#include[^\n]*/gi, "")
    .replace(/#define[^\n]*/gi, "")
    .replace(/\bServo\s+\w+\s*;/gi, "")
    .replace(/const\s+int\s+PIN_\w+\s*=\s*\d+\s*;/gi, "");

  const parts = [
    extractGlobalAssignments(cleaned),
    extractFunctionBody(cleaned, "setup"),
    extractFunctionBody(cleaned, "loop"),
    extractFunctionBody(cleaned, "applyArmPosition"),
    extractFunctionBody(cleaned, "moveArm"),
  ].filter(Boolean);

  return parts.length ? parts.join("\n") : cleaned;
}

function splitArgs(argsStr: string): string[] {
  const args: string[] = [];
  let cur = "";
  let depth = 0;
  for (let i = 0; i < argsStr.length; i++) {
    const ch = argsStr[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      args.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
}

function parseNum(expr: string): number {
  const m = expr.trim().match(/-?\d+/);
  return m ? Number(m[0]) : 0;
}

function jointFromServoName(name: string): keyof Pick<RobotSimState, "j1" | "j2" | "j3"> | "grip" | null {
  const n = name.toLowerCase();
  if (/base|j1|yaw|rotate/.test(n)) return "j1";
  if (/shoulder|j2|pitch|lift/.test(n)) return "j2";
  if (/elbow|j3|fore/.test(n)) return "j3";
  if (/grip|grab|claw|hand/.test(n)) return "grip";
  return null;
}

function gripFromWriteValue(v: number): "open" | "closed" {
  return v < 60 ? "closed" : "open";
}

function isIgnoredLine(s: string): boolean {
  if (!s || /^[\{\}]$/.test(s)) return true;
  if (/^if\s*\(/i.test(s)) return true;
  if (/^else\b/i.test(s)) return true;
  if (/^for\s*\(/i.test(s)) return true;
  if (/^while\s*\(/i.test(s)) return true;
  if (/^Serial\./i.test(s)) return true;
  if (/\.attach\s*\(/i.test(s)) return true;
  if (/^const\s+/i.test(s)) return true;
  if (/^void\s+/i.test(s)) return true;
  if (/^return\s*;?$/i.test(s)) return true;
  if (/^delay\s*\(/i.test(s)) return true;
  if (/constrain\s*\(/i.test(s)) return true;
  return false;
}

function applyJoint(
  state: RobotSimState,
  joint: keyof Pick<RobotSimState, "j1" | "j2" | "j3"> | "grip",
  value: number | boolean
): RobotSimState {
  if (joint === "grip") {
    const closed = typeof value === "boolean" ? value : gripFromWriteValue(Number(value));
    return { ...state, grip: closed ? "closed" : "open" };
  }
  if (joint === "j1") return { ...state, j1: clampJ1(Number(value)) };
  if (joint === "j2") return { ...state, j2: clampJ2(Number(value)) };
  return { ...state, j3: clampJ3(Number(value)) };
}

function parseStatement(stmt: string, state: RobotSimState): { state: RobotSimState; error: string | null } {
  const s = stmt.trim().replace(/\s+/g, " ");
  if (!s || isIgnoredLine(s)) return { state, error: null };

  const assign = s.match(/^(?:int|float|bool)?\s*(\w+)\s*=\s*(-?\d+|true|false|closed|open)/i);
  if (assign) {
    const key = assign[1].toLowerCase();
    const raw = assign[2].toLowerCase();
    const joint =
      key === "j1" || key === "anglebase" || key === "base"
        ? "j1"
        : key === "j2" || key === "angleshoulder" || key === "shoulder"
          ? "j2"
          : key === "j3" || key === "angleelbow" || key === "elbow"
            ? "j3"
            : key === "grip" || key === "gripclosed" || key === "gripper"
              ? "grip"
              : null;
    if (joint) {
      if (joint === "grip") {
        const closed = raw === "closed" || raw === "close" || raw === "1" || raw === "true";
        return { state: applyJoint(state, "grip", closed), error: null };
      }
      return { state: applyJoint(state, joint, parseNum(raw)), error: null };
    }
  }

  const writeM = s.match(/(\w+)\.write\s*\(\s*([^)]*)\)/i);
  if (writeM) {
    const joint = jointFromServoName(writeM[1]);
    if (joint) {
      const val = parseNum(splitArgs(writeM[2])[0] ?? "0");
      if (joint === "grip") return { state: applyJoint(state, "grip", val), error: null };
      if (joint === "j1") return { state: applyJoint(state, "j1", val - 90), error: null };
      if (joint === "j2") return { state: applyJoint(state, "j2", val - 90), error: null };
      return { state: applyJoint(state, "j3", val), error: null };
    }
  }

  const moveM = s.match(/moveArm\s*\(\s*([^)]*)\)/i);
  if (moveM) {
    const a = splitArgs(moveM[1]);
    let next = state;
    if (a[0] !== undefined) next = applyJoint(next, "j1", parseNum(a[0]));
    if (a[1] !== undefined) next = applyJoint(next, "j2", parseNum(a[1]));
    if (a[2] !== undefined) next = applyJoint(next, "j3", parseNum(a[2]));
    if (a[3] !== undefined) next = applyJoint(next, "grip", parseNum(a[3]) !== 0);
    return { state: next, error: null };
  }

  const dslAssign = s.match(/^(j[123]|grip)\s*=\s*(.+)$/i);
  if (dslAssign) {
    const key = dslAssign[1].toLowerCase();
    const raw = dslAssign[2].trim().toLowerCase();
    if (key === "grip") {
      return {
        state: applyJoint(state, "grip", raw === "closed" || raw === "close"),
        error: null,
      };
    }
    return { state: applyJoint(state, key as "j1" | "j2" | "j3", parseNum(raw)), error: null };
  }

  if (/\.(attach|begin)\s*\(/i.test(s) || /^pinMode/i.test(s)) {
    return { state, error: null };
  }

  return { state, error: null };
}

export function parseArduinoRobotErrors(code: string): string | null {
  if (!isArduinoRobotSketch(code)) return null;
  let state: RobotSimState = { j1: 0, j2: -45, j3: 70, grip: "open" };
  const body = extractAllBodies(code);
  const stmts = body.split(";").map((x) => x.trim()).filter(Boolean);
  if (!stmts.length) return "Add void setup() with servo writes or angle variables";
  for (const stmt of stmts) {
    const r = parseStatement(stmt, state);
    if (r.error) return r.error;
    state = r.state;
  }
  return null;
}

export function runArduinoRobotSketch(code: string, prev: RobotSimState): RobotSimState {
  let state = { ...prev };
  const body = extractAllBodies(code);
  for (const stmt of body.split(";").map((x) => x.trim()).filter(Boolean)) {
    const r = parseStatement(stmt, state);
    if (!r.error) state = r.state;
  }
  return state;
}

export function robotStateToArduinoCode(state: RobotSimState): string {
  const gripVal = state.grip === "closed" ? 30 : 110;
  return `#include <Servo.h>

Servo servoBase;
Servo servoShoulder;
Servo servoElbow;
Servo servoGrip;

const int PIN_BASE = 3;
const int PIN_SHOULDER = 5;
const int PIN_ELBOW = 6;
const int PIN_GRIP = 9;

int angleBase = ${Math.round(state.j1)};
int angleShoulder = ${Math.round(state.j2)};
int angleElbow = ${Math.round(state.j3)};
int gripClosed = ${state.grip === "closed" ? 1 : 0};

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
  // Use joystick panel or serial to update angles, then applyArmPosition()
}`;
}

export const ROBOT_LIMITS = {
  j1: { min: J1_MIN, max: J1_MAX, label: "Base" },
  j2: { min: J2_MIN, max: J2_MAX, label: "Shoulder" },
  j3: { min: J3_MIN, max: J3_MAX, label: "Elbow" },
};
