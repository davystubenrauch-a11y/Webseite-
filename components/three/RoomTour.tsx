"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useInView } from "./useInView";
import { VIEWS } from "@/lib/roomViews";

// Walkable demo room for the roomtour section: a furnished open-plan living space that
// "scans in" from the floor up, with hotspots that fly the camera between areas.


type V3 = [number, number, number];

function Box({ p, s, c, rough = 0.8 }: { p: V3; s: V3; c: string; rough?: number }) {
  return (
    <mesh position={p} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={rough} />
    </mesh>
  );
}

function Furniture() {
  const wood = "#c8a27a";
  return (
    <group>
      {/* Floor, walls, window */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#e7d3b8" roughness={0.9} />
      </mesh>
      <Box p={[0, 1.5, -3]} s={[8, 3, 0.1]} c="#f8fafc" />
      <Box p={[-4, 1.5, 0]} s={[0.1, 3, 6]} c="#f1f5f9" />
      <mesh position={[-1.4, 1.65, -2.94]}>
        <planeGeometry args={[2.4, 1.5]} />
        <meshStandardMaterial color="#e0f2fe" emissive="#bae6fd" emissiveIntensity={0.9} />
      </mesh>
      <Box p={[-1.4, 1.65, -2.93]} s={[0.05, 1.5, 0.04]} c="#ffffff" />
      <Box p={[-1.4, 0.88, -2.9]} s={[2.6, 0.06, 0.15]} c="#ffffff" />

      {/* Living: rug, sofa, coffee table, plant, lamp, shelf */}
      <Box p={[-1.3, 0.01, -1.1]} s={[3.2, 0.02, 2.2]} c="#c7d2fe" />
      <Box p={[-1.3, 0.25, -2.25]} s={[2.7, 0.42, 0.95]} c="#475569" />
      <Box p={[-1.3, 0.62, -2.62]} s={[2.7, 0.55, 0.25]} c="#475569" />
      <Box p={[-2.72, 0.42, -2.25]} s={[0.18, 0.4, 0.95]} c="#334155" />
      <Box p={[0.12, 0.42, -2.25]} s={[0.18, 0.4, 0.95]} c="#334155" />
      <Box p={[-1.9, 0.52, -2.2]} s={[0.4, 0.3, 0.12]} c="#fbbf24" />
      <Box p={[-0.7, 0.52, -2.2]} s={[0.4, 0.3, 0.12]} c="#34d399" />
      <mesh position={[-1.3, 0.4, -1.05]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 48]} />
        <meshStandardMaterial color={wood} roughness={0.6} />
      </mesh>
      <mesh position={[-1.3, 0.2, -1.05]} castShadow>
        <cylinderGeometry args={[0.06, 0.12, 0.38, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-3.45, 0.25, -2.5]} castShadow>
        <cylinderGeometry args={[0.22, 0.17, 0.5, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      {[
        [-3.45, 0.85, -2.5, 0.38],
        [-3.3, 1.2, -2.4, 0.28],
        [-3.6, 1.1, -2.6, 0.26],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 24, 24]} />
          <meshStandardMaterial color={i ? "#16a34a" : "#22c55e"} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0.65, 0.8, -2.6]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.65, 1.62, -2.6]}>
        <coneGeometry args={[0.25, 0.3, 32, 1, true]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fcd34d" emissiveIntensity={0.8} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0.65, 1.5, -2.5]} intensity={3} distance={4} color="#fde68a" />
      <Box p={[-3.85, 1.5, -0.6]} s={[0.3, 0.04, 1.6]} c={wood} />
      <Box p={[-3.85, 2.0, -0.6]} s={[0.3, 0.04, 1.6]} c={wood} />
      {["#2563eb", "#f59e0b", "#10b981", "#64748b", "#ef4444", "#2563eb"].map((c, i) => (
        <Box key={i} p={[-3.85, 1.68, -1.25 + i * 0.13]} s={[0.22, 0.32, 0.09]} c={c} />
      ))}

      {/* Dining: table, chairs, pendant */}
      <Box p={[2.3, 0.75, 0.1]} s={[1.7, 0.06, 0.95]} c={wood} rough={0.5} />
      {[
        [1.6, -0.3],
        [3.0, -0.3],
        [1.6, 0.5],
        [3.0, 0.5],
      ].map(([x, z], i) => (
        <Box key={i} p={[x, 0.37, z]} s={[0.05, 0.74, 0.05]} c="#1e293b" />
      ))}
      {[1.85, 2.75].flatMap((x) =>
        [-0.6, 0.8].map((z) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <Box p={[0, 0.46, 0]} s={[0.45, 0.05, 0.45]} c="#f1f5f9" />
            <Box p={[0, 0.75, z < 0 ? -0.2 : 0.2]} s={[0.45, 0.55, 0.05]} c="#f1f5f9" />
            <Box p={[0, 0.22, 0]} s={[0.05, 0.44, 0.05]} c="#1e293b" />
          </group>
        )),
      )}
      <mesh position={[2.3, 2.1, 0.1]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#fff7ed" emissive="#fdba74" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[2.3, 1.9, 0.1]} intensity={4} distance={4} color="#fed7aa" />

      {/* Kitchen */}
      <Box p={[2.75, 0.45, -2.65]} s={[2.3, 0.9, 0.6]} c="#ffffff" rough={0.4} />
      <Box p={[2.75, 0.92, -2.65]} s={[2.34, 0.04, 0.64]} c="#334155" rough={0.3} />
      <Box p={[2.75, 2.1, -2.78]} s={[2.3, 0.7, 0.35]} c="#ffffff" rough={0.4} />
      <Box p={[2.2, 0.98, -2.6]} s={[0.5, 0.06, 0.35]} c="#94a3b8" rough={0.2} />
    </group>
  );
}

