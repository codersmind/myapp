/**
 * Parses a subset of real Arduino / Adafruit SSD1306 sketch code
 * and runs it on the 128×64 simulation buffer.
 */

import {
  clearBuffer,
  createOledBuffer,
  drawCircle,
  drawRect,
  drawText,
  fillCircle,
  fillRect,
  drawLine,
  OLED_H,
  OLED_W,
  setPixel,
  type OledAnim,
  type OledSimState,
} from "./oledGraphics";

export function isArduinoSketch(code: string): boolean {
  return (
    /#include\s*[<"]/i.test(code) ||
    /void\s+setup\s*\(/i.test(code) ||
    /Adafruit_SSD1306/i.test(code) ||
    /clearDisplay\s*\(/i.test(code) ||
    /display\s*\./i.test(code)
  );
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

function splitArgs(argsStr: string): string[] {
  const args: string[] = [];
  let cur = "";
  let depth = 0;
  let quote: string | null = null;
  for (let i = 0; i < argsStr.length; i++) {
    const ch = argsStr[i];
    if (quote) {
      cur += ch;
      if (ch === quote && argsStr[i - 1] !== "\\") quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      cur += ch;
      continue;
    }
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      args.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
}

function parseNum(expr: string): number {
  const t = expr.trim();
  if (/^(SSD1306_WHITE|WHITE|true|1)$/i.test(t)) return 1;
  if (/^(SSD1306_BLACK|BLACK|false|0)$/i.test(t)) return 0;
  const m = t.match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

function extractString(expr: string): string {
  const m = expr.match(/F\s*\(\s*"([^"]*)"\s*\)/i) ?? expr.match(/"([^"]*)"/);
  return m ? m[1] : expr.replace(/"/g, "").trim();
}

function extractBalancedBody(code: string, openBraceIndex: number): string {
  let depth = 0;
  for (let i = openBraceIndex; i < code.length; i++) {
    const ch = code[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
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

function preprocessBody(body: string): string {
  return body
    .replace(/\bfor\s*\([^)]*\)\s*;/gi, "")
    .replace(/\bwhile\s*\([^)]*\)\s*;/gi, "");
}

function extractStatements(code: string): string[] {
  const cleaned = stripComments(code)
    .replace(/#include[^\n]*/gi, "")
    .replace(/#define[^\n]*/gi, "")
    .replace(/Adafruit_SSD1306\s+\w+\s*\([^;]*\)\s*;/gi, "")
    .replace(/^\s*(int|void|uint\d*_t|bool)\s+[\w\s,=*&]+\s*;/gm, "");

  const setupBody = extractFunctionBody(cleaned, "setup");
  const loopBody = extractFunctionBody(cleaned, "loop");
  const source = preprocessBody(
    [setupBody, loopBody].filter(Boolean).join("\n") || cleaned
  );

  return source
    .split(";")
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 0 && !/^[\{\}]$/.test(s));
}

/** Arduino boilerplate — safe to skip in simulation */
function isIgnoredArduinoStatement(s: string): boolean {
  if (/^[\{\}]$/.test(s)) return true;
  if (/^if\s*\(/i.test(s)) return true;
  if (/^else\b/i.test(s)) return true;
  if (/^for\s*\(/i.test(s)) return true;
  if (/^while\s*\(/i.test(s)) return true;
  if (/^switch\s*\(/i.test(s)) return true;
  if (/^case\s+/i.test(s)) return true;
  if (/^break\s*$/i.test(s)) return true;
  if (/^return\s*$/i.test(s)) return true;
  if (/^Serial\./i.test(s)) return true;
  if (/^Wire\./i.test(s)) return true;
  if (!/display\.|oled\./i.test(s) && !/^delay\s*\(/i.test(s) && !/^pinMode\s*\(/i.test(s) && !/^digitalWrite\s*\(/i.test(s)) {
    if (/^\w+\s*=\s*/.test(s)) return true;
  }
  return false;
}

type ExecCtx = {
  buf: Uint8Array;
  cursorX: number;
  cursorY: number;
  textSize: number;
  invert: boolean;
  anim: OledAnim;
  count: number;
};

function execStatement(stmt: string, ctx: ExecCtx): string | null {
  const s = stmt.trim();
  if (!s || isIgnoredArduinoStatement(s)) return null;

  if (/^(?:display\.|oled\.)?begin\s*\(/i.test(s) || /^Serial\.begin/i.test(s)) {
    ctx.count++;
    return null;
  }

  if (/(?:display\.|oled\.)?clearDisplay\s*\(\s*\)/i.test(s)) {
    clearBuffer(ctx.buf);
    ctx.count++;
    return null;
  }

  if (/(?:display\.|oled\.)?display\s*\(\s*\)/i.test(s)) {
    ctx.count++;
    return null;
  }

  if (/(?:display\.|oled\.)?invertDisplay\s*\(\s*([^)]*)\)/i.test(s)) {
    const m = s.match(/invertDisplay\s*\(\s*([^)]*)\)/i);
    ctx.invert = m ? parseNum(m[1]) !== 0 : true;
    ctx.count++;
    return null;
  }

  const fillRectM = s.match(/(?:display\.|oled\.)?fillRect\s*\(\s*([^)]*)\)/i);
  if (fillRectM) {
    const a = splitArgs(fillRectM[1]);
    if (a.length < 4) return "fillRect needs x, y, width, height";
    fillRect(ctx.buf, parseNum(a[0]), parseNum(a[1]), parseNum(a[2]), parseNum(a[3]));
    ctx.count++;
    return null;
  }

  const drawRectM = s.match(/(?:display\.|oled\.)?drawRect\s*\(\s*([^)]*)\)/i);
  if (drawRectM) {
    const a = splitArgs(drawRectM[1]);
    if (a.length < 4) return "drawRect needs x, y, width, height";
    drawRect(ctx.buf, parseNum(a[0]), parseNum(a[1]), parseNum(a[2]), parseNum(a[3]));
    ctx.count++;
    return null;
  }

  const lineM = s.match(/(?:display\.|oled\.)?drawLine\s*\(\s*([^)]*)\)/i);
  if (lineM) {
    const a = splitArgs(lineM[1]);
    if (a.length < 4) return "drawLine needs x0, y0, x1, y1";
    drawLine(ctx.buf, parseNum(a[0]), parseNum(a[1]), parseNum(a[2]), parseNum(a[3]));
    ctx.count++;
    return null;
  }

  const circleM = s.match(/(?:display\.|oled\.)?drawCircle\s*\(\s*([^)]*)\)/i);
  if (circleM) {
    const a = splitArgs(circleM[1]);
    if (a.length < 3) return "drawCircle needs x, y, radius";
    drawCircle(ctx.buf, parseNum(a[0]), parseNum(a[1]), parseNum(a[2]));
    ctx.count++;
    return null;
  }

  const fillCircleM = s.match(/(?:display\.|oled\.)?fillCircle\s*\(\s*([^)]*)\)/i);
  if (fillCircleM) {
    const a = splitArgs(fillCircleM[1]);
    if (a.length < 3) return "fillCircle needs x, y, radius";
    fillCircle(ctx.buf, parseNum(a[0]), parseNum(a[1]), parseNum(a[2]));
    ctx.count++;
    return null;
  }

  const pixelM = s.match(/(?:display\.|oled\.)?drawPixel\s*\(\s*([^)]*)\)/i);
  if (pixelM) {
    const a = splitArgs(pixelM[1]);
    if (a.length < 2) return "drawPixel needs x, y";
    const on = a[2] !== undefined ? parseNum(a[2]) !== 0 : true;
    setPixel(ctx.buf, parseNum(a[0]), parseNum(a[1]), on ? 1 : 0);
    ctx.count++;
    return null;
  }

  const cursorM = s.match(/(?:display\.|oled\.)?setCursor\s*\(\s*([^)]*)\)/i);
  if (cursorM) {
    const a = splitArgs(cursorM[1]);
    ctx.cursorX = parseNum(a[0]);
    ctx.cursorY = parseNum(a[1]);
    ctx.count++;
    return null;
  }

  const sizeM = s.match(/(?:display\.|oled\.)?setTextSize\s*\(\s*([^)]*)\)/i);
  if (sizeM) {
    ctx.textSize = Math.max(1, Math.min(3, parseNum(splitArgs(sizeM[1])[0])));
    ctx.count++;
    return null;
  }

  const printM = s.match(/(?:display\.|oled\.)?print(?:ln)?\s*\(\s*([^)]*)\)/i);
  if (printM) {
    const text = extractString(printM[1]);
    drawText(ctx.buf, ctx.cursorX, ctx.cursorY, text, ctx.textSize);
    ctx.cursorY += 8 * ctx.textSize;
    ctx.count++;
    return null;
  }

  if (/^(?:display\.|oled\.)?setTextColor\s*\(/i.test(s)) {
    ctx.count++;
    return null;
  }

  if (/^delay\s*\(/i.test(s)) {
    ctx.count++;
    return null;
  }

  if (/^pinMode\s*\(/i.test(s) || /^digitalWrite\s*\(/i.test(s)) {
    ctx.count++;
    return null;
  }

  if (!/display\.|oled\./i.test(s)) {
    return null;
  }

  return `Unsupported display call: ${s.slice(0, 56)}`;
}

export function parseArduinoOledErrors(code: string): string | null {
  if (!isArduinoSketch(code)) return null;
  const stmts = extractStatements(code);
  if (!stmts.length) return "Add void setup() { ... } with display commands";
  const ctx: ExecCtx = {
    buf: createOledBuffer(0),
    cursorX: 0,
    cursorY: 0,
    textSize: 1,
    invert: false,
    anim: "static",
    count: 0,
  };
  for (const stmt of stmts) {
    const err = execStatement(stmt, ctx);
    if (err) return err;
  }
  return null;
}

export function runArduinoOledSketch(
  code: string,
  prev: OledSimState
): { state: OledSimState; error: string | null; commandCount: number } {
  const ctx: ExecCtx = {
    buf: createOledBuffer(0),
    cursorX: 0,
    cursorY: 0,
    textSize: 1,
    invert: prev.invert,
    anim: prev.anim,
    count: 0,
  };

  for (const stmt of extractStatements(code)) {
    const err = execStatement(stmt, ctx);
    if (err) {
      return { state: prev, error: err, commandCount: ctx.count };
    }
  }

  return {
    state: {
      pixels: ctx.buf,
      invert: ctx.invert,
      anim: ctx.anim,
      usedGraphics: true,
    },
    error: null,
    commandCount: ctx.count,
  };
}

export function bufferToArduinoCode(buf: Uint8Array): string {
  const lines = [
    "// Exported from pixel editor",
    "void setup() {",
    "  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);",
    "  display.clearDisplay();",
  ];
  for (let y = 0; y < OLED_H; y++) {
    for (let x = 0; x < OLED_W; x++) {
      if (buf[y * OLED_W + x]) {
        lines.push(`  display.drawPixel(${x}, ${y}, SSD1306_WHITE);`);
      }
    }
  }
  lines.push("  display.display();", "}", "", "void loop() {", "}");
  return lines.join("\n");
}
