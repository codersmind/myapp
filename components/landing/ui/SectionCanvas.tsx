"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

interface SectionCanvasProps {
  children: React.ReactNode;
  bg?: string;
  camera?: [number, number, number];
  fov?: number;
}

export function SectionCanvas({
  children,
  bg = "#f5f5f7",
  camera = [0, 1.2, 5],
  fov = 42,
}: SectionCanvasProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        camera={{ position: camera, fov }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={[bg]} />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