/** Rising clipping plane + glowing sheet: the room "scans in" from the floor up. */
function ScanIn({ run }: { run: boolean }) {
  const gl = useThree((s) => s.gl);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);
  const sheet = useRef<THREE.Mesh>(null);
  const h = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    gl.clippingPlanes = [plane];
    return () => {
      gl.clippingPlanes = [];
    };
  }, [gl, plane]);

  useFrame((_, delta) => {
    if (done.current || !run) return;
    h.current += Math.min(delta, 1 / 30) * 1.4;
    plane.constant = h.current;
    if (sheet.current) {
      sheet.current.position.y = h.current;
      (sheet.current.material as THREE.MeshBasicMaterial).opacity = h.current < 3.2 ? 0.35 : 0;
    }
    if (h.current > 3.4) {
      done.current = true;
      gl.clippingPlanes = [];
    }
  });

  return (
    <mesh ref={sheet} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[8.4, 6.4]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Hotspots({ view, onPick }: { view: number; onPick: (i: number) => void }) {
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame((s) => refs.current.forEach((m, i) => m && m.scale.setScalar(1 + Math.sin(s.clock.elapsedTime * 3 + i) * 0.2)));
  return (
    <>
      {VIEWS.slice(1).map((v, j) => {
        const i = j + 1;
        return (
          <group key={v.label} position={[v.target[0], v.target[1] + 0.7, v.target[2]]}>
            <mesh ref={(m) => void (m && (refs.current[j] = m))} onClick={() => onPick(i)} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
              <sphereGeometry args={[0.09, 20, 20]} />
              <meshBasicMaterial color={view === i ? "#f59e0b" : "#2563eb"} />
            </mesh>
            {view !== i && (
              <Html center position={[0, 0.25, 0]} zIndexRange={[10, 0]}>
                <button
                  type="button"
                  onClick={() => onPick(i)}
                  className="whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-md ring-1 ring-slate-200 hover:text-brand"
                >
                  {v.label}
                </button>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

function Rig({ view }: { view: number }) {
  const ref = useRef<CameraControls>(null);
  useEffect(() => {
    const v = VIEWS[view];
    ref.current?.setLookAt(...(v.cam as unknown as V3), ...(v.target as unknown as V3), true);
  }, [view]);
  return <CameraControls ref={ref} minDistance={0.8} maxDistance={14} maxPolarAngle={Math.PI / 2.05} truckSpeed={0} smoothTime={0.6} />;
}

export default function RoomTour({ view, onPick, className }: { view: number; onPick: (i: number) => void; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>("0px");
  return (
    <div ref={ref} className={className}>
      <Canvas shadows dpr={[1, 1.75]} frameloop={inView ? "always" : "never"} camera={{ position: VIEWS[0].cam as unknown as V3, fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <hemisphereLight args={["#e0f2fe", "#fde68a", 0.6]} />
          <directionalLight position={[-2, 6, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} />
          <Furniture />
          <ScanIn run={inView} />
          <Hotspots view={view} onPick={onPick} />
          <Rig view={view} />
        </Suspense>
      </Canvas>
    </div>
  );
}
