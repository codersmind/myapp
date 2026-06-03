"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { StudioLights } from "./StudioLights";
import { appleDark, appleGlass } from "./materials";
import { phase } from "../hooks/useSectionProgress";

export function EdgeMLScene({ progress }: { progress: number }) {
  const rackRef = useRef<THREE.Group>(null);
  const build = phase(progress, 0, 0.35);
  const infer = phase(progress, 0.4, 0.75);
  const stream = phase(progress, 0.6, 1);

  useFrame((state) => {
    if (rackRef.current) {
      rackRef.current.scale.setScalar(0.5 + build * 0.5);
    }
  });

  return (
    <>
      <StudioLights intensity={0.95} />
      <group ref={rackRef} position={[0, -0.5, 0]}>
        {[ -0.6, 0, 0.6 ].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <RoundedBox args={[0.5, 1.8, 0.7]} radius={0.03} material={appleDark} castShadow />
            <RoundedBox args={[0.42, 0.42, 0.05]} radius={0.02} position={[0, 0.5 - i * 0.1, 0.36]} material={appleGlass} />
            {[0, 1, 2].map((r) => (
              <mesh key={r} position={[0, 0.5 - r * 0.5, 0.38]}>
                <planeGeometry args={[0.35, 0.06]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={infer > r * 0.25 ? 0.15 + stream * 0.25 : 0.05}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Data stream lines */}
        {stream > 0.1 &&
          [...Array(6)].map((_, i) => {
            const t = (Date.now() * 0.002 + i * 0.15) % 1;
            return (
              <mesh key={i} position={[-1.2 + t * 2.4, 1.2 + Math.sin(t * Math.PI) * 0.3, 0]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="#86868b" emissive="#ffffff" emissiveIntensity={0.4} />
              </mesh>
            );
          })}
      </group>
    </>
  );
}
