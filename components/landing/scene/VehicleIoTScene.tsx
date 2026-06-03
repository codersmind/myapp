"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { StudioLights } from "./StudioLights";
import { phase } from "../hooks/useSectionProgress";

const SENSOR_POINTS = [
  [0, 0.4, 1.4],
  [-0.7, 0.25, 0.6],
  [0.7, 0.25, 0.3],
  [0, 0.6, -0.8],
  [-0.5, 0.15, -0.5],
  [0.5, 0.15, -0.4],
];

export function VehicleIoTScene({ progress }: { progress: number }) {
  const carRef = useRef<THREE.Group>(null);
  const reveal = phase(progress, 0, 0.25);
  const scan = phase(progress, 0.2, 0.85);

  useFrame((state) => {
    if (carRef.current) {
      carRef.current.rotation.y = reveal * 0.4 + Math.sin(state.clock.elapsedTime * 0.25) * 0.05;
      carRef.current.scale.setScalar(0.45 + reveal * 0.55);
    }
  });

  return (
    <>
      <StudioLights intensity={1} />
      <group ref={carRef} position={[0, -0.4, 0]}>
        {/* Body */}
        <RoundedBox args={[2.8, 0.6, 1.4]} radius={0.15} position={[0, 0.3, 0]} castShadow>
          <meshStandardMaterial color="#86868b" metalness={0.88} roughness={0.18} />
        </RoundedBox>
        <RoundedBox args={[1.4, 0.45, 1.2]} radius={0.2} position={[-0.3, 0.65, 0]} castShadow>
          <meshStandardMaterial color="#1d1d1f" metalness={0.85} roughness={0.25} />
        </RoundedBox>

        {/* Wheels */}
        {[[-0.9, 0, 0.55], [-0.9, 0, -0.55], [0.9, 0, 0.55], [0.9, 0, -0.55]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 20]} />
            <meshStandardMaterial color="#1d1d1f" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}

        {/* Sensor nodes light up on scroll */}
        {SENSOR_POINTS.map((pos, i) => {
          const active = scan > i / SENSOR_POINTS.length;
          return (
            <group key={i} position={pos as [number, number, number]}>
              <mesh>
                <sphereGeometry args={[0.06, 10, 10]} />
                <meshStandardMaterial
                  color={active ? "#34c759" : "#48484a"}
                  emissive={active ? "#34c759" : "#000"}
                  emissiveIntensity={active ? 0.5 + Math.sin(Date.now() * 0.005 + i) * 0.2 : 0}
                />
              </mesh>
              {active && (
                <mesh position={[0, 0.15, 0]}>
                  <cylinderGeometry args={[0.001, 0.08, 0.3, 8]} />
                  <meshBasicMaterial color="#86868b" transparent opacity={0.25} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
    </>
  );
}
