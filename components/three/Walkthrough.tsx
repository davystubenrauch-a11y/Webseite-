"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export type Room = {
  id: string;
  label: string;
  node: [number, number, number];
  cam: [number, number, number];
  look: [number, number, number];
};

export const rooms: Room[] = [
  { id: "overview", label: "Overview", node: [0, 0, 0], cam: [8, 9, 9.6], look: [0, -0.4, 0] },
  { id: "living", label: "Living Room", node: [-1.6, 0.9, 1.2], cam: [1.4, 2.2, 4.4], look: [-1.8, 0.4, 0.6] },
  { id: "kitchen", label: "Kitchen", node: [2, 0.9, 1.4], cam: [-0.6, 2.2, 3.8], look: [2.2, 0.5, 0.4] },
  { id: "bedroom", label: "Suite", node: [-1.8, 0.9, -1.8], cam: [1.2, 2, -0.2], look: [-2, 0.4, -2.2] },
  { id: "terrace", label: "Terrace", node: [2.2, 0.9, -1.9], cam: [4.8, 2.4, 0.6], look: [2, 0.2, -2.2] },
];

const wall = "#E8E1D3";
const wood = "#8B6A43";
const navy = "#1E2A3E";
const gold = "#C5A059";

function Box({ p, s, c, r = 0.04, ...rest }: { p: [number, number, number]; s: [number, number, number]; c: string; r?: number; metal?: boolean }) {
  return (
    <RoundedBox position={p} args={s} radius={r} smoothness={3} castShadow receiveShadow>
      <meshStandardMaterial color={c} roughness={rest.metal ? 0.25 : 0.7} metalness={rest.metal ? 1 : 0} />
    </RoundedBox>
  );
}

function Plant({ p }: { p: [number, number, number] }) {
  return (
    <group position={p}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.11, 0.36, 24]} />
        <meshStandardMaterial color={gold} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="#2F5D46" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

function Apartment() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#C9B79A" roughness={0.55} />
      </mesh>
      {/* Terrace deck */}
      <mesh rotation-x={-Math.PI / 2} position={[2.25, 0.01, -2]} receiveShadow>
        <planeGeometry args={[4.5, 3]} />
        <meshStandardMaterial color="#6E5236" roughness={0.8} />
      </mesh>
      {/* Walls */}
      <Box p={[0, 0.8, -3.5]} s={[9, 1.6, 0.12]} c={wall} r={0.02} />
      <Box p={[-4.5, 0.8, 0]} s={[0.12, 1.6, 7]} c={wall} r={0.02} />
      <Box p={[-0.1, 0.8, -1.7]} s={[0.12, 1.6, 3.4]} c={wall} r={0.02} />
      <Box p={[-2.3, 0.8, -0.2]} s={[4.3, 1.6, 0.12]} c={wall} r={0.02} />
      {/* Glass rail on the terrace */}
      <mesh position={[4.5, 0.45, -2]}>
        <boxGeometry args={[0.04, 0.9, 3]} />
        <meshPhysicalMaterial transmission={1} roughness={0.05} thickness={0.1} color="#BFD4FF" />
      </mesh>

      {/* Living */}
      <Box p={[-2.6, 0.25, 1.9]} s={[2.2, 0.5, 0.9]} c={navy} r={0.12} />
      <Box p={[-2.6, 0.55, 2.3]} s={[2.2, 0.6, 0.2]} c={navy} r={0.08} />
      <Box p={[-2.6, 0.18, 0.7]} s={[1.2, 0.08, 0.7]} c={gold} metal />
      <Box p={[-4.2, 0.6, 1]} s={[0.12, 0.8, 1.6]} c="#111" r={0.02} />
      <Plant p={[-4, 0, 2.8]} />

      {/* Kitchen */}
      <Box p={[2, 0.45, 0.9]} s={[2.4, 0.9, 0.9]} c="#F3EEE4" />
      <Box p={[2, 0.92, 0.9]} s={[2.5, 0.05, 1]} c="#2B2B2B" r={0.02} />
      {[1.3, 2, 2.7].map((x) => (
        <Box key={x} p={[x, 0.35, 1.7]} s={[0.35, 0.7, 0.35]} c={gold} metal r={0.08} />
      ))}
      <Box p={[3.4, 0.9, 2.8]} s={[1.6, 1.8, 0.6]} c="#F3EEE4" />

      {/* Bedroom */}
      <Box p={[-2.4, 0.25, -2.2]} s={[2, 0.4, 2.2]} c="#F7F3EA" r={0.1} />
      <Box p={[-2.4, 0.5, -3.2]} s={[2.2, 0.9, 0.15]} c={navy} r={0.05} />
      <Box p={[-2.4, 0.48, -1.6]} s={[2, 0.08, 0.9]} c={gold} />
      <Plant p={[-0.8, 0, -3]} />

      {/* Terrace */}
      <Box p={[2.4, 0.3, -2]} s={[1.2, 0.08, 1.2]} c="#F3EEE4" r={0.03} />
      <mesh position={[3.6, 0.3, -2.6]}>
        <boxGeometry args={[1.2, 0.04, 1]} />
        <meshStandardMaterial color="#3B7BFF" emissive="#2563EB" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
      <Plant p={[1.2, 0, -3]} />
    </group>
  );
}

function Node({ room, active, onSelect }: { room: Room; active: boolean; onSelect: () => void }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ring.current) return;
    const t = (state.clock.elapsedTime * 0.8) % 1;
    ring.current.scale.setScalar(1 + t * 1.8);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.8;
  });
  if (room.id === "overview") return null;
  return (
    <group position={room.node}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <sphereGeometry args={[active ? 0.13 : 0.1, 32, 32]} />
        <meshBasicMaterial color={active ? "#F3E2A9" : "#D4AF37"} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.14, 0.17, 48]} />
        <meshBasicMaterial color={active ? "#3B7BFF" : "#D4AF37"} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.9, 6]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Rig({ room }: { room: Room }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(...room.look));
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    target.set(...room.cam);
    // Slow cinematic dolly drift around each vantage point.
    target.x += Math.sin(t * 0.25) * 0.25;
    target.y += Math.sin(t * 0.18) * 0.08;
    lookTarget.set(...room.look);
    const k = 1 - Math.exp(-delta * 1.8);
    camera.position.lerp(target, k);
    look.current.lerp(lookTarget, k);
    camera.lookAt(look.current);
  });
  return null;
}

export default function Walkthrough({ roomId, onSelect, active }: { roomId: string; onSelect: (id: string) => void; active: boolean }) {
  const room = rooms.find((r) => r.id === roomId) ?? rooms[0];
  useEffect(() => () => {
    document.body.style.cursor = "";
  }, []);
  return (
    <Canvas
      shadows
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [8, 9, 9.6], fov: 40 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#0d121a"]} />
      <fog attach="fog" args={["#0d121a", 12, 24]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 9, 4]} intensity={2.2} color="#FFE7BF" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} />
      <pointLight position={[-2.5, 1.4, 1.4]} intensity={4} color="#FFC77A" distance={4} />
      <pointLight position={[2.2, 1.6, 1]} intensity={3} color="#9DB8FF" distance={4} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#FFF3E0" />
        <Lightformer form="rect" intensity={1.5} position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#2563EB" />
      </Environment>
      <Apartment />
      <ContactShadows position={[0, 0.005, 0]} opacity={0.4} scale={12} blur={2.4} far={3} />
      {rooms.map((r) => (
        <Node key={r.id} room={r} active={r.id === room.id} onSelect={() => onSelect(r.id)} />
      ))}
      <Rig room={room} />
    </Canvas>
  );
}
