"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useInView } from "./useInView";

// AI room-tour visual: a room reconstructed as a point cloud. A scan wave sweeps
// outward from the capture point, then the camera glides along the walkthrough path.

type Box = [cx: number, cy: number, cz: number, sx: number, sy: number, sz: number];

const ROOM: Box = [0, 1.5, 0, 7, 3, 5.4];
const FURNITURE: Box[] = [
  [-1.9, 0.4, -1.8, 2.6, 0.8, 1], // sofa
  [-1.9, 0.85, -2.2, 2.6, 0.9, 0.25], // sofa back
  [-1.9, 0.22, -0.3, 1.4, 0.44, 0.8], // coffee table
  [2.2, 0.38, 1.2, 1.6, 0.76, 1], // dining table
  [2.6, 1.1, -2.4, 1.4, 2.2, 0.5], // shelf
  [0.9, 0.9, -2.45, 0.3, 1.8, 0.3], // floor lamp
];

/** Uniform random points on the surface of an axis-aligned box. */
function sampleBox([cx, cy, cz, sx, sy, sz]: Box, n: number, out: number[], skipTop = false) {
  const faces = [
    { a: sx * sz, f: (u: number, v: number) => [cx + (u - 0.5) * sx, cy - sy / 2, cz + (v - 0.5) * sz] },
    { a: skipTop ? 0 : sx * sz, f: (u: number, v: number) => [cx + (u - 0.5) * sx, cy + sy / 2, cz + (v - 0.5) * sz] },
    { a: sx * sy, f: (u: number, v: number) => [cx + (u - 0.5) * sx, cy + (v - 0.5) * sy, cz - sz / 2] },
    { a: sx * sy, f: (u: number, v: number) => [cx + (u - 0.5) * sx, cy + (v - 0.5) * sy, cz + sz / 2] },
    { a: sy * sz, f: (u: number, v: number) => [cx - sx / 2, cy + (v - 0.5) * sy, cz + (u - 0.5) * sz] },
    { a: sy * sz, f: (u: number, v: number) => [cx + sx / 2, cy + (v - 0.5) * sy, cz + (u - 0.5) * sz] },
  ];
  const total = faces.reduce((s, f) => s + f.a, 0);
  for (let i = 0; i < n; i++) {
    let r = Math.random() * total;
    const face = faces.find((f) => (r -= f.a) <= 0) ?? faces[0];
    out.push(...face.f(Math.random(), Math.random()));
  }
}

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uWave;
  uniform float uPixelRatio;
  uniform float uPointScale;
  attribute float aRand;
  varying float vGlow;
  varying float vVisible;
  varying float vMix;
  void main() {
    float d = length(position - vec3(0.0, 1.2, 1.5));
    float front = uWave - d;
    vVisible = smoothstep(-0.05, 0.25, front);
    vGlow = exp(-abs(front) * 6.0);
    vMix = aRand;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.4 + vGlow * 3.0 + aRand * 0.8) * uPixelRatio * uPointScale * (9.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  varying float vGlow;
  varying float vVisible;
  varying float vMix;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    vec3 amber = vec3(0.96, 0.62, 0.04);
    vec3 ice = vec3(0.62, 0.74, 1.0);
    vec3 col = mix(amber, ice, step(0.82, vMix)) + vGlow * vec3(1.0, 0.95, 0.8);
    float a = (1.0 - d * 2.0) * (0.25 + vVisible * 0.6 + vGlow);
    gl_FragColor = vec4(col, a * max(vVisible, vGlow));
  }
`;

function PointCloud({ density = 1, pointScale = 1 }: { density?: number; pointScale?: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const { geometry, material } = useMemo(() => {
    const pts: number[] = [];
    sampleBox(ROOM, Math.round(9000 * density), pts, true);
    FURNITURE.forEach((b) => sampleBox(b, Math.round(1400 * density), pts));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    g.setAttribute("aRand", new THREE.Float32BufferAttribute(pts.filter((_, i) => i % 3 === 0).map(() => Math.random()), 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: { uTime: { value: 0 }, uWave: { value: 0 }, uPixelRatio: { value: 1 }, uPointScale: { value: 1 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: g, material: m };
  }, [density]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;
    // Scan wave: expands over 4.5 s, holds, then restarts.
    material.uniforms.uWave.value = Math.min((t % 9) * 2.2, 14);
    material.uniforms.uPixelRatio.value = dpr;
    material.uniforms.uPointScale.value = pointScale;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/** Gold wireframe of the room shell and furniture. */
function Wireframe() {
  const geos = useMemo(
    () => [ROOM, ...FURNITURE].map(([cx, cy, cz, sx, sy, sz]) => ({ g: new THREE.EdgesGeometry(new THREE.BoxGeometry(sx, sy, sz)), p: [cx, cy, cz] as const })),
    [],
  );
  return (
    <group>
      {geos.map(({ g, p }, i) => (
        <lineSegments key={i} geometry={g} position={p}>
          <lineBasicMaterial color="#f59e0b" transparent opacity={i === 0 ? 0.4 : 0.25} />
        </lineSegments>
      ))}
      <gridHelper args={[7, 14, "#f59e0b", "#1e293b"]} position={[0, 0.001, 0]} scale={[1, 1, 5.4 / 7]} />
    </group>
  );
}

/** Pulsing hotspots, like the info points in a virtual tour. */
function Hotspots() {
  const refs = useRef<THREE.Mesh[]>([]);
  const spots: [number, number, number][] = [
    [-1.9, 1.1, -1.6],
    [2.2, 1.05, 1.2],
    [2.6, 2.4, -2.2],
  ];
  useFrame((state) => {
    refs.current.forEach((m, i) => {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.25;
      m.scale.setScalar(s);
    });
  });
  return (
    <>
      {spots.map((p, i) => (
        <mesh key={i} position={p} ref={(m) => void (m && (refs.current[i] = m))}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#fde68a" />
        </mesh>
      ))}
    </>
  );
}

/** The scanned room without its own camera, for embedding in other scenes. */
/** `pointScale` enlarges the points when the room is shown scaled down. */
export function RoomModel({ density = 1, pointScale = 1 }: { density?: number; pointScale?: number }) {
  return (
    <>
      <Wireframe />
      <PointCloud density={density} pointScale={pointScale} />
      <Hotspots />
    </>
  );
}

/** Camera glides along a smooth walkthrough path that loops through the room. */
function WalkthroughCamera() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(5.5, 3.6, 6.5),
          new THREE.Vector3(-4.5, 3, 6),
          new THREE.Vector3(-6, 3.4, -1),
          new THREE.Vector3(1, 4.5, 6.5),
        ],
        true,
      ),
    [],
  );
  const target = useMemo(() => new THREE.Vector3(0, 0.9, -0.4), []);
  useFrame((state) => {
    const p = curve.getPointAt((state.clock.elapsedTime * 0.018) % 1);
    state.camera.position.lerp(p, 0.05);
    state.camera.lookAt(target);
  });
  return null;
}

export default function RoomScan({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <div ref={ref} className={className}>
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [5.5, 3.6, 6.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#0f172a", 8, 18]} />
          <RoomModel density={mobile ? 0.55 : 1} />
          <WalkthroughCamera />
        </Suspense>
      </Canvas>
    </div>
  );
}
