"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { phase } from "../hooks/useSectionProgress";

const BG = "#f5f5f7";
const APPLE_BLUE = "#0071e3";
const SKY = "#5ac8fa";
const PARTICLE_COUNT = 420;

function QuantumParticles() {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const blue = new THREE.Color(APPLE_BLUE);
    const sky = new THREE.Color(SKY);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 1.8 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const c = Math.random() > 0.45 ? blue : sky;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.035;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ProcessorWires({ boot }: { boot: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const segments = useMemo(() => {
    const out: { from: THREE.Vector3; to: THREE.Vector3 }[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      out.push({
        from: new THREE.Vector3(Math.cos(angle) * 0.55, 0.08, Math.sin(angle) * 0.55),
        to: new THREE.Vector3(Math.cos(angle) * 1.1, 0.06 + (i % 3) * 0.02, Math.sin(angle) * 1.1),
      });
    }
    return out;
  }, []);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    <group ref={groupRef}>
      {segments.map((seg, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  seg.from.x, seg.from.y, seg.from.z,
                  seg.to.x, seg.to.y, seg.to.z,
                ]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={APPLE_BLUE} transparent opacity={0.15 + boot * 0.45} />
        </line>
      ))}
    </group>
  );
}

function QubitCore({ boot }: { boot: number }) {
  const coreRef = useRef<THREE.Group>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const ringColors = ["#0071e3", "#5ac8fa", "#64d2ff", "#2997ff"];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.32;
      const pulse = 1 + Math.sin(t * 1.2) * 0.03;
      const s = (0.95 + boot * 0.25) * pulse;
      coreRef.current.scale.setScalar(s);
    }
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.x = t * (0.22 + i * 0.07);
      ring.rotation.z = t * (0.16 + i * 0.05);
      const mat = ring.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + boot * 0.45;
    });
  });

  return (
    <group ref={coreRef} position={[0, -0.05, 0]}>
      <mesh>
        <cylinderGeometry args={[2, 2.2, 0.5, 32, 1, true]} />
        <meshBasicMaterial color="#c7c7cc" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      <mesh>
        <boxGeometry args={[1.35, 0.14, 1.35]} />
        <meshStandardMaterial
          color="#d1d1d6"
          metalness={0.9}
          roughness={0.2}
          emissive={APPLE_BLUE}
          emissiveIntensity={0.12 + boot * 0.4}
        />
      </mesh>

      <mesh position={[0, 0.38, 0]}>
        <octahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial
          color={APPLE_BLUE}
          emissive={APPLE_BLUE}
          emissiveIntensity={0.35 + boot * 0.65}
          wireframe
        />
      </mesh>

      {[1.55, 1.95, 2.35, 2.75].map((radius, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) ringRefs.current[i] = el;
          }}
          rotation={[Math.PI / 2 + i * 0.18, 0, i * 0.35]}
        >
          <torusGeometry args={[radius, 0.022, 10, 96]} />
          <meshBasicMaterial color={ringColors[i]} transparent opacity={0.45} />
        </mesh>
      ))}

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        const r = 1.95;
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0.2 + Math.sin(i) * 0.06, Math.sin(a) * r]}>
            <sphereGeometry args={[0.07, 14, 14]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={i % 2 === 0 ? APPLE_BLUE : SKY}
              emissiveIntensity={0.35 + boot * 0.65}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function EntanglementLines({ boot }: { boot: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const lines = useMemo(() => {
    const pts: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < 8; i++) {
      const a = new THREE.Vector3(Math.cos(i) * 1.5, 0.35, Math.sin(i) * 1.5);
      const b = new THREE.Vector3(Math.cos(i + 2.2) * 2.1, 0.55, Math.sin(i + 2.2) * 2.1);
      pts.push([a, b]);
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      {lines.map(([a, b], i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={APPLE_BLUE} transparent opacity={0.2 + boot * 0.4} />
        </line>
      ))}
    </group>
  );
}

export function QuantumHeroScene({ progress }: { progress: number }) {
  const idleBoot = useRef(0.4);
  useFrame((_, delta) => {
    idleBoot.current = Math.min(1, idleBoot.current + delta * 0.45);
  });

  const scrollBoot = phase(progress, 0, 0.35);
  const boot = Math.min(1, idleBoot.current * 0.6 + scrollBoot * 0.5 + 0.25);

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 10, 28]} />
      <ambientLight intensity={0.9} />
      <pointLight position={[3, 4, 5]} intensity={1.1} color={SKY} />
      <pointLight position={[-4, 2, 3]} intensity={0.65} color={APPLE_BLUE} />
      <directionalLight position={[0, 5, 2]} intensity={0.7} color="#ffffff" />

      <QuantumParticles />
      <gridHelper args={[14, 28, "#b8b8bd", "#d2d2d7"]} position={[0, -1.2, 0]} />

      <ProcessorWires boot={boot} />
      <QubitCore boot={boot} />
      <EntanglementLines boot={boot} />
    </>
  );
}
