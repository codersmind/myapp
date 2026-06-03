"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StudioLights } from "./StudioLights";
import { MicrocontrollerBoard } from "./parts/MicrocontrollerBoard";
import { phase } from "../hooks/useSectionProgress";

export function HeroModuleScene({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const reveal = phase(progress, 0, 0.35);
  const flash = phase(progress, 0.35, 0.7);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = reveal * 0.8 + state.clock.elapsedTime * 0.12;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.4 + reveal * 0.5, 0.06);
  });

  return (
    <>
      <StudioLights intensity={1} />
      <group ref={groupRef} scale={0.85 + reveal * 0.15}>
        <MicrocontrollerBoard
          rotation={[-0.5, 0.45, 0]}
          flashProgress={flash}
          wireProgress={0}
          label="ESP32-WROOM"
        />
      </group>
    </>
  );
}
