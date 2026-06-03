"use client";

export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.55 * intensity} />
      <directionalLight position={[6, 8, 5]} intensity={1.1 * intensity} color="#ffffff" castShadow />
      <directionalLight position={[-5, 4, -3]} intensity={0.35 * intensity} color="#f5f5f7" />
      <pointLight position={[0, 3, 4]} intensity={0.4 * intensity} color="#ffffff" />
    </>
  );
}
