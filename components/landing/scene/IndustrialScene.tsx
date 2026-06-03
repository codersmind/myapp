"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { StudioLights } from "./StudioLights";
import { appleAluminum, appleDark } from "./materials";
import { phase } from "../hooks/useSectionProgress";

export function IndustrialScene({ progress }: { progress: number }) {
  const conveyorRef = useRef<THREE.Group>(null);
  const beltRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const lineReveal = phase(progress, 0, 0.25);
  const tankReveal = phase(progress, 0.2, 0.45);
  const plcReveal = phase(progress, 0.35, 0.55);
  const pipeReveal = phase(progress, 0.5, 0.72);
  const dataFlow = phase(progress, 0.7, 1);

  useFrame((state) => {
    const flow = phase(progressRef.current, 0.7, 1);
    if (beltRef.current && lineReveal > 0.5) {
      beltRef.current.position.x = ((state.clock.elapsedTime * 0.8) % 2) - 1;
    }
    if (conveyorRef.current) {
      conveyorRef.current.visible = lineReveal > 0.05;
      conveyorRef.current.scale.setScalar(0.5 + lineReveal * 0.5);
    }
    if (pulseRef.current) {
      pulseRef.current.visible = flow > 0.1;
      if (flow > 0.1) {
        pulseRef.current.position.x = Math.sin(state.clock.elapsedTime * 3) * 2;
      }
    }
  });

  return (
    <>
      <StudioLights intensity={0.9} />
      <group position={[0, -0.8, 0]}>
        {/* Conveyor line */}
        <group ref={conveyorRef}>
          <mesh position={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[5, 0.15, 1.2]} />
            <meshStandardMaterial color="#3a3a3c" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh ref={beltRef} position={[0, 0.1, 0]}>
            <boxGeometry args={[0.5, 0.08, 0.6]} />
            <meshStandardMaterial color="#86868b" metalness={0.5} roughness={0.35} />
          </mesh>
          {[ -1.8, -0.6, 0.6, 1.8 ].map((x, i) => (
            <mesh key={i} position={[x, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
              <meshStandardMaterial color="#6e6e73" metalness={0.8} roughness={0.25} />
            </mesh>
          ))}
        </group>

        {/* Storage tanks */}
        {tankReveal > 0.05 && (
          <group scale={tankReveal} position={[-2.5, 0.8, -1.5]}>
            {[0, 1.2].map((x, i) => (
              <group key={i} position={[x, 0, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.45, 0.5, 1.6, 24]} />
                  <meshStandardMaterial color="#d2d2d7" metalness={0.85} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.85, 0]}>
                  <sphereGeometry args={[0.12, 12, 12]} />
                  <meshStandardMaterial
                    color="#ff9500"
                    emissive="#ff9500"
                    emissiveIntensity={0.15 + dataFlow * 0.3}
                  />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* PLC control panel */}
        {plcReveal > 0.05 && (
          <group scale={plcReveal} position={[2.2, 0.6, -1.2]} rotation={[0, -0.4, 0]}>
            <RoundedBox args={[1.2, 1.6, 0.25]} radius={0.04} material={appleDark} castShadow />
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} position={[-0.3 + (i % 2) * 0.6, 0.4 - Math.floor(i / 2) * 0.5, 0.14]}>
                <boxGeometry args={[0.15, 0.08, 0.02]} />
                <meshStandardMaterial
                  color={dataFlow > i * 0.2 ? "#34c759" : "#48484a"}
                  emissive={dataFlow > i * 0.2 ? "#34c759" : "#000"}
                  emissiveIntensity={dataFlow > i * 0.2 ? 0.5 : 0}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* Pipes */}
        {pipeReveal > 0.05 && (
          <group scale={pipeReveal}>
            <mesh position={[0, 1.2, -0.8]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 4, 12]} />
              <meshStandardMaterial color="#86868b" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[-2, 1.5, -0.8]}>
              <cylinderGeometry args={[0.06, 0.06, 1.2, 12]} />
              <meshStandardMaterial color="#86868b" metalness={0.9} roughness={0.15} />
            </mesh>
          </group>
        )}

        <mesh ref={pulseRef} position={[0, 0.25, 0]} visible={false}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </>
  );
}
