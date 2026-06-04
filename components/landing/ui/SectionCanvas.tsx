"use client";

import { memo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";

interface SectionCanvasProps {
  children: React.ReactNode;
  bg?: string;
  camera?: [number, number, number];
  fov?: number;
  /** Opaque WebGL surface — avoids white page bleeding through on light sections */
  opaque?: boolean;
  /** Keep WebGL on the right so left copy stays readable */
  align?: "full" | "right";
}

function SectionCanvasInner({
  children,
  bg = "#f5f5f7",
  camera = [0, 1.2, 5],
  fov = 42,
  opaque = false,
  align = "full",
}: SectionCanvasProps) {
  const mobileBand =
    "relative z-0 shrink-0 [contain:strict] " +
    "h-[min(38vh,300px)] min-h-[200px] sm:h-[min(40vh,340px)] sm:min-h-[240px] md:min-h-[280px] lg:h-auto lg:min-h-0 lg:z-0";

  const wrapClass =
    align === "right"
      ? `${mobileBand} pointer-events-none lg:absolute lg:inset-y-0 lg:right-0 lg:left-[36%] xl:left-[40%] 2xl:left-[42%]`
      : `${mobileBand} pointer-events-none lg:absolute lg:inset-0`;

  return (
    <div className={wrapClass} style={{ background: opaque ? bg : undefined }}>
      {align === "right" && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-12 bg-gradient-to-r from-[var(--canvas-fade,#f5f5f7)] to-transparent sm:w-16 md:block lg:w-24"
          style={{ ["--canvas-fade" as string]: bg }}
          aria-hidden
        />
      )}
      <Canvas
        camera={{ position: camera, fov }}
        dpr={[1, 1.25]}
        frameloop="always"
        flat
        gl={{
          antialias: false,
          alpha: !opaque,
          powerPreference: "high-performance",
          stencil: false,
        }}
        style={{ background: opaque ? bg : "transparent" }}
      >
        <color attach="background" args={[bg]} />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}

export const SectionCanvas = memo(SectionCanvasInner);
