"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { StudioLights } from "./StudioLights";
import { phase } from "../hooks/useSectionProgress";

function NestThermostat({ position, active }: { position: [number, number, number]; active: number }) {
  return (
    <group position={position} scale={active}>
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.38, 0.1, 32]} />
        <meshStandardMaterial color="#e8e8ed" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.28, 32]} />
        <meshStandardMaterial color="#1d1d1f" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial
          color="#0071e3"
          emissive="#0071e3"
          emissiveIntensity={active * 0.15}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

function DomeCamera({ position, active }: { position: [number, number, number]; active: number }) {
  return (
    <group position={position} scale={active}>
      <mesh castShadow>
        <boxGeometry args={[0.12, 0.08, 0.12]} />
        <meshStandardMaterial color="#f5f5f7" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <sphereGeometry args={[0.14, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1d1d1f" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.1, 0.08]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={active * 0.5} />
      </mesh>
    </group>
  );
}

function SmartLock({ position, active }: { position: [number, number, number]; active: number }) {
  return (
    <group position={position} scale={active}>
      <RoundedBox args={[0.55, 1.1, 0.08]} radius={0.03} castShadow>
        <meshStandardMaterial color="#86868b" metalness={0.85} roughness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshStandardMaterial color="#1d1d1f" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0.15, 0.2, 0.06]}>
        <boxGeometry args={[0.08, 0.12, 0.02]} />
        <meshStandardMaterial
          color={active > 0.8 ? "#34c759" : "#48484a"}
          emissive="#34c759"
          emissiveIntensity={active > 0.8 ? 0.4 : 0}
        />
      </mesh>
    </group>
  );
}

const DEVICES = [
  { Component: NestThermostat, pos: [-2.2, 0.5, 0.8] as [number, number, number], delay: 0.15 },
  { Component: DomeCamera, pos: [2.1, 1.2, -0.6] as [number, number, number], delay: 0.28 },
  { Component: SmartLock, pos: [-1.8, 0.6, -1.8] as [number, number, number], delay: 0.4 },
  { Component: NestThermostat, pos: [2.4, 0.4, 1.5] as [number, number, number], delay: 0.52 },
];

export function SmartHomeScene({ progress }: { progress: number }) {
  const hubRef = useRef<THREE.Group>(null);
  const hubScale = phase(progress, 0, 0.18);
  const linkPhase = phase(progress, 0.3, 0.9);

  useFrame((state) => {
    if (hubRef.current) hubRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.06;
  });

  return (
    <>
      <StudioLights intensity={0.95} />
      {/* Apple HomePod-style hub — shifted right so it sits in the canvas column on desktop */}
      <group ref={hubRef} scale={0.45 + hubScale * 0.55} position={[0.85, 0.35, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.45, 0.5, 0.65, 32]} />
          <meshStandardMaterial color="#e8e8ed" metalness={0.75} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.33, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.02, 32]} />
          <meshStandardMaterial color="#1d1d1f" metalness={0.8} roughness={0.2} />
        </mesh>
        {[...Array(8)].map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.35, 0, Math.sin(a) * 0.35]}>
              <boxGeometry args={[0.015, 0.5, 0.015]} />
              <meshStandardMaterial color="#48484a" metalness={0.6} roughness={0.4} />
            </mesh>
          );
        })}
      </group>

      {DEVICES.map(({ Component, pos, delay }, i) => {
        const reveal = phase(progress, delay, delay + 0.12);
        const linked = phase(progress, delay + 0.08, delay + 0.22);
        const origin = new THREE.Vector3(0.85, 0.5, 0);
        const end = new THREE.Vector3(...pos);
        const mid = origin.clone().lerp(end, 0.5);
        mid.y += 0.5;
        const curve = new THREE.QuadraticBezierCurve3(origin, mid, end);
        const wirePts = curve.getPoints(Math.floor(24 * Math.min(linkPhase, linked)));

        return (
          <group key={i}>
            {wirePts.length > 1 && linked > 0.1 && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array(wirePts.flatMap((p) => [p.x, p.y, p.z])), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#86868b" transparent opacity={0.4} />
              </line>
            )}
            <Component position={pos} active={reveal} />
          </group>
        );
      })}
    </>
  );
}
