"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { StudioLights } from "./StudioLights";
import { appleAluminum, appleDark, appleGlass } from "./materials";
import { phase } from "../hooks/useSectionProgress";

const DEVICES = [
  { pos: [-2.2, 0.4, 0.8] as [number, number, number], label: "Thermostat", delay: 0.15 },
  { pos: [2.1, 0.2, -0.6] as [number, number, number], label: "Camera", delay: 0.28 },
  { pos: [-1.5, 0.6, -1.8] as [number, number, number], label: "Lock", delay: 0.38 },
  { pos: [2.4, 0.5, 1.5] as [number, number, number], label: "Sensor", delay: 0.48 },
  { pos: [0.2, 0.3, 2.3] as [number, number, number], label: "Light", delay: 0.58 },
];

export function SmartHomeScene({ progress }: { progress: number }) {
  const hubRef = useRef<THREE.Group>(null);
  const hubScale = phase(progress, 0, 0.2);
  const linkPhase = phase(progress, 0.25, 0.85);

  useFrame((state) => {
    if (hubRef.current) {
      hubRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <>
      <StudioLights intensity={0.95} />
      <group ref={hubRef} scale={0.4 + hubScale * 0.6}>
        <RoundedBox args={[1, 1, 0.35]} radius={0.12} material={appleDark} castShadow />
        <RoundedBox args={[0.85, 0.85, 0.05]} radius={0.1} position={[0, 0, 0.2]} material={appleGlass} />
      </group>

      {DEVICES.map((device, i) => {
        const reveal = phase(progress, device.delay, device.delay + 0.12);
        const linked = phase(progress, device.delay + 0.1, device.delay + 0.25);
        if (reveal < 0.01) return null;

        const origin = new THREE.Vector3(0, 0.2, 0);
        const end = new THREE.Vector3(...device.pos);
        const mid = origin.clone().lerp(end, 0.5);
        mid.y += 0.6;
        const curve = new THREE.QuadraticBezierCurve3(origin, mid, end);
        const wireLen = curve.getPoints(Math.floor(24 * Math.min(linkPhase, linked)));

        return (
          <group key={i} scale={reveal}>
            {wireLen.length > 1 && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array(wireLen.flatMap((p) => [p.x, p.y, p.z])), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#86868b" transparent opacity={0.35 + linked * 0.35} />
              </line>
            )}
            <mesh position={device.pos} castShadow>
              <boxGeometry args={[0.45, 0.45, 0.12]} />
              <meshStandardMaterial
                color="#e8e8ed"
                metalness={0.75}
                roughness={0.25}
                emissive="#ffffff"
                emissiveIntensity={linked * 0.08}
              />
            </mesh>
            {linked > 0.5 && (
              <mesh position={[device.pos[0], device.pos[1] + 0.3, device.pos[2]]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="#34c759" emissive="#34c759" emissiveIntensity={0.4} />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}
