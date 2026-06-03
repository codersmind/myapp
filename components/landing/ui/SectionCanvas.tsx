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
  const wrapClass =
    align === "right"
      ? "pointer-events-none absolute inset-y-0 right-0 left-[36%] sm:left-[38%] lg:left-[42%] [contain:strict]"
      : "pointer-events-none absolute inset-0 [contain:strict]";

  return (
    <div className={wrapClass} style={{ background: opaque ? bg : undefined }}>
      {align === "right" && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-[#f5f5f7] to-transparent sm:w-24"
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
