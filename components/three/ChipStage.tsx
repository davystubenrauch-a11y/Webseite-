"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import NfcProduct from "./NfcProduct";
import Studio from "./Studio";
import { FitCamera } from "./NfcStage";
import { useInView } from "./useInView";
import type { Theme } from "@/lib/pricing";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);

/** Maps scroll progress (0–1) to the disc pose: turn, then separate the layers. */
export function poseAt(p: number) {
  const turn = smooth(clamp01(p / 0.3));
  const open = smooth(clamp01((p - 0.28) / 0.35));
  return {
    yaw: 0.25 - turn * 1.15 - clamp01((p - 0.7) / 0.3) * 0.25,
    explode: open,
    tilt: 0.1 + open * 0.22,
  };
}

const LABELS = [
  { x: 0.9, z: 1, y: 1.0, text: "Frontplatte mit Druck", color: "bg-blue-600" },
  { x: 0.7, z: 0, y: -0.1, text: "NFC-Chip + Kupferantenne", color: "bg-amber-500" },
  { x: 1.0, z: -1, y: -0.95, text: "Rückplatte", color: "bg-emerald-600" },
];

function Scene({ progress, theme }: { progress: MotionValue<number>; theme: Theme }) {
  const control = useRef({ explode: 0, yaw: 0.25, tilt: 0.1 });
  const mirror = useRef<THREE.Group>(null);
  const anchors = useRef<THREE.Group[]>([]);
  const labelEls = useRef<HTMLDivElement[]>([]);
  const state = useRef({ yaw: 0.25, explode: 0, tilt: 0.1 });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const target = poseAt(progress.get());
    control.current = target;
    // Mirror NfcProduct's own damping so the labels stick to the layers.
    const s = state.current;
    s.yaw = THREE.MathUtils.damp(s.yaw, target.yaw, 6, dt);
    s.explode = THREE.MathUtils.damp(s.explode, target.explode, 8, dt);
    s.tilt = THREE.MathUtils.damp(s.tilt, target.tilt, 4, dt);
    if (mirror.current) {
      mirror.current.rotation.set(s.tilt, s.yaw, 0);
    }
    anchors.current.forEach((a, i) => a && a.position.set(LABELS[i].x, LABELS[i].y, LABELS[i].z * s.explode * 0.95));
    labelEls.current.forEach((el) => el && (el.style.opacity = String(clamp01((s.explode - 0.6) / 0.3))));
  });

  // On narrow screens the disc moves left so the labels to its right stay on screen.
  const narrow = useThree((s) => s.size.width < 640);

  return (
    <group position-x={narrow ? -1.3 : 0}>
      <FitCamera z={8.5} halfWidth={narrow ? 3.1 : 4.6} />
      <NfcProduct theme={theme} lang="de" business="" control={control} still />
      <group ref={mirror}>
        {LABELS.map((l, i) => (
          <group key={l.text} ref={(g) => void (g && (anchors.current[i] = g))}>
            <Html center={false} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
              <div
                ref={(el) => void (el && (labelEls.current[i] = el))}
                className="flex -translate-y-1/2 items-center gap-2 whitespace-nowrap opacity-0 transition-opacity"
              >
                <span className="h-px w-5 bg-slate-400 sm:w-16" />
                <span className={`h-2.5 w-2.5 rounded-full ${l.color} ring-4 ring-white`} />
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-md backdrop-blur sm:px-3 sm:py-1.5 sm:text-sm">{l.text}</span>
              </div>
            </Html>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Canvas for the scroll-scrubbed "what's inside" section. */
export default function ChipStage({ progress, theme, className }: { progress: MotionValue<number>; theme: Theme; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      <Canvas flat frameloop={inView ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0.3, 8.5], fov: 35 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <Studio />
          <Scene progress={progress} theme={theme} />
          <ContactShadows position={[0, -2.2, 0]} opacity={0.3} scale={9} blur={2.8} far={3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
