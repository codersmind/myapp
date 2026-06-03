import {
  runRobotScript as runRobotDsl,
  parseRobotScriptErrors as parseRobotDslErrors,
  type RobotSimState,
} from "./playgroundRunner";
import {
  isArduinoRobotSketch,
  runArduinoRobotSketch,
  parseArduinoRobotErrors,
} from "./arduinoRobotParser";

export type { RobotSimState };

export function runRobotScript(code: string, prev: RobotSimState): RobotSimState {
  if (isArduinoRobotSketch(code)) return runArduinoRobotSketch(code, prev);
  return runRobotDsl(code, prev);
}

export function parseRobotScriptErrors(code: string): string | null {
  if (isArduinoRobotSketch(code)) return parseArduinoRobotErrors(code);
  return parseRobotDslErrors(code);
}
