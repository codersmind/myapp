"use client";

import { memo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";

interface SectionCanvasProps {
  children: React.ReactNode;
  bg?: string;
  camera?: [number, number, number];
  fov?: number;
}

function SectionCanvasInner({
  children,
  bg = "#f5f5f7",
  camera = [0, 1.2, 5],
  fov = 42,
}: SectionCanvasProps) {
  return (
    <div className="pointer-events-none absolute inset-0 [contain:strict]">
      <Canvas
        camera={{ position: camera, fov }}
        dpr={[1, 1.25]}
        frameloop="always"
        flat
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={[bg]} />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}

export const SectionCanvas = memo(SectionCanvasInner);
