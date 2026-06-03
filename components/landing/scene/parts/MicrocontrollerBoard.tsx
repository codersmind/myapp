"use client";

import * as THREE from "three";
import { Text } from "@react-three/drei";

interface MicrocontrollerBoardProps {
  scale?: number;
  rotation?: [number, number, number];
  flashProgress?: number;
  wireProgress?: number;
  label?: string;
}

export function MicrocontrollerBoard({
  scale = 1,
  rotation = [-0.55, 0.35, 0],
  flashProgress = 0,
  wireProgress = 0,
  label = "ESP32-WROOM",
}: MicrocontrollerBoardProps) {
  const pinCount = 15;
  const ledOn = flashProgress > 0.3;

  return (
    <group scale={scale} rotation={rotation}>
      {/* PCB substrate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.06, 1.3]} />
        <meshStandardMaterial color="#1b7a4e" metalness={0.1} roughness={0.82} />
      </mesh>

      {/* Gold edge traces */}
      {[-1.2, 0, 1.2].map((z, i) => (
        <mesh key={i} position={[0, 0.04, z]}>
          <boxGeometry args={[2.5, 0.008, 0.025]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}

      {/* Main MCU chip */}
      <mesh position={[0.15, 0.1, 0]} castShadow>
        <boxGeometry args={[0.55, 0.12, 0.55]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.7}
          roughness={0.25}
          emissive="#ffffff"
          emissiveIntensity={flashProgress * 0.08}
        />
      </mesh>
      <Text
        position={[0.15, 0.17, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.07}
        color="#48484a"
        anchorX="center"
        anchorY="middle"
      >
        ESP32
      </Text>

      {/* WiFi antenna area */}
      <mesh position={[-0.85, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.35]} />
        <meshStandardMaterial color="#c9a227" metalness={0.85} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Crystal */}
      <mesh position={[-0.35, 0.09, 0.35]}>
        <boxGeometry args={[0.12, 0.08, 0.06]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Capacitors */}
      {[[-0.5, -0.25], [0.55, -0.3], [0.55, 0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.1, z]}>
          <cylinderGeometry args={[0.04, 0.04, 0.14, 12]} />
          <meshStandardMaterial color={i === 0 ? "#1d1d1f" : "#1e40af"} metalness={0.4} roughness={0.45} />
        </mesh>
      ))}

      {/* USB-C port */}
      <group position={[-1.25, 0.06, 0]}>
        <mesh>
          <boxGeometry args={[0.14, 0.08, 0.22]} />
          <meshStandardMaterial color="#2d2d2f" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.04, 0.12]} />
          <meshStandardMaterial color="#1d1d1f" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Reset button */}
      <mesh position={[0.85, 0.09, -0.42]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <meshStandardMaterial color="#48484a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Power LED */}
      <mesh position={[-0.95, 0.09, 0.42]}>
        <cylinderGeometry args={[0.035, 0.035, 0.03, 12]} />
        <meshStandardMaterial
          color={ledOn ? "#ff3b30" : "#5c1a1a"}
          emissive="#ff3b30"
          emissiveIntensity={ledOn ? 0.6 + Math.sin(Date.now() * 0.008) * 0.3 : 0}
        />
      </mesh>

      {/* Pin headers — left & right */}
      {[-1, 1].map((side) =>
        Array.from({ length: pinCount }, (_, i) => {
          const z = -0.6 + (i / (pinCount - 1)) * 1.2;
          const pinActive = wireProgress > i / pinCount;
          return (
            <group key={`${side}-${i}`} position={[side * 1.38, 0.12, z]}>
              <mesh>
                <boxGeometry args={[0.12, 0.14, 0.04]} />
                <meshStandardMaterial color="#1d1d1f" metalness={0.5} roughness={0.5} />
              </mesh>
              {[0, 1].map((row) => (
                <mesh key={row} position={[0, 0.02 + row * 0.06, 0]}>
                  <boxGeometry args={[0.025, 0.025, 0.025]} />
                  <meshStandardMaterial
                    color={pinActive ? "#d4af37" : "#8b7355"}
                    metalness={0.95}
                    roughness={0.15}
                    emissive={pinActive ? "#d4af37" : "#000"}
                    emissiveIntensity={pinActive ? 0.15 : 0}
                  />
                </mesh>
              ))}
            </group>
          );
        })
      )}

      {/* Mounting holes */}
      {[[-1.1, -0.45], [-1.1, 0.45], [1.1, -0.45], [1.1, 0.45]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.04, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.06, 16]} />
          <meshStandardMaterial color="#0d4d32" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}

      {/* Wire from pin when wireProgress */}
      {wireProgress > 0.05 && (
        <group>
          {[0, 1, 2].map((i) => {
            const t = Math.min(1, wireProgress * 1.2 - i * 0.15);
            if (t <= 0) return null;
            const start = new THREE.Vector3(1.38, 0.15, -0.4 + i * 0.4);
            const end = new THREE.Vector3(2.2, 0.3 + i * 0.15, 0.5 + i * 0.3);
            const mid = start.clone().lerp(end, 0.5);
            mid.y += 0.4;
            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const pts = curve.getPoints(Math.floor(20 * t));
            if (pts.length < 2) return null;
            return (
              <line key={i}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#86868b" linewidth={1} />
              </line>
            );
          })}
        </group>
      )}
    </group>
  );
}
