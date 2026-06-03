import * as THREE from "three";

export const appleAluminum = new THREE.MeshStandardMaterial({
  color: "#d2d2d7",
  metalness: 0.92,
  roughness: 0.28,
});

export const appleDark = new THREE.MeshStandardMaterial({
  color: "#1d1d1f",
  metalness: 0.85,
  roughness: 0.35,
});

export const appleGlass = new THREE.MeshPhysicalMaterial({
  color: "#ffffff",
  metalness: 0,
  roughness: 0.05,
  transmission: 0.85,
  thickness: 0.4,
  transparent: true,
  opacity: 0.55,
});

export const appleAccent = new THREE.MeshStandardMaterial({
  color: "#86868b",
  metalness: 0.5,
  roughness: 0.45,
});

export const appleGreen = new THREE.MeshStandardMaterial({
  color: "#34c759",
  emissive: "#34c759",
  emissiveIntensity: 0.15,
  metalness: 0.2,
  roughness: 0.4,
});

export const appleOrange = new THREE.MeshStandardMaterial({
  color: "#ff9500",
  emissive: "#ff9500",
  emissiveIntensity: 0.1,
  metalness: 0.3,
  roughness: 0.4,
});
