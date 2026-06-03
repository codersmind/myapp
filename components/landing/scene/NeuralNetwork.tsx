"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LAYERS = [4, 6, 6, 3];

export function NeuralNetwork({ reveal = 0, activity = 0 }: { reveal?: number; activity?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const { nodes, edges } = useMemo(() => {
    const nodeList: THREE.Vector3[] = [];
    const edgeList: [number, number][] = [];
    let nodeIdx = 0;
    const layerNodes: number[][] = [];

    LAYERS.forEach((count, layer) => {
      const layerIndices: number[] = [];
      for (let i = 0; i < count; i++) {
        const x = (layer - 1.5) * 2.2;
        const y = (i - (count - 1) / 2) * 0.9 + 1.5;
        nodeList.push(new THREE.Vector3(x, y, -3));
        layerIndices.push(nodeIdx++);
      }
      layerNodes.push(layerIndices);
    });

    for (let l = 0; l < layerNodes.length - 1; l++) {
      for (const a of layerNodes[l]) {
        for (const b of layerNodes[l + 1]) {
          edgeList.push([a, b]);
        }
      }
    }

    return { nodes: nodeList, edges: edgeList };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.visible = reveal > 0.05;
    groupRef.current.scale.setScalar(reveal);
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  if (reveal < 0.05) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {edges.map(([a, b], i) => {
        const start = nodes[a];
        const end = nodes[b];
        const points = [start, end];
        const pulse = activity * (0.3 + Math.sin(Date.now() * 0.003 + i) * 0.2);
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#a855f7" transparent opacity={0.15 + pulse} />
          </line>
        );
      })}

      {nodes.map((pos, i) => {
        const pulse = activity * (0.5 + Math.sin(Date.now() * 0.005 + i * 0.7) * 0.5);
        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.12 + pulse * 0.06, 12, 12]} />
            <meshStandardMaterial
              color="#c084fc"
              emissive="#9333ea"
              emissiveIntensity={0.3 + pulse}
              transparent
              opacity={0.7 + reveal * 0.3}
            />
          </mesh>
        );
      })}

      {/* AI Agent core */}
      <mesh position={[0, 1.5, -2.5]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#e879f9"
          emissive="#d946ef"
          emissiveIntensity={0.5 + activity}
          wireframe
        />
      </mesh>
    </group>
  );
}
