"use client";

import { useEffect, useRef, useState } from "react";
import type { OledSimState } from "./oledGraphics";
import { OLED_W, OLED_H } from "./oledGraphics";

interface OledDisplayProps {
  state: OledSimState;
}

export function OledDisplay({ state }: OledDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blinkOn, setBlinkOn] = useState(true);

  useEffect(() => {
    if (state.anim !== "blink") return;
    const id = setInterval(() => setBlinkOn((b) => !b), 500);
    return () => clearInterval(id);
  }, [state.anim]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fg = state.invert ? "#0a0a0c" : "#5ae05a";
    const bg = state.invert ? "#5ae05a" : "#0a0a0c";
    const scale = 2;

    canvas.width = OLED_W * scale;
    canvas.height = OLED_H * scale;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const visible = state.anim !== "blink" || blinkOn;
    if (!visible) return;

    ctx.fillStyle = fg;
    for (let y = 0; y < OLED_H; y++) {
      for (let x = 0; x < OLED_W; x++) {
        if (state.pixels[y * OLED_W + x]) {
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  }, [state.pixels, state.invert, state.anim, blinkOn]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative rounded-xl border-4 border-[#2d2d2f] bg-[#1d1d1f] p-3 shadow-2xl"
        style={{ boxShadow: "inset 0 0 24px rgba(0,0,0,0.6), 0 12px 40px rgba(0,0,0,0.15)" }}
      >
        <div className="relative overflow-hidden rounded-sm">
          <canvas
            ref={canvasRef}
            className="block"
            style={{ width: OLED_W * 2, height: OLED_H * 2, imageRendering: "pixelated" }}
            aria-label="OLED 128 by 64 simulation"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
            }}
          />
        </div>
        <p className="mt-2 text-center font-mono text-[10px] text-[#86868b]">SSD1306 · 128×64 · graphics mode</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 font-mono text-[10px] text-[#86868b]">
        <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5">anim: {state.anim}</span>
        <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5">{state.invert ? "invert" : "normal"}</span>
        <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5">
          {state.pixels.reduce((a, b) => a + b, 0)} px on
        </span>
      </div>
    </div>
  );
}
