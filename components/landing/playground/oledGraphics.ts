/** 128×64 SSD1306-style framebuffer + Arduino-like draw API */

export const OLED_W = 128;
export const OLED_H = 64;

export type OledAnim = "static" | "blink" | "scroll";

export type OledSimState = {
  pixels: Uint8Array;
  invert: boolean;
  anim: OledAnim;
  /** Last run mode for UI */
  usedGraphics: boolean;
};

export function createOledBuffer(fill = 0): Uint8Array {
  return new Uint8Array(OLED_W * OLED_H).fill(fill);
}

export function cloneBuffer(buf: Uint8Array): Uint8Array {
  return new Uint8Array(buf);
}

function inBounds(x: number, y: number) {
  return x >= 0 && x < OLED_W && y >= 0 && y < OLED_H;
}

export function setPixel(buf: Uint8Array, x: number, y: number, on = 1) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  if (!inBounds(ix, iy)) return;
  buf[iy * OLED_W + ix] = on ? 1 : 0;
}

export function clearBuffer(buf: Uint8Array) {
  buf.fill(0);
}

export function drawLine(
  buf: Uint8Array,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  on = 1
) {
  let x = Math.floor(x0);
  let y = Math.floor(y0);
  const xe = Math.floor(x1);
  const ye = Math.floor(y1);
  const dx = Math.abs(xe - x);
  const dy = Math.abs(ye - y);
  const sx = x < xe ? 1 : -1;
  const sy = y < ye ? 1 : -1;
  let err = dx - dy;
  while (true) {
    setPixel(buf, x, y, on);
    if (x === xe && y === ye) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

export function drawRect(buf: Uint8Array, x: number, y: number, w: number, h: number) {
  drawLine(buf, x, y, x + w, y);
  drawLine(buf, x + w, y, x + w, y + h);
  drawLine(buf, x + w, y + h, x, y + h);
  drawLine(buf, x, y + h, x, y);
}

export function fillRect(buf: Uint8Array, x: number, y: number, w: number, h: number) {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(OLED_W, Math.floor(x + w));
  const y1 = Math.min(OLED_H, Math.floor(y + h));
  for (let py = y0; py < y1; py++) {
    for (let px = x0; px < x1; px++) {
      setPixel(buf, px, py, 1);
    }
  }
}

function plotCircle(buf: Uint8Array, cx: number, cy: number, r: number, fill: boolean) {
  const r2 = r * r;
  const minY = Math.max(0, Math.floor(cy - r));
  const maxY = Math.min(OLED_H - 1, Math.ceil(cy + r));
  const minX = Math.max(0, Math.floor(cx - r));
  const maxX = Math.min(OLED_W - 1, Math.ceil(cx + r));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const d = (x - cx) ** 2 + (y - cy) ** 2;
      if (fill) {
        if (d <= r2) setPixel(buf, x, y, 1);
      } else {
        const dist = Math.sqrt(d);
        if (Math.abs(dist - r) < 0.85) setPixel(buf, x, y, 1);
      }
    }
  }
}

export function drawCircle(buf: Uint8Array, cx: number, cy: number, r: number) {
  plotCircle(buf, cx, cy, r, false);
}

export function fillCircle(buf: Uint8Array, cx: number, cy: number, r: number) {
  plotCircle(buf, cx, cy, r, true);
}

/** Minimal 5×7 ASCII font */
const FONT5x7: Record<string, number[]> = {
  " ": [0, 0, 0, 0, 0],
  "!": [0, 0, 95, 0, 0],
  ".": [0, 0, 96, 0, 0],
  "-": [8, 8, 8, 8, 8],
  ":": [0, 36, 36, 0, 0],
  "%": [35, 24, 78, 17, 0],
  "0": [62, 81, 81, 81, 62],
  "1": [0, 65, 127, 65, 0],
  "2": [33, 67, 69, 81, 49],
  "3": [34, 65, 73, 73, 54],
  "4": [24, 40, 72, 127, 8],
  "5": [121, 73, 73, 73, 54],
  "6": [38, 73, 73, 73, 54],
  "7": [1, 1, 113, 15, 0],
  "8": [54, 73, 73, 73, 54],
  "9": [54, 73, 73, 41, 30],
  A: [126, 17, 17, 17, 126],
  C: [62, 65, 65, 65, 34],
  D: [126, 65, 65, 65, 62],
  E: [127, 73, 73, 73, 65],
  G: [54, 73, 73, 77, 42],
  H: [127, 8, 8, 8, 127],
  I: [0, 65, 127, 65, 0],
  L: [127, 65, 65, 65, 65],
  M: [127, 2, 12, 2, 127],
  N: [127, 4, 8, 16, 127],
  O: [62, 65, 65, 65, 62],
  P: [127, 9, 9, 9, 6],
  R: [127, 9, 9, 9, 70],
  S: [38, 73, 73, 73, 50],
  T: [1, 1, 127, 1, 1],
  U: [62, 64, 64, 64, 62],
  W: [62, 64, 56, 64, 62],
  X: [99, 20, 8, 20, 99],
  Y: [3, 4, 120, 4, 3],
};

