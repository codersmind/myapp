"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StudioLights } from "./StudioLights";
import { phase } from "../hooks/useSectionProgress";

export function SmartCityScene({ progress }: { progress: number }) {
  const poleRef = useRef<THREE.Group>(null);
  const dataRefs = useRef<(THREE.Mesh | null)[]>([]);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const poleReveal = phase(progress, 0, 0.2);
  const traffic = phase(progress, 0.18, 0.45);
  const sensors = phase(progress, 0.4, 0.75);
  const data = phase(progress, 0.7, 1);

  useFrame((state) => {
    if (poleRef.current) poleRef.current.scale.setScalar(0.4 + poleReveal * 0.6);
    const dataPhase = phase(progressRef.current, 0.7, 1);
    dataRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.visible = dataPhase > 0.2;
      if (dataPhase > 0.2) {
        const t = (state.clock.elapsedTime * 0.35 + i * 0.4) % 1;
        mesh.position.set(-0.5 + t * 3, 0.15 + Math.sin(t * 6) * 0.05, 0.5 + i * 0.2);
      }
    });
  });

  const lightColor =
    traffic < 0.33 ? "#ff3b30" : traffic < 0.66 ? "#ff9500" : "#34c759";

  return (
    <>
      <StudioLights intensity={0.9} />
      <group position={[0, -1, 0]}>
        {/* Road */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 4]} />
          <meshStandardMaterial color="#48484a" roughness={0.95} metalness={0.05} />
        </mesh>
        {/* Lane markings */}
        {[-1.5, 0, 1.5].map((z, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}>
            <planeGeometry args={[8, 0.08]} />
            <meshBasicMaterial color="#f5f5f7" />
          </mesh>
        ))}

        {/* Smart pole */}
        <group ref={poleRef} position={[-1.5, 0, 0]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 3, 12]} />
            <meshStandardMaterial color="#86868b" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Traffic light */}
          {traffic > 0.05 && (
            <group position={[0.25, 2.8, 0]} scale={traffic}>
              <mesh castShadow>
                <boxGeometry args={[0.22, 0.65, 0.18]} />
                <meshStandardMaterial color="#1d1d1f" metalness={0.7} roughness={0.35} />
              </mesh>
              {[
                { y: 0.2, on: traffic < 0.33 },
                { y: 0, on: traffic >= 0.33 && traffic < 0.66 },
                { y: -0.2, on: traffic >= 0.66 },
              ].map(({ y, on }, i) => (
                <mesh key={i} position={[0, y, 0.1]}>
                  <sphereGeometry args={[0.06, 12, 12]} />
                  <meshStandardMaterial
                    color={on ? lightColor : "#2d2d2f"}
                    emissive={on ? lightColor : "#000"}
                    emissiveIntensity={on ? 0.8 : 0}
                  />
                </mesh>
              ))}
            </group>
          )}

          {/* Air quality sensor box */}
          {sensors > 0.1 && (
            <mesh position={[0, 2.2, 0.12]} scale={sensors}>
              <boxGeometry args={[0.2, 0.12, 0.1]} />
              <meshStandardMaterial color="#e8e8ed" metalness={0.6} roughness={0.3} />
            </mesh>
          )}

          {/* Camera */}
          {sensors > 0.3 && (
            <group position={[0.15, 1.8, 0.1]} scale={sensors}>
              <mesh>
                <boxGeometry args={[0.15, 0.1, 0.1]} />
                <meshStandardMaterial color="#1d1d1f" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          )}

          {/* LoRa antenna */}
          {sensors > 0.5 && (
            <mesh position={[0, 3.2, 0]} scale={sensors}>
              <boxGeometry args={[0.04, 0.3, 0.04]} />
              <meshStandardMaterial color="#86868b" metalness={0.9} roughness={0.15} />
            </mesh>
          )}
        </group>

        {[...Array(5)].map((_, i) => (
          <mesh
            key={i}
            ref={(el) => {
              dataRefs.current[i] = el;
            }}
            visible={false}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#0071e3" emissive="#0071e3" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    </>
  );
}
