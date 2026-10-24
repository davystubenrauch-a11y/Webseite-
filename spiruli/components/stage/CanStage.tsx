"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEnvironment } from "@react-three/drei";
import * as THREE from "three";

/**
 * Real-time can for the hero, drawn at full screen resolution so it stays
 * sharp at any size. Scroll progress (0–1, written by the hero) turns it once. It matches the Blender render
 * (scripts/render_can.py): same lathe profiles, the same 4096 px label with
 * its PBR map, and the Blender studio captured as an HDRI for reflections.
 */
const R = 0.58;
const BODY_H = 2.92;
const TOP = BODY_H / 2;

// (radius, height above the label top / below the label bottom), from render_can.py.
const SHOULDER: [number, number][] = [
  [R, 0], [0.579, 0.02], [0.572, 0.05], [0.556, 0.085], [0.535, 0.115], [0.515, 0.14], [0.506, 0.156],
  [0.507, 0.166], [0.512, 0.174], [0.514, 0.182], [0.51, 0.19], [0.502, 0.193], [0.495, 0.188],
  [0.492, 0.176], [0.489, 0.152], [0.48, 0.138], [0.468, 0.14], [0.455, 0.145], [0, 0.145],
];
const BOTTOM: [number, number][] = [
  [0, -0.03], [0.2, -0.036], [0.35, -0.052], [0.42, -0.078], [0.445, -0.093], [0.47, -0.097],
  [0.5, -0.09], [0.54, -0.074], [0.565, -0.048], [0.578, -0.02], [R, 0],
];

const lathe = (pts: [number, number][], y0: number) =>
  new THREE.LatheGeometry(pts.map(([r, h]) => new THREE.Vector2(r, y0 + h)), 256);

function Can({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const [color, pbr] = useLoader(THREE.TextureLoader, ["/label/can-color.webp", "/label/can-pbr.webp"]);

  const parts = useMemo(() => {
    color.colorSpace = THREE.SRGBColorSpace;
    color.anisotropy = pbr.anisotropy = gl.capabilities.getMaxAnisotropy();
    const label = new THREE.MeshPhysicalMaterial({
      map: color,
      roughnessMap: pbr,
      metalnessMap: pbr,
      roughness: 1,
      metalness: 1,
      clearcoat: 0.06,
      clearcoatRoughness: 0.5,
      envMapIntensity: 0.55,
    });
    const alu = new THREE.MeshPhysicalMaterial({
      color: "#e8eaec",
      metalness: 1,
      roughness: 0.34,
      anisotropy: 0.3,
      envMapIntensity: 0.75,
      side: THREE.DoubleSide,
    });
    const tab = new THREE.Shape();
    tab.absellipse(0, 0, 0.17, 0.15, 0, Math.PI * 2, false, 0);
    const hole = new THREE.Path();
    hole.absellipse(0, -0.06, 0.1, 0.06, 0, Math.PI * 2, false, 0);
    tab.holes.push(hole);
    return {
      label,
      alu,
      body: new THREE.CylinderGeometry(R, R, BODY_H, 256, 1, true, Math.PI, Math.PI * 2),
      top: lathe(SHOULDER, TOP),
      bottom: lathe(BOTTOM, -TOP),
      tab: new THREE.ExtrudeGeometry(tab, { depth: 0.012, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.005, bevelSegments: 4, curveSegments: 48 }),
    };
  }, [color, pbr, gl]);

  const pointer = useRef({ x: 0, y: 0 });
  const spin = useRef(0);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    // One full turn over the hero, eased; the front faces you at start and end.
    spin.current = THREE.MathUtils.damp(spin.current, progress.current * Math.PI * 2, 6, dt);
    g.rotation.set(0.12 + pointer.current.y * 0.08, spin.current + pointer.current.x * 0.3, -0.06, "YXZ");
    g.position.y = Math.sin(t * 0.9) * 0.05;
  });

  return (
    <group ref={group}>
      <mesh geometry={parts.body} material={parts.label} />
      <mesh geometry={parts.top} material={parts.alu} />
      <mesh geometry={parts.bottom} material={parts.alu} />
      <mesh geometry={parts.tab} material={parts.alu} position={[0, TOP + 0.147, 0.02]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh material={parts.alu} position={[0, TOP + 0.155, 0.08]}>
        <cylinderGeometry args={[0.038, 0.042, 0.025, 48]} />
      </mesh>
    </group>
  );
}

function Studio() {
  // The Blender studio (softboxes + teal world) as an equirectangular HDRI.
  const env = useEnvironment({ files: "/env/studio.hdr" });
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.environment = env;
    return () => {
      scene.environment = null;
    };
  }, [env, scene]);
  return null;
}

export default function CanStage({ progress, className }: { progress: React.MutableRefObject<number>; className?: string }) {
  return (
    <div aria-hidden className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.1, 8.6], fov: 30 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.LinearToneMapping, toneMappingExposure: 1.0 }}
      >
        <Suspense fallback={null}>
          <Studio />
          <Can progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
