"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import NfcProduct from "./NfcProduct";
import Phone, { type PhoneScreen } from "./Phone";
import Studio from "./Studio";
import { FitCamera } from "./NfcStage";
import { useInView } from "./useInView";
import { storyTime } from "@/lib/story";

// Hero animation: a phone taps the NFC disc, NFC rings ripple out, the Google review
// opens on the phone and five 3D stars fly out and line up. Loops every STORY_LENGTH s.

const DISC_POS = new THREE.Vector3(-0.95, 0, 0);
const DISC_YAW = 0.42;
const REST = { pos: new THREE.Vector3(1.85, -0.15, 0.7), rotY: -0.38, rotZ: 0.06 };
const TAP = { pos: new THREE.Vector3(-0.75, 0.25, 0.95), rotY: DISC_YAW, rotZ: 0 };

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const backOut = (x: number) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);

/** 0 → 1 between a and b. */
const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

function starShape() {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? 0.075 : 0.17;
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  return s;
}

function Story() {
  const phone = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Mesh[]>([]);
  const stars = useRef<THREE.Mesh[]>([]);
  const scene = useRef<THREE.Group>(null);
  const screen = useRef<PhoneScreen>({ unlocked: false, stars: 0 });
  const discControl = useRef({ explode: 0, yaw: DISC_YAW, tilt: 0 });

  const starGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(starShape(), { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 3 });
    g.center();
    return g;
  }, []);
  const starMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#FBBC05", emissive: "#f59e0b", emissiveIntensity: 0.25, metalness: 0.3, roughness: 0.25, clearcoat: 1 }), []);
  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#2563eb", transparent: true, opacity: 0, depthWrite: false }), []);
  const ringMats = useMemo(() => [0, 1, 2].map(() => ringMat.clone()), [ringMat]);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const t = storyTime();

    // Phone pose: rest → tap → rest.
    const k = t < 2.6 ? ease(span(t, 1.1, 2.1)) : 1 - ease(span(t, 2.9, 3.9));
    const p = phone.current;
    if (p) {
      p.position.lerpVectors(REST.pos, TAP.pos, k);
      p.rotation.y = THREE.MathUtils.lerp(REST.rotY, TAP.rotY, k);
      p.rotation.z = THREE.MathUtils.lerp(REST.rotZ, TAP.rotZ, k) + Math.sin(state.clock.elapsedTime * 1.3) * 0.015;
      p.position.y += Math.sin(state.clock.elapsedTime * 1.6) * 0.03 * (1 - k);
    }

    // Screen state.
    screen.current.unlocked = t > 2.2 && t < 7.1;
    screen.current.stars = t < 4.0 ? 0 : Math.min(5, Math.floor((t - 4.0) / 0.38) + 1);

    // NFC ripples from the disc at the moment of the tap.
    rings.current.forEach((m, i) => {
      const r = span(t, 2.15 + i * 0.22, 3.15 + i * 0.22);
      m.scale.setScalar(0.6 + r * 1.6);
      ringMats[i].opacity = r > 0 && r < 1 ? (1 - r) * 0.7 : 0;
    });

    // Stars fly from the phone screen and line up above it.
    stars.current.forEach((m, i) => {
      const start = 4.0 + i * 0.38;
      const f = span(t, start, start + 0.7);
      const out = span(t, 6.8, 7.3);
      const from = tmp.set(REST.pos.x - 0.1, REST.pos.y + 0.3, REST.pos.z + 0.2);
      const tx = REST.pos.x - 0.95 + i * 0.36;
      const ty = 1.6 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.04;
      m.position.set(
        THREE.MathUtils.lerp(from.x, tx, ease(f)),
        THREE.MathUtils.lerp(from.y, ty, ease(f)) + Math.sin(Math.PI * f) * 0.35,
        THREE.MathUtils.lerp(from.z, REST.pos.z + 0.3, f),
      );
      const s = f > 0 ? backOut(f) * (1 - out) : 0;
      m.scale.setScalar(Math.max(s, 0.0001));
      m.rotation.y = (1 - f) * Math.PI * 2 + Math.sin(state.clock.elapsedTime + i) * 0.2;
    });

    // Gentle parallax towards the pointer.
    if (scene.current) {
      scene.current.rotation.y = THREE.MathUtils.damp(scene.current.rotation.y, state.pointer.x * 0.12, 3, delta);
      scene.current.rotation.x = THREE.MathUtils.damp(scene.current.rotation.x, -state.pointer.y * 0.06, 3, delta);
    }
  });

  return (
    <group ref={scene}>
      <group position={DISC_POS}>
        <NfcProduct theme="white" lang="en" business="" control={discControl} still />
        <group rotation-y={DISC_YAW}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} ref={(m) => void (m && (rings.current[i] = m))} material={ringMats[i]} position-z={0.12}>
              <ringGeometry args={[1.45, 1.52, 96]} />
            </mesh>
          ))}
        </group>
      </group>
      <group ref={phone}>
        <Phone screen={screen} />
      </group>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} ref={(m) => void (m && (stars.current[i] = m))} geometry={starGeo} material={starMat} scale={0.0001} />
      ))}
    </group>
  );
}

export default function TapStory({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      <Canvas
        flat
        frameloop={inView ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.25, 8], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "pan-y" }}
      >
        <FitCamera z={8} halfWidth={2.8} />
        <Suspense fallback={null}>
          <Studio />
          <Story />
          <ContactShadows position={[0, -1.85, 0]} opacity={0.3} scale={10} blur={2.8} far={3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
