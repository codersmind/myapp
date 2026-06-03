"use client";

import { useState, useMemo } from "react";
import { CodePanel } from "./CodePanel";
import { OledDisplay } from "./OledDisplay";
import { OledPixelEditor } from "./OledPixelEditor";
import {
  runOledGraphicsScript,
  parseOledScriptErrors,
  createOledBuffer,
  cloneBuffer,
  type OledSimState,
} from "./oledRunner";
import { bufferToArduinoCode } from "./arduinoOledParser";

const DEFAULT_CODE = `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  Serial.begin(115200);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);
  }

  display.clearDisplay();

  display.fillRect(0, 0, 128, 11, SSD1306_WHITE);
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(4, 2);
  display.print(F("NEXEDGE WX"));

  display.drawLine(0, 12, 127, 12, SSD1306_WHITE);
  display.drawCircle(100, 38, 14, SSD1306_WHITE);
  display.fillCircle(100, 38, 4, SSD1306_WHITE);
  display.drawPixel(20, 50, SSD1306_WHITE);

  display.display();
}

void loop() {
  // Add animation or sensor updates here
}`;

const ARDUINO_CHEATSHEET = [
  "display.clearDisplay();",
  "display.fillRect(x, y, w, h, SSD1306_WHITE);",
  "display.drawRect(x, y, w, h, SSD1306_WHITE);",
  "display.drawLine(x0, y0, x1, y1, SSD1306_WHITE);",
  "display.drawCircle(x, y, r, SSD1306_WHITE);",
  "display.fillCircle(x, y, r, SSD1306_WHITE);",
  "display.drawPixel(x, y, SSD1306_WHITE);",
  "display.setCursor(x, y);",
  'display.print(F("text"));',
  "display.setTextSize(1);",
  "display.display();",
];

function buildInitialState(): OledSimState {
  const { state } = runOledGraphicsScript(DEFAULT_CODE, {
    pixels: createOledBuffer(0),
    invert: false,
    anim: "static",
    usedGraphics: true,
  });
  return state;
}

export function WeatherOledPlayground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [state, setState] = useState<OledSimState>(() => buildInitialState());
  const [paintBuf, setPaintBuf] = useState<Uint8Array>(() => cloneBuffer(state.pixels));
  const [mode, setMode] = useState<"code" | "paint">("code");
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string | null>("Arduino sketch loaded");

  const run = () => {
    const err = parseOledScriptErrors(code);
    if (err) {
      setError(err);
      return;
    }
    const result = runOledGraphicsScript(code, state);
    if (result.error) {
      setError(result.error);
      return;
    }
    setState(result.state);
    setPaintBuf(cloneBuffer(result.state.pixels));
    setError(null);
    setLog(`OK: ${result.commandCount} calls · ${result.state.pixels.reduce((a, b) => a + b, 0)} pixels on`);
  };

  const applyPaintToDisplay = () => {
    setState((s) => ({ ...s, pixels: cloneBuffer(paintBuf) }));
    setLog("Paint applied to OLED");
  };

  const mergePaintIntoCode = () => {
    setCode(bufferToArduinoCode(paintBuf));
    setMode("code");
    setLog("Exported as Arduino setup() — Run to refresh");
  };

  const previewState = useMemo(() => {
    if (mode === "paint") {
      return { ...state, pixels: paintBuf };
    }
    return state;
  }, [mode, state, paintBuf]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_minmax(280px,360px)]">
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
            onClick={() => {
              setPaintBuf(cloneBuffer(state.pixels));
              setMode("paint");
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              mode === "paint" ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#6e6e73]"
            }`}
          >
            Paint pixels
          </button>
        </div>

        {mode === "code" ? (
          <>
            <CodePanel
              title="ssd1306_oled.ino"
              hint="// Real Arduino C++ — Adafruit SSD1306 · void setup() / display.*"
              code={code}
              onChange={setCode}
              onRun={run}
              onReset={() => {
                setCode(DEFAULT_CODE);
                const s = buildInitialState();
                setState(s);
                setPaintBuf(cloneBuffer(s.pixels));
                setError(null);
                setLog("Reset to example sketch");
              }}
              error={error}
              log={log}
            />
            <details className="rounded-2xl border border-[#d2d2d7]/60 bg-white p-4 text-sm">
              <summary className="cursor-pointer font-semibold text-[#1d1d1f]">
                Adafruit SSD1306 API
              </summary>
              <ul className="mt-3 grid gap-1.5 font-mono text-[11px] text-[#48484a]">
                {ARDUINO_CHEATSHEET.map((line) => (
                  <li key={line} className="rounded-lg bg-[#f5f5f7] px-2 py-1.5">
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-[#86868b]">
                Paste code from the Arduino IDE — includes,{" "}
                <code className="text-[#1d1d1f]">void setup()</code>, and{" "}
                <code className="text-[#1d1d1f]">display.print()</code> work like on a real board.
              </p>
            </details>
          </>
        ) : (
          <div className="rounded-2xl border border-[#d2d2d7]/60 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">
              Pixel editor · 128×64
            </p>
            <p className="mt-1 text-xs text-[#86868b]">
              Draw graphics, then export as Arduino <code className="text-[#1d1d1f]">setup()</code> code.
            </p>
            <div className="mt-4 max-h-[420px] overflow-auto">
              <OledPixelEditor buffer={paintBuf} onChange={setPaintBuf} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applyPaintToDisplay}
                className="rounded-lg bg-[#0071e3] px-4 py-2 text-xs font-semibold text-white"
              >
                Apply to OLED
              </button>
              <button
                type="button"
                onClick={mergePaintIntoCode}
                className="rounded-lg border border-[#d2d2d7] px-4 py-2 text-xs font-medium text-[#1d1d1f]"
              >
                Export to .ino
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start justify-center rounded-2xl border border-[#d2d2d7]/60 bg-[#f5f5f7] p-6 xl:sticky xl:top-24">
        <OledDisplay state={previewState} />
      </div>
    </div>
  );
}
