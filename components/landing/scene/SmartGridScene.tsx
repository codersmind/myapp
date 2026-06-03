"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StudioLights } from "./StudioLights";
import { phase } from "../hooks/useSectionProgress";

export function SmartGridScene({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const solar = phase(progress, 0, 0.3);
  const transformer = phase(progress, 0.25, 0.55);
  const grid = phase(progress, 0.5, 0.8);
  const flow = phase(progress, 0.72, 1);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    }
  });

  return (
    <>
      <StudioLights intensity={1} />
      <group ref={groupRef} position={[0, -0.5, 0]}>
        {/* Solar panel array */}
        {solar > 0.05 && (
          <group scale={solar} position={[-1.8, 0.4, 0]} rotation={[0.4, 0.3, 0]}>
            {[0, 1].map((row) =>
              [0, 1, 2].map((col) => (
                <group key={`${row}-${col}`} position={[col * 0.85, 0, row * 0.55]}>
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.75, 0.04, 0.5]} />
                    <meshStandardMaterial color="#1d1d1f" metalness={0.6} roughness={0.3} />
                  </mesh>
                  {/* Cell grid */}
                  <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.7, 0.45]} />
                    <meshStandardMaterial color="#1e3a5f" metalness={0.4} roughness={0.5} />
                  </mesh>
                  {/* Frame */}
                  <mesh position={[0, -0.02, 0]}>
                    <boxGeometry args={[0.78, 0.02, 0.52]} />
                    <meshStandardMaterial color="#86868b" metalness={0.8} roughness={0.25} />
                  </mesh>
                </group>
              ))
            )}
          </group>
        )}

        {/* Transformer substation */}
        {transformer > 0.05 && (
          <group scale={transformer} position={[0.5, 0.3, -0.5]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1, 0.8, 0.8]} />
              <meshStandardMaterial color="#86868b" metalness={0.75} roughness={0.28} />
            </mesh>
            {/* Insulators */}
            {[ -0.3, 0, 0.3 ].map((x, i) => (
              <group key={i} position={[x, 0.55, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.04, 0.06, 0.15, 8]} />
                  <meshStandardMaterial color="#48484a" metalness={0.6} roughness={0.4} />
                </mesh>
                {[0, 1, 2].map((s) => (
                  <mesh key={s} position={[0, 0.12 + s * 0.08, 0]}>
                    <cylinderGeometry args={[0.06 + s * 0.02, 0.06 + s * 0.02, 0.05, 12]} />
                    <meshStandardMaterial color="#e8e8ed" roughness={0.6} metalness={0.1} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        )}

        {/* Smart meter */}
        {grid > 0.1 && (
          <group scale={grid} position={[2, 0.5, 0.8]} rotation={[0, -0.5, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.35, 0.5, 0.12]} />
              <meshStandardMaterial color="#e8e8ed" metalness={0.5} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.05, 0.065]}>
              <planeGeometry args={[0.25, 0.2]} />
              <meshStandardMaterial
                color="#1d1d1f"
                emissive="#34c759"
                emissiveIntensity={flow * 0.15}
              />
            </mesh>
          </group>
        )}

        {/* Power lines */}
        {grid > 0.3 && (
          <>
            <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[4, 0.02, 0.02]} />
              <meshStandardMaterial color="#48484a" metalness={0.8} roughness={0.2} />
            </mesh>
            {flow > 0.1 &&
              [...Array(4)].map((_, i) => {
                const t = ((Date.now() * 0.002 + i * 0.2) % 1) * flow;
                return (
                  <mesh key={i} position={[-1.8 + t * 3.6, 1.2, 0]}>
                    <sphereGeometry args={[0.035, 8, 8]} />
                    <meshStandardMaterial color="#ff9500" emissive="#ff9500" emissiveIntensity={0.5} />
                  </mesh>
                );
              })}
          </>
        )}
      </group>
    </>
  );
}
