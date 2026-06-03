"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StudioLights } from "./StudioLights";
import { appleAluminum, appleDark } from "./materials";
import { phase } from "../hooks/useSectionProgress";

function ArmSegment({
  length,
  children,
  angle,
}: {
  length: number;
  children?: React.ReactNode;
  angle: number;
}) {
  return (
    <group rotation={[0, 0, angle]}>
      <mesh position={[length / 2, 0, 0]} castShadow>
        <boxGeometry args={[length, 0.18, 0.18]} />
        <meshStandardMaterial color="#86868b" metalness={0.85} roughness={0.2} />
      </mesh>
      <group position={[length, 0, 0]}>{children}</group>
    </group>
  );
}

export function RobotArmScene({ progress }: { progress: number }) {
  const baseRef = useRef<THREE.Group>(null);
  const gripRef = useRef<THREE.Group>(null);

  const assemble = phase(progress, 0, 0.3);
  const reach = phase(progress, 0.25, 0.55);
  const pick = phase(progress, 0.5, 0.75);
  const place = phase(progress, 0.72, 1);

  useFrame(() => {
    if (!baseRef.current || !gripRef.current) return;
    baseRef.current.rotation.y = -0.5 + reach * 0.9 + place * 0.4;
    baseRef.current.scale.setScalar(0.4 + assemble * 0.6);
    gripRef.current.rotation.z = pick * 0.6 - place * 0.4;
  });

  const j1 = reach * 0.5;
  const j2 = -0.3 - reach * 0.8 + pick * 0.5;
  const j3 = 0.4 + pick * 0.6 - place * 0.3;

  return (
    <>
      <StudioLights intensity={1} />
      <group position={[0, -1.2, 0]}>
        {/* Base platform */}
        <mesh receiveShadow>
          <cylinderGeometry args={[0.8, 0.9, 0.2, 32]} />
          <meshStandardMaterial color="#1d1d1f" metalness={0.8} roughness={0.3} />
        </mesh>

        <group ref={baseRef} position={[0, 0.15, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.35, 0.4, 0.35, 24]} />
            <meshStandardMaterial color="#d2d2d7" metalness={0.9} roughness={0.2} />
          </mesh>

          <group position={[0, 0.25, 0]} rotation={[0, j1, 0]}>
            <ArmSegment length={0.9} angle={j2}>
              <ArmSegment length={0.75} angle={j3}>
                <group ref={gripRef}>
                  <mesh castShadow material={appleDark}>
                    <boxGeometry args={[0.2, 0.12, 0.25]} />
                  </mesh>
                  <mesh position={[0.12, 0, 0.08]} material={appleAluminum}>
                    <boxGeometry args={[0.06, 0.04, 0.12]} />
                  </mesh>
                  <mesh position={[0.12, 0, -0.08]} material={appleAluminum}>
                    <boxGeometry args={[0.06, 0.04, 0.12]} />
                  </mesh>
                  {pick > 0.4 && (
                    <mesh position={[0.2, -0.15, 0]} scale={1 - place * 0.8}>
                      <boxGeometry args={[0.22, 0.22, 0.22]} />
                      <meshStandardMaterial color="#6e6e73" metalness={0.5} roughness={0.4} />
                    </mesh>
                  )}
                </group>
              </ArmSegment>
            </ArmSegment>
          </group>
        </group>

        {/* Conveyor strip */}
        <mesh position={[1.5, 0, 0.8]} receiveShadow>
          <boxGeometry args={[2.5, 0.08, 0.7]} />
          <meshStandardMaterial color="#3a3a3c" metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh position={[1.8, 0.15, 0.8]} scale={pick > 0.6 ? 1 - place : 1}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#86868b" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    </>
  );
}
