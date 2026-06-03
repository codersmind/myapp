"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODES = [
  { pos: [2.8, 0, -1.2] as [number, number, number], label: "SENSOR" },
  { pos: [-2.8, 0.3, 0.8] as [number, number, number], label: "ACTUATOR" },
  { pos: [1.5, 0.5, 2.5] as [number, number, number], label: "GATEWAY" },
];

export function WiringSystem({ progress = 0, signal = 0 }: { progress?: number; signal?: number }) {
  const pulsesRef = useRef<THREE.Mesh[]>([]);

  const wires = useMemo(() => {
    const origin = new THREE.Vector3(1.7, 0, 0);
    return NODES.map((node) => {
      const end = new THREE.Vector3(...node.pos);
      const mid = origin.clone().lerp(end, 0.5);
      mid.y += 0.8;
      const curve = new THREE.QuadraticBezierCurve3(origin, mid, end);
      return { curve, node, points: curve.getPoints(32) };
    });
  }, []);

  useFrame((state) => {
    pulsesRef.current.forEach((pulse, i) => {
      if (!pulse || progress < 0.3) {
        pulse.visible = false;
        return;
      }
      pulse.visible = signal > 0.1;
      const t = ((state.clock.elapsedTime * 0.5 + i * 0.33) % 1) * signal;
      const wire = wires[i];
      if (!wire) return;
      const pt = wire.curve.getPoint(Math.min(t, progress));
      pulse.position.copy(pt);
      const scale = 0.06 + signal * 0.04;
      pulse.scale.setScalar(scale);
    });
  });

  if (progress < 0.05) return null;

  return (
    <group>
      {wires.map((wire, i) => {
        const wireProgress = Math.min(1, Math.max(0, (progress - i * 0.15) / 0.7));
        const visiblePoints = wire.points.slice(0, Math.floor(wire.points.length * wireProgress));
        if (visiblePoints.length < 2) return null;

        return (
          <group key={i}>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array(visiblePoints.flatMap((p) => [p.x, p.y, p.z])), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#00e5ff" transparent opacity={0.5 + signal * 0.4} linewidth={2} />
            </line>

            {/* Node at end */}
            {wireProgress > 0.85 && (
              <mesh position={wire.node.pos}>
                <boxGeometry args={[0.5, 0.35, 0.5]} />
                <meshStandardMaterial
                  color="#111827"
                  emissive="#00bcd4"
                  emissiveIntensity={0.2 + signal * 0.5}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
            )}

            {/* Signal pulse */}
            <mesh
              ref={(el) => {
                if (el) pulsesRef.current[i] = el;
              }}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
