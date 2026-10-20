"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { finishes, useCard } from "@/lib/cardStore";
import { paintBack, paintFront, type FaceOptions } from "@/lib/drawCard";
import { serif, sans } from "@/lib/fonts";
import { site } from "@/lib/site";

export const CARD_RADIUS = 1.5;
const THICKNESS = 0.07;
const TEX = 2048;

export type ScrollState = { progress: number };

type Props = {
  /** Idle spin speed in rad/s. */
  spin?: number;
  /** Optional scroll-driven transform, written to by GSAP. */
  scroll?: ScrollState;
  /** Honour the store's flip flag (customizer). */
  followFlip?: boolean;
};

function makeCanvas() {
  const c = document.createElement("canvas");
  c.width = c.height = TEX;
  return c;
}

function makeBrushedTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 1400; i++) {
    const y = Math.random() * c.height;
    const v = 90 + Math.random() * 90;
    ctx.strokeStyle = `rgba(${v},${v},${v},${0.25 + Math.random() * 0.4})`;
    ctx.lineWidth = Math.random() * 1.2 + 0.2;
    const x = Math.random() * c.width;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 80 + Math.random() * 400, y);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 1);
  return t;
}

function useFaceTextures(paint: typeof paintFront, opts: FaceOptions, ready: boolean) {
  const { gl } = useThree();
  const tex = useMemo(() => {
    const color = new THREE.CanvasTexture(makeCanvas());
    color.colorSpace = THREE.SRGBColorSpace;
    const pbr = new THREE.CanvasTexture(makeCanvas());
    const aniso = gl.capabilities.getMaxAnisotropy();
    color.anisotropy = pbr.anisotropy = aniso;
    return { color, pbr };
  }, [gl]);

  const { name, tagline, finish, serif: sf, sans: ss, qrUrl } = opts;
  useEffect(() => {
    const o = { name, tagline, finish, serif: sf, sans: ss, qrUrl };
    const c1 = (tex.color.image as HTMLCanvasElement).getContext("2d")!;
    const c2 = (tex.pbr.image as HTMLCanvasElement).getContext("2d")!;
    paint(c1, TEX, o, "color");
    paint(c2, TEX, o, "pbr");
    tex.color.needsUpdate = true;
    tex.pbr.needsUpdate = true;
  }, [paint, tex, name, tagline, finish, sf, ss, qrUrl, ready]);

  useEffect(() => () => {
    tex.color.dispose();
    tex.pbr.dispose();
  }, [tex]);

  return tex;
}

function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.all([
      document.fonts.load(`600 100px ${serif.style.fontFamily}`),
      document.fonts.load(`italic 600 100px ${serif.style.fontFamily}`),
      document.fonts.load(`600 40px ${sans.style.fontFamily}`),
      document.fonts.load(`700 40px ${sans.style.fontFamily}`),
    ])
      .catch(() => undefined)
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

/** Shortest-path target angle that is a multiple of 2π (+ offset). */
function nearestTurn(current: number, offset: number) {
  const turns = Math.round((current - offset) / (Math.PI * 2));
  return turns * Math.PI * 2 + offset;
}

