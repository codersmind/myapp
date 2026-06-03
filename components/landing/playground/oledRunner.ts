import {
  runOledDslScript,
  parseDslScriptErrors,
  createOledBuffer,
  cloneBuffer,
  type OledSimState,
} from "./oledGraphics";

export { createOledBuffer, cloneBuffer, type OledSimState };
import {
  isArduinoSketch,
  runArduinoOledSketch,
  parseArduinoOledErrors,
} from "./arduinoOledParser";

export function runOledGraphicsScript(
  code: string,
  prev: OledSimState
): { state: OledSimState; error: string | null; commandCount: number } {
  if (isArduinoSketch(code)) return runArduinoOledSketch(code, prev);
  return runOledDslScript(code, prev);
}

export function parseOledScriptErrors(code: string): string | null {
  if (isArduinoSketch(code)) return parseArduinoOledErrors(code);
  return parseDslScriptErrors(code);
}