function drawChar(buf: Uint8Array, x: number, y: number, ch: string, scale: number) {
  const glyph = FONT5x7[ch] ?? FONT5x7[ch.toUpperCase()] ?? FONT5x7[" "] ?? [0, 0, 0, 0, 0];
  for (let col = 0; col < 5; col++) {
    const bits = glyph[col] ?? 0;
    for (let row = 0; row < 7; row++) {
      if (bits & (1 << row)) {
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            setPixel(buf, x + col * scale + sx, y + row * scale + sy, 1);
          }
        }
      }
    }
  }
}

export function drawText(
  buf: Uint8Array,
  x: number,
  y: number,
  text: string,
  scale = 1
) {
  let cx = x;
  const s = Math.max(1, Math.min(3, Math.floor(scale)));
  for (const ch of text) {
    drawChar(buf, cx, y, ch, s);
    cx += 6 * s;
  }
}

function tokenize(line: string): string[] {
  const tokens: string[] = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    tokens.push(m[1] ?? m[2] ?? m[3]);
  }
  return tokens;
}

function parseNums(tokens: string[], start: number, count: number): number[] | null {
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const n = Number(tokens[start + i]);
    if (Number.isNaN(n)) return null;
    out.push(n);
  }
  return out;
}

const COMMAND_RE =
  /^(clear|display|pixel|setpixel|line|drawline|rect|drawrect|fillrect|circle|drawcircle|fillcircle|text|println)\b/i;

export function parseDslScriptErrors(code: string): string | null {
  for (const raw of code.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("//")) continue;
    if (COMMAND_RE.test(line)) continue;
    if (/^[a-zA-Z_][\w]*\s*=\s*.+$/.test(line)) continue;
    return `Unknown line: ${line.slice(0, 48)}`;
  }
  return null;
}

