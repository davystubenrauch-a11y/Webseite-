"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * Procedural studio HDRI built from light panels (no network fetch). A slowly
 * orbiting strip light sweeps across the card for live glass reflections.
 */
export default function Studio() {
  const sweep = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (sweep.current) sweep.current.rotation.y = state.clock.elapsedTime * 0.35;
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <spotLight position={[4, 6, 6]} angle={0.4} penumbra={1} intensity={60} color="#fff4dc" />
      <pointLight position={[-5, -2, 3]} intensity={25} color="#2563EB" />
      <pointLight position={[4, -3, -2]} intensity={18} color="#D4AF37" />
      <Environment resolution={128} frames={Infinity}>
        <color attach="background" args={["#0b0f16"]} />
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[10, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.5} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#C5A059" />
        <Lightformer form="rect" intensity={2} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#2563EB" />
        <Lightformer form="ring" intensity={1.5} position={[0, -4, 3]} scale={3} color="#F3E2A9" />
        <group ref={sweep}>
          <Lightformer form="rect" intensity={6} position={[0, 0, 6]} scale={[0.6, 12, 1]} color="#ffffff" />
        </group>
      </Environment>
    </>
  );
}
