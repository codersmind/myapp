"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { StudioLights } from "./StudioLights";
import { phase } from "../hooks/useSectionProgress";

const SENSORS = [
  { pos: [0, 0.55, 1.1] as [number, number, number], delay: 0.2 },
  { pos: [-0.9, 0.3, 0.4] as [number, number, number], delay: 0.32 },
  { pos: [0.9, 0.35, 0.2] as [number, number, number], delay: 0.44 },
  { pos: [0, 0.15, -1] as [number, number, number], delay: 0.56 },
  { pos: [-0.6, 0.5, -0.5] as [number, number, number], delay: 0.68 },
];

export function AgricultureScene({ progress }: { progress: number }) {
  const fieldRef = useRef<THREE.Group>(null);
  const grow = phase(progress, 0, 0.35);
  const deploy = phase(progress, 0.3, 0.8);

  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <>
      <StudioLights intensity={0.85} />
      <group ref={fieldRef} position={[0, -0.6, 0]}>
        {/* Soil bed */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[5, 3]} />
          <meshStandardMaterial color="#3a3a3c" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Crop rows */}
        {[-1, 0, 1].map((row, i) =>
          [...Array(5)].map((_, j) => {
            const h = grow * (0.3 + ((i + j) % 3) * 0.15);
            return (
              <mesh key={`${i}-${j}`} position={[-1.6 + j * 0.8, h / 2, row * 0.7]}>
                <cylinderGeometry args={[0.02, 0.025, h, 6]} />
                <meshStandardMaterial color="#48484a" roughness={0.8} />
              </mesh>
            );
          })
        )}

        {/* IoT sensor stakes */}
        {SENSORS.map((s, i) => {
          const active = phase(progress, s.delay, s.delay + 0.15);
          if (active < 0.05) return null;
          return (
            <group key={i} position={s.pos} scale={active}>
              <mesh castShadow>
                <cylinderGeometry args={[0.03, 0.04, 0.5, 8]} />
                <meshStandardMaterial color="#86868b" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.32, 0]}>
                <boxGeometry args={[0.12, 0.08, 0.06]} />
                <meshStandardMaterial
                  color="#e8e8ed"
                  emissive="#34c759"
                  emissiveIntensity={deploy * 0.3}
                  metalness={0.6}
                  roughness={0.3}
                />
              </mesh>
            </group>
          );
        })}

        {/* Weather station hub */}
        {deploy > 0.3 && (
          <group position={[2, 0.3, -0.8]} scale={deploy}>
            <RoundedBox args={[0.35, 0.6, 0.35]} radius={0.04}>
              <meshStandardMaterial color="#1d1d1f" metalness={0.8} roughness={0.3} />
            </RoundedBox>
          </group>
        )}
      </group>
    </>
  );
}