export function runOledDslScript(
  code: string,
  prev: OledSimState
): { state: OledSimState; error: string | null; commandCount: number } {
  const buf = createOledBuffer(0);
  let invert = prev.invert;
  let anim: OledAnim = prev.anim;
  let commandCount = 0;
  let autoWeather = true;

  for (const raw of code.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("//")) continue;

    const assign = line.match(/^([a-zA-Z_][\w]*)\s*=\s*(.+)$/i);
    if (assign) {
      const key = assign[1].toLowerCase();
      const val = assign[2].trim().replace(/^["']|["']$/g, "");
      if (key === "invert") {
        invert = val === "true" || val === "1";
      } else if (key === "anim" || key === "animation") {
        if (val === "blink" || val === "scroll" || val === "static") anim = val;
      }
      if (["temp", "temperature", "humidity", "condition", "line1", "line2"].includes(key)) {
        /* weather vars handled after draw pass */
      } else {
        autoWeather = false;
      }
      continue;
    }

    const tokens = tokenize(line);
    if (!tokens.length) continue;
    const cmd = tokens[0].toLowerCase();
    commandCount++;

    switch (cmd) {
      case "clear":
        clearBuffer(buf);
        break;
      case "display":
        break;
      case "pixel":
      case "setpixel": {
        const n = parseNums(tokens, 1, 3);
        if (!n) return { state: prev, error: `pixel needs x y [0|1]: ${line}`, commandCount };
        setPixel(buf, n[0], n[1], n[2] !== undefined ? (n[2] ? 1 : 0) : 1);
        autoWeather = false;
        break;
      }
      case "line":
      case "drawline": {
        const n = parseNums(tokens, 1, 4);
        if (!n) return { state: prev, error: `drawLine needs x1 y1 x2 y2: ${line}`, commandCount };
        drawLine(buf, n[0], n[1], n[2], n[3]);
        autoWeather = false;
        break;
      }
      case "rect":
      case "drawrect": {
        const n = parseNums(tokens, 1, 4);
        if (!n) return { state: prev, error: `drawRect needs x y w h: ${line}`, commandCount };
        drawRect(buf, n[0], n[1], n[2], n[3]);
        autoWeather = false;
        break;
      }
      case "fillrect": {
        const n = parseNums(tokens, 1, 4);
        if (!n) return { state: prev, error: `fillRect needs x y w h: ${line}`, commandCount };
        fillRect(buf, n[0], n[1], n[2], n[3]);
        autoWeather = false;
        break;
      }
      case "circle":
      case "drawcircle": {
        const n = parseNums(tokens, 1, 3);
        if (!n) return { state: prev, error: `drawCircle needs x y r: ${line}`, commandCount };
        drawCircle(buf, n[0], n[1], n[2]);
        autoWeather = false;
        break;
      }
      case "fillcircle": {
        const n = parseNums(tokens, 1, 3);
        if (!n) return { state: prev, error: `fillCircle needs x y r: ${line}`, commandCount };
        fillCircle(buf, n[0], n[1], n[2]);
        autoWeather = false;
        break;
      }
      case "text":
      case "println": {
        const n = parseNums(tokens, 1, 2);
        if (!n) return { state: prev, error: `text needs x y "message": ${line}`, commandCount };
        let scale = 1;
        let textParts = tokens.slice(3);
        const sizeIdx = textParts.findIndex((t) => t.toLowerCase() === "size");
        if (sizeIdx >= 0 && sizeIdx + 1 < textParts.length) {
          scale = Number(textParts[sizeIdx + 1]) || 1;
          textParts = textParts.slice(0, sizeIdx).concat(textParts.slice(sizeIdx + 2));
        } else if (textParts.length > 1 && /^\d+$/.test(textParts[textParts.length - 1]!)) {
          scale = Number(textParts.pop());
        }
        drawText(buf, n[0], n[1], textParts.join(" "), scale);
        autoWeather = false;
        break;
      }
      default:
        return { state: prev, error: `Unknown command: ${cmd}`, commandCount };
    }
  }

  const assigns = parseAssignmentsOnly(code);
  if (autoWeather && (assigns.temp !== undefined || assigns.humidity !== undefined)) {
    drawWeatherTemplate(buf, assigns);
  }

  return {
    state: {
      pixels: buf,
      invert,
      anim,
      usedGraphics: commandCount > 0 || !autoWeather,
    },
    error: null,
    commandCount,
  };
}

function parseAssignmentsOnly(code: string): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const line of code.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//")) continue;
    if (COMMAND_RE.test(trimmed)) continue;
    const m = trimmed.match(/^([a-zA-Z_][\w]*)\s*=\s*(.+)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    let raw = m[2].trim();
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      out[key] = raw.slice(1, -1);
      continue;
    }
    const num = Number(raw);
    out[key] = Number.isNaN(num) ? raw.toLowerCase() : num;
  }
  return out;
}

function drawWeatherTemplate(buf: Uint8Array, v: Record<string, string | number>) {
  clearBuffer(buf);
  fillRect(buf, 0, 0, 128, 11);
  const temp = typeof v.temp === "number" ? v.temp : typeof v.temperature === "number" ? v.temperature : 22;
  const hum = typeof v.humidity === "number" ? v.humidity : 50;
  const cond = typeof v.condition === "string" ? v.condition : "clear";
  drawText(buf, 4, 2, String(v.line1 ?? "NEXEDGE WX"), 1);
  drawLine(buf, 0, 12, 127, 12);
  drawText(buf, 8, 20, String(v.line2 ?? `${temp} C`), 2);
  drawText(buf, 8, 40, String(v.line3 ?? `RH ${hum}%`), 1);
  drawText(buf, 8, 52, String(v.line4 ?? cond.toUpperCase()), 1);
  if (cond.includes("rain")) {
    for (let i = 0; i < 5; i++) drawLine(buf, 98 + i * 4, 38, 96 + i * 4, 48);
    drawCircle(buf, 100, 28, 12);
  } else if (cond.includes("cloud")) {
    fillCircle(buf, 92, 30, 8);
    fillCircle(buf, 104, 30, 10);
    fillRect(buf, 88, 30, 24, 8);
  } else {
    drawCircle(buf, 100, 28, 10);
    fillCircle(buf, 100, 28, 3);
  }
}


export function bufferToPixelCode(buf: Uint8Array): string {
  const lines: string[] = ["// Painted pixels", "clear"];
  for (let y = 0; y < OLED_H; y++) {
    for (let x = 0; x < OLED_W; x++) {
      if (buf[y * OLED_W + x]) lines.push(`pixel ${x} ${y} 1`);
    }
  }
  if (lines.length === 2) lines.push("// (empty)");
  return lines.join("\n");
}

export function mergePaintedBuffer(base: Uint8Array, painted: Uint8Array): Uint8Array {
  const out = cloneBuffer(base);
  for (let i = 0; i < out.length; i++) {
    if (painted[i]) out[i] = 1;
  }
  return out;
}
