"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * Procedural studio HDRI built from light panels (no network fetch). A slowly
 * orbiting strip light sweeps across the lacquer for live reflections, with
 * an emerald rim and a warm gold kicker.
 */
export default function Studio({ accent = "#2FA35B" }: { accent?: string }) {
  const sweep = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (sweep.current) sweep.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <>
      <ambientLight intensity={0.45} color="#dfeef2" />
      <spotLight position={[3, 6, 5]} angle={0.45} penumbra={1} intensity={40} color="#fff3dc" />
      <pointLight position={[-3, 1, -2]} intensity={10} color={accent} />
      <pointLight position={[-3, 0.5, 4]} intensity={14} color="#cfe6ee" />
      <pointLight position={[3, -2, -1.5]} intensity={18} color="#E2C47A" />
      <Environment resolution={256} frames={Infinity}>
        {/* A darker studio with crisp softbox strips: polished aluminium needs contrast to read as metal. */}
        <color attach="background" args={["#6d7479"]} />
        <Lightformer form="rect" intensity={3} position={[0, 5, 3]} scale={[10, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={5} position={[-3, 1, 2.5]} rotation-y={Math.PI / 5} scale={[0.5, 9, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={3} position={[3.2, 1, 2]} rotation-y={-Math.PI / 5} scale={[0.35, 9, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={0.8} position={[4.5, 0, 1]} rotation-y={-Math.PI / 2} scale={[6, 8, 1]} color="#C9A55A" />
        <Lightformer form="rect" intensity={0.6} position={[-5, 0, -2]} rotation-y={Math.PI / 2} scale={[6, 8, 1]} color={accent} />
        <Lightformer form="ring" intensity={1.2} position={[0, -4, 3]} scale={3} color="#F1E2B5" />
        <group ref={sweep}>
          <Lightformer form="rect" intensity={0.9} position={[0, 0, 6]} scale={[2.5, 12, 1]} color="#ffffff" />
        </group>
      </Environment>
    </>
  );
}
