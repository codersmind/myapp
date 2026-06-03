"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StudioLights } from "./StudioLights";
import { IndustrialRobot } from "./parts/IndustrialRobot";
import { phase } from "../hooks/useSectionProgress";

export function RobotArmScene({ progress }: { progress: number }) {
  const robotRef = useRef<THREE.Group>(null);

  const assemble = phase(progress, 0, 0.25);
  const reach = phase(progress, 0.22, 0.52);
  const pick = phase(progress, 0.48, 0.72);
  const place = phase(progress, 0.68, 1);

  const j1 = -0.6 + reach * 1.1 + place * 0.3;
  const j2 = -0.55 - reach * 0.65 + pick * 0.35;
  const j3 = 0.85 + reach * 0.4 - pick * 0.5 + place * 0.2;
  const j5 = 0.2 + pick * 0.45 - place * 0.25;
  const gripOpen = pick > 0.55 && place < 0.5 ? 0.1 : 0.55;

  useFrame(() => {
    if (robotRef.current) {
      robotRef.current.scale.setScalar(0.35 + assemble * 0.65);
    }
  });

  return (
    <>
      <StudioLights intensity={1.1} />
      <group position={[0, -1.35, 0]}>
        {/* Factory floor plate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 6]} />
          <meshStandardMaterial color="#e8e8ed" roughness={0.85} metalness={0.1} />
        </mesh>
        {/* Safety line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.8, 0.002, 0]}>
          <planeGeometry args={[0.08, 4]} />
          <meshStandardMaterial color="#ff9500" roughness={0.7} />
        </mesh>

        <group ref={robotRef}>
          <IndustrialRobot
            j1={j1}
            j2={j2}
            j3={j3}
            j4={pick * 0.3}
            j5={j5}
            j6={place * 0.2}
            gripOpen={gripOpen}
            scale={1.15}
          />
        </group>

        {/* Conveyor with realistic rollers */}
        <group position={[2.2, 0.06, 0.6]}>
          <mesh receiveShadow>
            <boxGeometry args={[3, 0.1, 0.75]} />
            <meshStandardMaterial color="#48484a" metalness={0.6} roughness={0.4} />
          </mesh>
          {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
            <mesh key={i} position={[x, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.78, 16]} />
              <meshStandardMaterial color="#86868b" metalness={0.85} roughness={0.2} />
            </mesh>
          ))}
          {/* Workpiece */}
          <mesh
            position={[1.3 - place * 0.8, 0.18, 0]}
            scale={pick > 0.5 && place < 0.4 ? 0.01 : 1}
          >
            <boxGeometry args={[0.28, 0.12, 0.28]} />
            <meshStandardMaterial color="#d2d2d7" metalness={0.7} roughness={0.25} />
          </mesh>
        </group>

        {/* Control cabinet */}
        <group position={[-2.2, 0.5, -0.8]} rotation={[0, 0.35, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.6, 1.2, 0.45]} />
            <meshStandardMaterial color="#86868b" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.2, 0.24]}>
            <boxGeometry args={[0.4, 0.35, 0.02]} />
            <meshStandardMaterial
              color="#1d1d1f"
              emissive="#34c759"
              emissiveIntensity={0.1 + reach * 0.2}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}
