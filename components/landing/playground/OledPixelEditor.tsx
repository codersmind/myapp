"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  OLED_W,
  OLED_H,
  cloneBuffer,
  setPixel,
  createOledBuffer,
} from "./oledGraphics";

const SCALE = 3;

interface OledPixelEditorProps {
  buffer: Uint8Array;
  onChange: (buf: Uint8Array) => void;
}

export function OledPixelEditor({ buffer, onChange }: OledPixelEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const drawOn = useRef(true);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a0a0c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#5ae05a";
    for (let y = 0; y < OLED_H; y++) {
      for (let x = 0; x < OLED_W; x++) {
        if (buffer[y * OLED_W + x]) {
          ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
        }
      }
    }
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    for (let x = 0; x <= OLED_W; x++) {
      ctx.beginPath();
      ctx.moveTo(x * SCALE, 0);
      ctx.lineTo(x * SCALE, OLED_H * SCALE);
      ctx.stroke();
    }
    for (let y = 0; y <= OLED_H; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * SCALE);
      ctx.lineTo(OLED_W * SCALE, y * SCALE);
      ctx.stroke();
    }
  }, [buffer]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const paintAt = (clientX: number, clientY: number, forceOn?: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / rect.width) * OLED_W);
    const y = Math.floor(((clientY - rect.top) / rect.height) * OLED_H);
    if (x < 0 || x >= OLED_W || y < 0 || y >= OLED_H) return;
    const next = cloneBuffer(buffer);
    const on = forceOn ?? drawOn.current;
    if (next[y * OLED_W + x] === (on ? 1 : 0)) return;
    setPixel(next, x, y, on ? 1 : 0);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createOledBuffer(0))}
          className="rounded-lg border border-[#d2d2d7] px-3 py-1.5 text-xs font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]"
        >
          Clear canvas
        </button>
        <button
          type="button"
          onClick={() => {
            drawOn.current = true;
          }}
          className="rounded-lg border border-[#0071e3]/40 bg-[#0071e3]/10 px-3 py-1.5 text-xs font-medium text-[#0071e3]"
        >
          Draw
        </button>
        <button
          type="button"
          onClick={() => {
            drawOn.current = false;
          }}
          className="rounded-lg border border-[#d2d2d7] px-3 py-1.5 text-xs font-medium text-[#6e6e73] hover:bg-[#f5f5f7]"
        >
          Erase
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={OLED_W * SCALE}
        height={OLED_H * SCALE}
        className="cursor-crosshair rounded-lg border border-[#d2d2d7] bg-[#0a0a0c]"
        style={{ width: OLED_W * SCALE, height: OLED_H * SCALE, imageRendering: "pixelated" }}
        onPointerDown={(e) => {
          setDrawing(true);
          drawOn.current = e.button !== 2;
          paintAt(e.clientX, e.clientY, drawOn.current);
        }}
        onPointerMove={(e) => {
          if (!drawing) return;
          paintAt(e.clientX, e.clientY);
        }}
        onPointerUp={() => setDrawing(false)}
        onPointerLeave={() => setDrawing(false)}
        onContextMenu={(e) => e.preventDefault()}
      />
      <p className="text-xs text-[#86868b]">Drag to paint · right-click erases · 128×64 grid</p>
    </div>
  );
}
