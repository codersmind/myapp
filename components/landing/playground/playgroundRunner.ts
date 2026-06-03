/** Safe line-based IoT script parser (assignments only, no eval) */

export type RobotSimState = {
  j1: number;
  j2: number;
  j3: number;
  grip: "open" | "closed";
};

export type { OledSimState, OledAnim } from "./oledGraphics";
export { createOledBuffer, cloneBuffer } from "./oledGraphics";
export { runOledGraphicsScript, parseOledScriptErrors } from "./oledRunner";

export type RelaySimState = {
  temperature: number;
  humidity: number;
  threshold: number;
  relayOn: boolean;
  fanSpeed: number;
  message: string;
  mode: "auto" | "on" | "off";
};

function parseAssignments(code: string): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const line of code.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//")) continue;
    const m = trimmed.match(/^([a-zA-Z_][\w]*)\s*=\s*(.+)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    let raw = m[2].trim();
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      out[key] = raw.slice(1, -1);
      continue;
    }
    const num = Number(raw);
    if (!Number.isNaN(num)) out[key] = num;
    else out[key] = raw.toLowerCase();
  }
  return out;
}

function num(v: string | number | undefined, fallback: number) {
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}

function str(v: string | number | undefined, fallback: string) {
  return typeof v === "string" ? v : fallback;
}

export function runRobotScript(code: string, prev: RobotSimState): RobotSimState {
  const v = parseAssignments(code);
  const gripRaw = str(v.grip, prev.grip);
  return {
    j1: num(v.j1, prev.j1),
    j2: num(v.j2, prev.j2),
    j3: num(v.j3, prev.j3),
    grip: gripRaw === "closed" || gripRaw === "close" ? "closed" : "open",
  };
}

export function runRelayScript(code: string, prev: RelaySimState): RelaySimState {
  const v = parseAssignments(code);
  const temperature = num(v.temperature ?? v.temp, prev.temperature);
  const humidity = num(v.humidity, prev.humidity);
  const threshold = num(v.threshold, prev.threshold);
  const modeRaw = str(v.relay ?? v.mode, prev.mode);
  const mode =
    modeRaw === "on" || modeRaw === "off" || modeRaw === "auto" ? modeRaw : prev.mode;

  let relayOn = prev.relayOn;
  if (mode === "on") relayOn = true;
  else if (mode === "off") relayOn = false;
  else relayOn = temperature >= threshold;

  const fanSpeed = Math.min(100, Math.max(0, num(v.fan_speed ?? v.fan, relayOn ? 70 : 0)));

  return {
    temperature,
    humidity,
    threshold,
    relayOn,
    fanSpeed,
    message: str(v.alert_msg ?? v.message, relayOn ? "ALERT: Relay ON" : "OK: Standby"),
    mode,
  };
}

export function parseRobotScriptErrors(code: string): string | null {
  for (const line of code.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("//")) continue;
    if (!/^[a-zA-Z_][\w]*\s*=\s*.+$/.test(t)) {
      return `Invalid line: ${t.slice(0, 40)}`;
    }
  }
  return null;
}
