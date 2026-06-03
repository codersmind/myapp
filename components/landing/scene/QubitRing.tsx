"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function QubitRing({ intensity = 1 }: { intensity?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.3;
      ringRef.current.rotation.z = t * 0.2;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + intensity * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.4;
      ring2Ref.current.rotation.x = Math.PI / 3 + t * 0.15;
      const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + intensity * 0.2;
    }
  });

  return (
    <group position={[0, 2.5, -5]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[2.5, 0.02, 8, 64]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.015, 8, 64]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={intensity} />
      </mesh>
    </group>
  );
}
