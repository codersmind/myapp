"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

const PIN_COUNT = 12;

export function Microcontroller({ reveal = 0, execute = 0 }: { reveal?: number; execute?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const pinLights = useMemo(() => Array.from({ length: PIN_COUNT }, (_, i) => i), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.visible = reveal > 0.01;
    groupRef.current.scale.setScalar(0.3 + reveal * 0.7);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.sin(state.clock.elapsedTime * 0.4) * 0.15,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, reveal * 0.5, 0.08);
  });

  if (reveal < 0.01) return null;

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* PCB board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.12, 2.4]} />
        <meshStandardMaterial color="#0d3320" metalness={0.6} roughness={0.35} emissive="#003320" emissiveIntensity={0.3 * reveal} />
      </mesh>

      {/* Chip */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[1.1, 0.2, 1.1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} emissive="#0066ff" emissiveIntensity={0.15 + execute * 0.6} />
      </mesh>

      <Text position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.18} color="#00ffaa" anchorX="center" anchorY="middle">
        ATOM-X
      </Text>

      {/* Circuit traces */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.07, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.01, 1.6]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.3 + execute * 0.5} />
        </mesh>
      ))}

      {/* Pins */}
      {pinLights.map((i) => {
        const side = i < 6 ? -1 : 1;
        const idx = i < 6 ? i : i - 6;
        const pinActive = execute > idx / PIN_COUNT;
        return (
          <group key={i} position={[side * 1.7, 0.08, -1 + idx * 0.4]}>
            <mesh>
              <boxGeometry args={[0.08, 0.06, 0.06]} />
              <meshStandardMaterial
                color={pinActive ? "#ffd700" : "#888"}
                emissive={pinActive ? "#ffaa00" : "#000"}
                emissiveIntensity={pinActive ? 0.8 + Math.sin(Date.now() * 0.01 + i) * 0.3 : 0}
              />
            </mesh>
          </group>
        );
      })}

      {/* Status LED */}
      <mesh position={[1.2, 0.2, 0.8]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.5 + execute * 1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}
