"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { StudioLights } from "./StudioLights";
import { appleAluminum, appleDark, appleGreen } from "./materials";
import { phase } from "../hooks/useSectionProgress";

export function HeroModuleScene({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const spin = phase(progress, 0, 0.5);
  const lift = phase(progress, 0.1, 0.4);
  const glow = phase(progress, 0.45, 0.75);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = spin * Math.PI * 1.2 + state.clock.elapsedTime * 0.15;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.25 + lift * 0.1, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.3 + lift * 0.6, 0.06);
  });

  return (
    <>
      <StudioLights />
      <group ref={groupRef}>
        <RoundedBox args={[2.4, 0.18, 1.6]} radius={0.04} smoothness={4} castShadow>
          <meshStandardMaterial color="#2d2d2f" metalness={0.7} roughness={0.35} />
        </RoundedBox>
        <RoundedBox args={[0.9, 0.22, 0.9]} radius={0.03} position={[0, 0.18, 0]} castShadow material={appleAluminum} />
        <mesh position={[0.8, 0.12, 0.5]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color="#34c759"
            emissive="#34c759"
            emissiveIntensity={0.2 + glow * 0.8}
          />
        </mesh>
        {[...Array(8)].map((_, i) => {
          const x = -1 + (i % 4) * 0.55;
          const z = i < 4 ? -0.55 : 0.55;
          const active = glow > i / 8;
          return (
            <mesh key={i} position={[x, 0.1, z]}>
              <boxGeometry args={[0.06, 0.04, 0.06]} />
              <meshStandardMaterial color={active ? "#86868b" : "#3a3a3c"} metalness={0.8} roughness={0.3} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}