export default function ReviewCard({ spin = 0.45, scroll, followFlip = false }: Props) {
  const group = useRef<THREE.Group>(null);
  const tiltGroup = useRef<THREE.Group>(null);
  const { name, tagline, finish, flipped } = useCard((s) => s);
  const ready = useFontsReady();

  const opts: FaceOptions = {
    name,
    tagline,
    finish,
    serif: serif.style.fontFamily,
    sans: sans.style.fontFamily,
    qrUrl: site.demoReviewUrl,
  };
  const front = useFaceTextures(paintFront, opts, ready);
  const back = useFaceTextures(paintBack, opts, ready);
  const brushed = useMemo(() => makeBrushedTexture(), []);

  const rimMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        metalness: 1,
        roughness: 0.32,
        roughnessMap: brushed,
        bumpMap: brushed,
        bumpScale: 0.6,
        anisotropy: 0.85,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.4,
      }),
    [brushed],
  );
  useEffect(() => {
    rimMat.color.set(finishes[finish].rim);
  }, [finish, rimMat]);

  // Physics state — kept outside React to avoid re-renders per frame.
  const sim = useRef({
    rotY: 0,
    velY: spin,
    tiltX: 0,
    tiltY: 0,
    vTiltX: 0,
    vTiltY: 0,
    hover: false,
    dragging: false,
    lastX: 0,
    lastT: 0,
    idleUntil: 0,
  });

  const { gl } = useThree();
  useEffect(() => {
    const s = sim.current;
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - s.lastT) / 1000;
      const dx = e.clientX - s.lastX;
      s.rotY += dx * 0.012;
      s.velY = THREE.MathUtils.clamp((dx * 0.012) / dt, -14, 14);
      s.lastX = e.clientX;
      s.lastT = now;
    };
    const up = () => {
      if (!s.dragging) return;
      s.dragging = false;
      s.idleUntil = performance.now() + 1200;
      gl.domElement.style.cursor = s.hover ? "grab" : "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const s = sim.current;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const now = performance.now();

    if (!s.dragging) {
      const coasting = now < s.idleUntil;
      if (s.hover && !coasting) {
        // Settle to a readable face while the visitor inspects the card.
        const target = nearestTurn(s.rotY, followFlip && flipped ? Math.PI : 0);
        const k = 28;
        s.velY += (target - s.rotY) * k * dt;
        s.velY *= Math.exp(-7 * dt);
      } else if (followFlip && !coasting) {
        const target = nearestTurn(s.rotY, flipped ? Math.PI : 0) + Math.sin(t * 0.6) * 0.35;
        s.velY += (target - s.rotY) * 10 * dt;
        s.velY *= Math.exp(-5 * dt);
      } else {
        s.velY = THREE.MathUtils.damp(s.velY, spin, coasting ? 0.8 : 1.6, dt);
      }
      s.rotY += s.velY * dt;
    }

    // Spring tilt toward the pointer for a physical, weighty feel.
    const px = state.pointer.x;
    const py = state.pointer.y;
    const tx = s.hover ? -py * 0.42 : Math.sin(t * 0.7) * 0.06;
    const ty = s.hover ? px * 0.5 : 0;
    const k = 90;
    const damping = 10;
    s.vTiltX += (tx - s.tiltX) * k * dt;
    s.vTiltY += (ty - s.tiltY) * k * dt;
    s.vTiltX *= Math.exp(-damping * dt);
    s.vTiltY *= Math.exp(-damping * dt);
    s.tiltX += s.vTiltX * dt;
    s.tiltY += s.vTiltY * dt;

    if (group.current && tiltGroup.current) {
      const p = scroll?.progress ?? 0;
      group.current.rotation.y = s.rotY + p * Math.PI * 1.2;
      group.current.rotation.z = Math.sin(t * 0.5) * 0.03 + p * 0.25;
      group.current.position.y = Math.sin(t * 1.1) * 0.06 - p * 0.6;
      group.current.position.x = p * 0.8;
      const scale = 1 - p * 0.25;
      group.current.scale.setScalar(scale);
      tiltGroup.current.rotation.x = s.tiltX + p * 0.5;
      tiltGroup.current.rotation.y = s.tiltY;
    }
  });

  const onOver = () => {
    sim.current.hover = true;
    gl.domElement.style.cursor = "grab";
  };
  const onOut = () => {
    sim.current.hover = false;
    if (!sim.current.dragging) gl.domElement.style.cursor = "";
  };
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const s = sim.current;
    s.dragging = true;
    s.lastX = e.nativeEvent.clientX;
    s.lastT = performance.now();
    gl.domElement.style.cursor = "grabbing";
  };

  return (
    <group ref={tiltGroup}>
      <group ref={group}>
        {/* Hit area slightly larger than the card for forgiving hover. */}
        <mesh onPointerOver={onOver} onPointerOut={onOut} onPointerDown={onDown}>
          <circleGeometry args={[CARD_RADIUS * 1.12, 48]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>

        {/* Front face */}
        <mesh position={[0, 0, THICKNESS / 2 + 0.0005]} castShadow>
          <circleGeometry args={[CARD_RADIUS, 128]} />
          <meshPhysicalMaterial
            map={front.color}
            roughnessMap={front.pbr}
            metalnessMap={front.pbr}
            roughness={1}
            metalness={1}
            clearcoat={0.55}
            clearcoatRoughness={0.18}
            envMapIntensity={1.1}
          />
        </mesh>

        {/* Back face */}
        <mesh position={[0, 0, -THICKNESS / 2 - 0.0005]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[CARD_RADIUS, 128]} />
          <meshPhysicalMaterial
            map={back.color}
            roughnessMap={back.pbr}
            metalnessMap={back.pbr}
            roughness={1}
            metalness={1}
            clearcoat={0.55}
            clearcoatRoughness={0.18}
            envMapIntensity={1.1}
          />
        </mesh>

        {/* Brushed metal edge + raised bezels */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={rimMat}>
          <cylinderGeometry args={[CARD_RADIUS + 0.012, CARD_RADIUS + 0.012, THICKNESS, 128, 1, true]} />
        </mesh>
        <mesh position={[0, 0, THICKNESS / 2]} material={rimMat}>
          <torusGeometry args={[CARD_RADIUS, 0.03, 24, 160]} />
        </mesh>
        <mesh position={[0, 0, -THICKNESS / 2]} material={rimMat}>
          <torusGeometry args={[CARD_RADIUS, 0.03, 24, 160]} />
        </mesh>
      </group>
    </group>
  );
}
