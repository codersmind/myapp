"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function QuantumGrid({ opacity = 0.4 }: { opacity?: number }) {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    const mat = gridRef.current.material as THREE.Material;
    mat.opacity = opacity;
    gridRef.current.position.y = -2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[40, 60, "#00d4ff", "#0a1628"]}
      position={[0, -2, 0]}
    />
  );
}
