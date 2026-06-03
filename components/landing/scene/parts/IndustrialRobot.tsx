"use client";

import * as THREE from "three";

const BODY = new THREE.MeshStandardMaterial({ color: "#e8e8ed", metalness: 0.88, roughness: 0.18 });
const JOINT = new THREE.MeshStandardMaterial({ color: "#1d1d1f", metalness: 0.85, roughness: 0.28 });
const ACCENT = new THREE.MeshStandardMaterial({ color: "#ff9500", metalness: 0.6, roughness: 0.35 });
const GRIPPER = new THREE.MeshStandardMaterial({ color: "#86868b", metalness: 0.9, roughness: 0.15 });

function JointSphere({ radius = 0.14 }: { radius?: number }) {
  return (
    <mesh castShadow>
      <sphereGeometry args={[radius, 20, 20]} />
      <meshStandardMaterial color="#2d2d2f" metalness={0.9} roughness={0.2} />
    </mesh>
  );
}

function LinkHousing({ length, width = 0.22, height = 0.18 }: { length: number; width?: number; height?: number }) {
  return (
    <group>
      <mesh position={[length / 2, 0, 0]} castShadow>
        <boxGeometry args={[length, height, width]} />
        <meshStandardMaterial color="#d2d2d7" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Motor housing bulge */}
      <mesh position={[length * 0.35, height * 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[width * 0.55, width * 0.55, height * 0.5, 20]} />
        <meshStandardMaterial color="#86868b" metalness={0.85} roughness={0.22} />
      </mesh>
      {/* Orange accent stripe like industrial robots */}
      <mesh position={[length / 2, height / 2 + 0.01, 0]}>
        <boxGeometry args={[length * 0.85, 0.015, width * 0.7]} />
        <meshStandardMaterial color="#ff9500" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

interface IndustrialRobotProps {
  j1?: number;
  j2?: number;
  j3?: number;
  j4?: number;
  j5?: number;
  j6?: number;
  gripOpen?: number;
  scale?: number;
}

export function IndustrialRobot({
  j1 = 0,
  j2 = -0.4,
  j3 = 0.6,
  j4 = 0,
  j5 = 0.3,
  j6 = 0,
  gripOpen = 0.5,
  scale = 1,
}: IndustrialRobotProps) {
  const upperLen = 1.05;
  const foreLen = 0.85;

  return (
    <group scale={scale}>
      {/* Pedestal base */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[0.75, 0.85, 0.16, 32]} />
        <meshStandardMaterial color="#1d1d1f" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* Bolt ring */}
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.7, 32]} />
        <meshStandardMaterial color="#48484a" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* J1 — base rotation */}
      <group position={[0, 0.2, 0]} rotation={[0, j1, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.32, 0.38, 0.28, 24]} />
          <meshStandardMaterial color="#86868b" metalness={0.9} roughness={0.18} />
        </mesh>

        {/* J2 — shoulder */}
        <group position={[0, 0.2, 0]} rotation={[0, 0, j2]}>
          <JointSphere radius={0.16} />
          <group position={[0, 0, 0]}>
            <LinkHousing length={upperLen} height={0.2} width={0.24} />

            {/* J3 — elbow at end of upper arm */}
            <group position={[upperLen, 0, 0]} rotation={[0, 0, j3]}>
              <JointSphere radius={0.13} />
              <LinkHousing length={foreLen} height={0.16} width={0.2} />

              {/* J4/J5/J6 — wrist assembly */}
              <group position={[foreLen, 0, 0]} rotation={[j4, j5, j6]}>
                <mesh castShadow>
                  <boxGeometry args={[0.14, 0.14, 0.14]} />
                  <meshStandardMaterial color="#48484a" metalness={0.85} roughness={0.25} />
                </mesh>

                {/* Parallel gripper */}
                <group position={[0.12, 0, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.1, 0.08, 0.22]} />
                    <meshStandardMaterial color="#2d2d2f" metalness={0.8} roughness={0.3} />
                  </mesh>
                  <mesh position={[0.06, 0.06 - gripOpen * 0.04, 0]} castShadow material={GRIPPER}>
                    <boxGeometry args={[0.12, 0.025, 0.06]} />
                  </mesh>
                  <mesh position={[0.06, -0.06 + gripOpen * 0.04, 0]} castShadow material={GRIPPER}>
                    <boxGeometry args={[0.12, 0.025, 0.06]} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* Cable conduit along arm */}
      <mesh position={[0.3, 0.45, 0.12]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.025, 0.025, 1.2, 8]} />
        <meshStandardMaterial color="#1d1d1f" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}
