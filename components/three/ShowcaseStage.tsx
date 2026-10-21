"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Laptop from "./Laptop";
import NfcProduct from "./NfcProduct";
import { RoomModel } from "./RoomScan";
import Studio from "./Studio";
import { useInView } from "./useInView";

/**
 * Wraps one model: grows in when it is the active step, shrinks away otherwise,
 * and turns slowly so every model reads as a 3D object.
 */
function Slot({ index, active, scale = 1, spin = 0.25, children }: { index: number; active: number; scale?: number; spin?: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const on = index === active;
    const s = THREE.MathUtils.damp(g.scale.x, on ? scale : 0.0001, 6, delta);
    g.scale.setScalar(s);
    g.visible = s > 0.002;
    g.position.y = THREE.MathUtils.damp(g.position.y, on ? 0 : -1.2, 6, delta);
    g.rotation.y = Math.sin(state.clock.elapsedTime * spin) * 0.45;
  });
  return (
    <group ref={ref} scale={index === active ? scale : 0.0001}>
      {children}
    </group>
  );
}

/** One canvas, three models (NFC disc, laptop with website, scanned room) switched by scroll. */
export default function ShowcaseStage({ active, className }: { active: number; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      <Canvas
        flat
        frameloop={inView ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.6, 7.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "pan-y" }}
      >
        <Suspense fallback={null}>
          <Studio />
          <Slot index={0} active={active}>
            <NfcProduct theme="white" lang="de" business="" spin={0} />
          </Slot>
          <Slot index={1} active={active} scale={0.95}>
            <group rotation-x={0.12}>
              <Laptop />
            </group>
          </Slot>
          <Slot index={2} active={active} scale={0.42} spin={0.15}>
            <group position={[0, -1.6, 0]} rotation-x={0.35}>
              <RoomModel density={0.7} pointScale={1.6} />
            </group>
          </Slot>
          <ContactShadows position={[0, -1.9, 0]} opacity={active === 2 ? 0 : 0.35} scale={9} blur={2.6} far={3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
