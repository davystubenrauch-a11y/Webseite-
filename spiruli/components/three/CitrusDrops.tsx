"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Drop = { pos: THREE.Vector3; r: number; phase: number; speed: number; kind: "citrus" | "water" | "berry" };

/** Fixed layout so the composition stays balanced around the can. */
const LAYOUT: [number, number, number, number, Drop["kind"]][] = [
  [-1.25, 0.9, 0.6, 0.11, "citrus"],
  [1.15, 1.25, 0.3, 0.08, "water"],
  [1.35, -0.2, 0.7, 0.14, "citrus"],
  [-1.05, -0.95, 0.9, 0.07, "water"],
  [0.85, -1.15, 1.0, 0.09, "citrus"],
  [-1.5, 0.05, -0.4, 0.06, "water"],
  [0.95, 0.55, -0.9, 0.06, "berry"],
  [1.05, 0.42, -0.75, 0.055, "berry"],
  [0.88, 0.38, -0.7, 0.05, "berry"],
  [-0.7, 1.55, 0.4, 0.05, "water"],
];

/**
 * Fresh citrus and water droplets plus a small elderberry cluster, bobbing
 * on slow independent orbits around the can.
 */
export default function CitrusDrops() {
  const group = useRef<THREE.Group>(null);
  const drops = useMemo<Drop[]>(
    () =>
      LAYOUT.map(([x, y, z, r, kind], i) => ({
        pos: new THREE.Vector3(x, y, z),
        r,
        kind,
        phase: i * 1.7,
        speed: 0.5 + (i % 4) * 0.12,
      })),
    [],
  );

  const mats = useMemo(
    () => ({
      citrus: new THREE.MeshPhysicalMaterial({
        color: "#ffcf5a",
        emissive: "#ff9a1f",
        emissiveIntensity: 0.25,
        roughness: 0.04,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        transparent: true,
        opacity: 0.72,
        ior: 1.33,
        specularIntensity: 1,
        envMapIntensity: 2.4,
      }),
      water: new THREE.MeshPhysicalMaterial({
        color: "#dff6ec",
        roughness: 0.02,
        metalness: 0,
        clearcoat: 1,
        transparent: true,
        opacity: 0.38,
        ior: 1.33,
        specularIntensity: 1,
        envMapIntensity: 3,
      }),
      berry: new THREE.MeshPhysicalMaterial({
        color: "#2a0f2e",
        roughness: 0.25,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        sheen: 0.6,
        sheenColor: new THREE.Color("#6b3d8a"),
        envMapIntensity: 1.6,
      }),
    }),
    [],
  );

  const sphere = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    g.children.forEach((m, i) => {
      const d = drops[i];
      m.position.set(
        d.pos.x + Math.sin(t * d.speed + d.phase) * 0.06,
        d.pos.y + Math.sin(t * d.speed * 1.3 + d.phase) * 0.12,
        d.pos.z + Math.cos(t * d.speed + d.phase) * 0.05,
      );
      // Liquid wobble on the drops; berries stay round.
      if (d.kind !== "berry") {
        const w = Math.sin(t * 2.2 + d.phase) * 0.06;
        m.scale.set(d.r * (1 + w), d.r * (1.08 - w), d.r * (1 + w));
      }
    });
    g.rotation.y = Math.sin(t * 0.15) * 0.25;
  });

  return (
    <group ref={group}>
      {drops.map((d, i) => (
        <mesh key={i} geometry={sphere} material={mats[d.kind]} scale={d.r} />
      ))}
    </group>
  );
}
