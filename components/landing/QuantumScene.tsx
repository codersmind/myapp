"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { phase } from "./hooks/useScrollProgress";
import { QuantumField } from "./scene/QuantumField";
import { QuantumGrid } from "./scene/QuantumGrid";
import { Microcontroller } from "./scene/Microcontroller";
import { WiringSystem } from "./scene/WiringSystem";
import { NeuralNetwork } from "./scene/NeuralNetwork";
import { QubitRing } from "./scene/QubitRing";

function SceneContent({ scrollProgress }: { scrollProgress: number }) {
  const heroPhase = 1 - phase(scrollProgress, 0.08, 0.18);
  const mcuReveal = phase(scrollProgress, 0.1, 0.28);
  const wireProgress = phase(scrollProgress, 0.25, 0.5);
  const executePhase = phase(scrollProgress, 0.45, 0.65);
  const aiReveal = phase(scrollProgress, 0.58, 0.78);
  const aiActivity = phase(scrollProgress, 0.7, 0.95);
  const finale = phase(scrollProgress, 0.85, 1);

  return (
    <>
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 8, 28]} />

      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00d4ff" />
      <pointLight position={[-5, 3, -3]} intensity={0.8} color="#a855f7" />
      <spotLight position={[0, 8, 4]} angle={0.4} penumbra={1} intensity={1.5} color="#00ffaa" />

      <QuantumField intensity={0.5 + heroPhase * 0.5 + finale * 0.3} />
      <QuantumGrid opacity={0.25 + mcuReveal * 0.2} />
      <Stars radius={50} depth={40} count={1200} factor={3} saturation={0.6} fade speed={0.5} />

      <QubitRing intensity={heroPhase * 0.8 + aiActivity * 0.5} />

      <Microcontroller reveal={mcuReveal} execute={executePhase} />
      <WiringSystem progress={wireProgress} signal={executePhase} />
      <NeuralNetwork reveal={aiReveal} activity={aiActivity} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3 + scrollProgress * 0.5}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

export function QuantumScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <Canvas
      camera={{ position: [0, 3, 9], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    >
      <Suspense fallback={null}>
        <SceneContent scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}
