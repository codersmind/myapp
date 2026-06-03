"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StudioLights } from "./StudioLights";
import { phase } from "../hooks/useSectionProgress";

export function HealthcareScene({ progress }: { progress: number }) {
  const monitorRef = useRef<THREE.Group>(null);
  const reveal = phase(progress, 0, 0.25);
  const vitals = phase(progress, 0.3, 0.65);
  const wearable = phase(progress, 0.55, 0.85);

  useFrame((state) => {
    if (monitorRef.current) {
      monitorRef.current.scale.setScalar(0.5 + reveal * 0.5);
    }
  });

  return (
    <>
      <StudioLights intensity={1} />
      <group position={[0, -0.3, 0]}>
        {/* Patient monitor */}
        <group ref={monitorRef} position={[-0.5, 0.6, 0]}>
          {/* Stand pole */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 1.2, 12]} />
            <meshStandardMaterial color="#86868b" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Base wheels */}
          <mesh position={[0, -1.1, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.06, 20]} />
            <meshStandardMaterial color="#48484a" metalness={0.7} roughness={0.35} />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[1.1, 0.75, 0.08]} />
            <meshStandardMaterial color="#e8e8ed" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.2, 0.045]}>
            <planeGeometry args={[0.95, 0.6]} />
            <meshStandardMaterial color="#1d1d1f" emissive="#1d1d1f" emissiveIntensity={0.1} />
          </mesh>
          {/* ECG line */}
          {vitals > 0.2 && (
            <mesh position={[0, 0.2, 0.05]}>
              <planeGeometry args={[0.8, 0.02]} />
              <meshBasicMaterial color="#ff3b30" transparent opacity={0.5 + vitals * 0.4} />
            </mesh>
          )}
          {/* Vitals numbers area */}
          {vitals > 0.4 && (
            <>
              <mesh position={[-0.25, 0.35, 0.05]}>
                <planeGeometry args={[0.15, 0.08]} />
                <meshBasicMaterial color="#34c759" transparent opacity={0.6} />
              </mesh>
              <mesh position={[0.2, 0.35, 0.05]}>
                <planeGeometry args={[0.15, 0.08]} />
                <meshBasicMaterial color="#0071e3" transparent opacity={0.6} />
              </mesh>
            </>
          )}
        </group>

        {/* Apple Watch-style wearable */}
        {wearable > 0.05 && (
          <group position={[1.8, 0.5, 0.5]} scale={wearable} rotation={[0, -0.6, 0.3]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.28, 0.1]} />
              <meshStandardMaterial color="#1d1d1f" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
              <boxGeometry args={[0.18, 0.22, 0.02]} />
              <meshStandardMaterial
                color="#000"
                emissive="#ff3b30"
                emissiveIntensity={0.1 + vitals * 0.2}
              />
            </mesh>
            {/* Band */}
            <mesh position={[0, -0.22, 0]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.18, 0.25, 0.04]} />
              <meshStandardMaterial color="#f5f5f7" roughness={0.9} metalness={0.05} />
            </mesh>
            <mesh position={[0, 0.22, 0]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.18, 0.25, 0.04]} />
              <meshStandardMaterial color="#f5f5f7" roughness={0.9} metalness={0.05} />
            </mesh>
          </group>
        )}

        {/* IV pump */}
        {vitals > 0.5 && (
          <group position={[-2, 0.3, 0.3]} scale={vitals * 0.9}>
            <mesh castShadow>
              <boxGeometry args={[0.35, 0.55, 0.25]} />
              <meshStandardMaterial color="#e8e8ed" metalness={0.5} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.1, 0.14]}>
              <boxGeometry args={[0.2, 0.15, 0.02]} />
              <meshStandardMaterial color="#1d1d1f" />
            </mesh>
          </group>
        )}
      </group>
    </>
  );
}
