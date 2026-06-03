"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StudioLights } from "./StudioLights";
import { IndustrialRobot } from "./parts/IndustrialRobot";
import { smoothPhase } from "../hooks/useSectionProgress";

const UPPER = 1.05;
const FORE = 0.85;

function approximateEE(j1: number, j2: number, j3: number) {
  const localX = UPPER * Math.cos(j2) + FORE * Math.cos(j2 + j3);
  const localY = UPPER * Math.sin(j2) + FORE * Math.sin(j2 + j3);
  return new THREE.Vector3(
    Math.cos(j1) * localX + 0.12,
    0.2 + localY,
    Math.sin(j1) * localX
  );
}

export function RobotArmScene({ progress }: { progress: number }) {
  const robotRef = useRef<THREE.Group>(null);
  const conveyorRollers = useRef<THREE.Group>(null);
  const workpieceRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const targetRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0.35);

  const assemble = smoothPhase(progress, 0, 0.28);
  const reach = smoothPhase(progress, 0.2, 0.52);
  const pick = smoothPhase(progress, 0.46, 0.72);
  const place = smoothPhase(progress, 0.66, 1);

  const j1 = -0.65 + reach * 1.15 + place * 0.45;
  const j2 = -0.5 - reach * 0.75 + pick * 0.2 + place * 0.15;
  const j3 = 0.8 + reach * 0.55 - pick * 0.65 + place * 0.25;
  const j4 = pick * 0.45 - place * 0.15;
  const j5 = 0.15 + pick * 0.55 - place * 0.3;
  const j6 = place * 0.35;
  const gripOpen = pick > 0.58 && place < 0.42 ? 0.08 : 0.52 - reach * 0.08;
  const targetScale = 0.32 + assemble * 0.68;

  const beltStart = useMemo(() => new THREE.Vector3(2.05, 0.18, 0.6), []);
  const beltEnd = useMemo(() => new THREE.Vector3(1.15, 0.18, 0.6), []);

  useFrame((state, delta) => {
    scaleRef.current += (targetScale - scaleRef.current) * (1 - Math.exp(-9 * delta));
    if (robotRef.current) {
      robotRef.current.scale.setScalar(scaleRef.current);
    }

    const t = state.clock.elapsedTime;
    if (conveyorRollers.current) {
      conveyorRollers.current.rotation.x += delta * (0.8 + reach * 2.5 + place * 1.2);
    }

    if (workpieceRef.current) {
      const ee = approximateEE(j1, j2, j3);
      const carrying = pick > 0.45 && place < 0.38;
      if (carrying) {
        workpieceRef.current.position.copy(ee);
        workpieceRef.current.position.y += 0.06;
        workpieceRef.current.scale.setScalar(1);
      } else {
        const placeT = smoothPhase(progress, 0.66, 0.95);
        workpieceRef.current.position.lerpVectors(beltStart, beltEnd, placeT);
        workpieceRef.current.scale.setScalar(placeT > 0.02 ? 1 : 0.85 + assemble * 0.15);
      }
    }

    if (scanRef.current) {
      const scanP = smoothPhase(progress, 0.18, 0.48);
      scanRef.current.position.x = 1.4 + (1 - scanP) * 1.4;
      const mat = scanRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = scanP * (1 - scanP) * 4 * 0.35;
      scanRef.current.visible = scanP > 0.05 && scanP < 0.95;
    }

    if (targetRef.current) {
      const pulse = 0.7 + Math.sin(t * 4) * 0.3;
      targetRef.current.scale.setScalar(0.9 + reach * 0.15 * pulse);
      const mat = targetRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + reach * 0.45;
    }
  });

  return (
    <>
      <StudioLights intensity={1.15} />
      <group position={[1.35, -1.35, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 6]} />
          <meshStandardMaterial color="#e8e8ed" roughness={0.85} metalness={0.1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.8, 0.002, 0]}>
          <planeGeometry args={[0.08, 4]} />
          <meshStandardMaterial color="#ff9500" roughness={0.7} />
        </mesh>

        <group ref={robotRef}>
          <IndustrialRobot
            j1={j1}
            j2={j2}
            j3={j3}
            j4={j4}
            j5={j5}
            j6={j6}
            gripOpen={gripOpen}
            scale={1.72}
          />
        </group>

        <group position={[2.2, 0.06, 0.6]}>
          <mesh receiveShadow>
            <boxGeometry args={[3, 0.1, 0.75]} />
            <meshStandardMaterial color="#48484a" metalness={0.6} roughness={0.4} />
          </mesh>
          <group ref={conveyorRollers}>
            {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
              <mesh key={i} position={[x, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 0.78, 16]} />
                <meshStandardMaterial color="#86868b" metalness={0.85} roughness={0.2} />
              </mesh>
            ))}
          </group>

          <mesh ref={targetRef} position={[1.35, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.12, 0.18, 32]} />
            <meshBasicMaterial color="#0071e3" transparent opacity={0.4} />
          </mesh>

          <mesh ref={workpieceRef} position={beltStart}>
            <boxGeometry args={[0.28, 0.12, 0.28]} />
            <meshStandardMaterial color="#d2d2d7" metalness={0.7} roughness={0.25} />
          </mesh>
        </group>

        <mesh ref={scanRef} position={[2.8, 0.25, 0.6]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[0.02, 0.7]} />
          <meshBasicMaterial color="#0071e3" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>

        <group position={[-2.2, 0.5, -0.8]} rotation={[0, 0.35, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.6, 1.2, 0.45]} />
            <meshStandardMaterial color="#86868b" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.2, 0.24]}>
            <boxGeometry args={[0.4, 0.35, 0.02]} />
            <meshStandardMaterial
              color="#1d1d1f"
              emissive={place > 0.8 ? "#34c759" : reach > 0.3 ? "#0071e3" : "#48484a"}
              emissiveIntensity={0.15 + reach * 0.35 + place * 0.25}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}
