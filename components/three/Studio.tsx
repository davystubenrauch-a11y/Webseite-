"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * Procedural studio HDRI built from light panels (no network fetch), tuned to the warm
 * paper palette. A slowly orbiting strip light sweeps across the disc for soft reflections.
 */
export default function Studio() {
  const sweep = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (sweep.current) sweep.current.rotation.y = state.clock.elapsedTime * 0.25;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight position={[4, 6, 6]} angle={0.4} penumbra={1} intensity={55} color="#fff6ea" />
      <pointLight position={[-5, -2, 3]} intensity={14} color="#a7b8ab" />
      <pointLight position={[4, -3, -2]} intensity={12} color="#d8c9b6" />
      <Environment resolution={128} frames={Infinity}>
        <color attach="background" args={["#a8a197"]} />
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[10, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#ece6de" />
        <Lightformer form="rect" intensity={1.8} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#c9d4cb" />
        <Lightformer form="ring" intensity={1.5} position={[0, -4, 3]} scale={3} color="#ffffff" />
        <group ref={sweep}>
          <Lightformer form="rect" intensity={5} position={[0, 0, 6]} scale={[0.6, 12, 1]} color="#ffffff" />
        </group>
      </Environment>
    </>
  );
}
