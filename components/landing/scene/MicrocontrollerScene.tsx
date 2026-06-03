"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { StudioLights } from "./StudioLights";
import { MicrocontrollerBoard } from "./parts/MicrocontrollerBoard";
import { phase } from "../hooks/useSectionProgress";

export function MicrocontrollerScene({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const reveal = phase(progress, 0, 0.2);
  const flash = phase(progress, 0.25, 0.55);
  const wire = phase(progress, 0.5, 0.85);
  const sensorLink = phase(progress, 0.75, 1);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = 0.4 + Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    groupRef.current.scale.setScalar(0.5 + reveal * 0.5);
  });

  return (
    <>
      <StudioLights intensity={1.05} />
      <group ref={groupRef} position={[0, -0.2, 0]}>
        <MicrocontrollerBoard flashProgress={flash} wireProgress={wire} />

        {/* Breadboard */}
        {wire > 0.2 && (
          <group position={[2.5, -0.05, 0.3]} scale={wire}>
            <mesh receiveShadow>
              <boxGeometry args={[1.8, 0.05, 0.9]} />
              <meshStandardMaterial color="#fafafa" roughness={0.9} metalness={0.05} />
            </mesh>
            {[...Array(12)].map((_, i) => (
              <mesh key={i} position={[-0.7 + (i % 6) * 0.28, 0.04, -0.25 + Math.floor(i / 6) * 0.5]}>
                <boxGeometry args={[0.02, 0.02, 0.02]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        )}

        {/* DHT22 sensor module */}
        {sensorLink > 0.1 && (
          <group position={[2.8, 0.05, 0.5]} scale={sensorLink}>
            <mesh castShadow>
              <boxGeometry args={[0.35, 0.12, 0.25]} />
              <meshStandardMaterial color="#2d2d2f" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.08, 0.08, 0.06]} />
              <meshStandardMaterial color="#1d4ed8" metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0.1, 0.1, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.06, 10]} />
              <meshStandardMaterial color="#86868b" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* Oscilloscope readout panel */}
        {flash > 0.4 && (
          <RoundedBox args={[0.9, 0.5, 0.06]} radius={0.02} position={[-2, 0.4, 0.8]} rotation={[0, 0.5, 0]}>
            <meshStandardMaterial color="#1d1d1f" metalness={0.7} roughness={0.3} />
          </RoundedBox>
        )}
      </group>
    </>
  );
}
