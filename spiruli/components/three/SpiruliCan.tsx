"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { LABEL_H, LABEL_W, paintLabel, type FrontArt } from "@/lib/drawLabel";
import { makeCondensation } from "@/lib/condensation";
import { useCan } from "@/lib/canStore";
import { display, sans } from "@/lib/fonts";

/** Proportions taken from the product photo (label height ≈ 2.52 × diameter). */
export const CAN_R = 0.58;
const BODY_H = 2.92;
const TOP = BODY_H / 2;

/**
 * Scroll-driven offsets written by GSAP each frame; added on top of the
 * interactive pose so scrolling and dragging compose.
 */
export type Driven = { rotation: number; x: number; y: number; scale: number; tilt: number; pitch?: number };
export const restPose = (): Driven => ({ rotation: 0, x: 0, y: 0, scale: 1, tilt: 0 });

type Props = {
  driven?: Driven;
  /** Idle spin speed in rad/s when auto-spin is on. */
  spin?: number;
  interactive?: boolean;
};

function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.all([
      document.fonts.load(`300 100px ${display.style.fontFamily}`),
      document.fonts.load(`600 40px ${display.style.fontFamily}`),
      document.fonts.load(`700 40px ${sans.style.fontFamily}`),
      document.fonts.load(`600 40px ${sans.style.fontFamily}`),
      document.fonts.load(`800 40px ${sans.style.fontFamily}`),
    ])
      .catch(() => undefined)
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Painted swoosh baked from the product photo (scripts/bake-label.py). */
function useFrontArt() {
  const [art, setArt] = useState<FrontArt | null>(null);
  useEffect(() => {
    let alive = true;
    Promise.all([loadImage("/label/swoosh.webp"), loadImage("/label/swoosh-pbr.webp")])
      .then(([color, pbr]) => alive && setArt({ color, pbr, width: (color.naturalWidth * LABEL_H) / color.naturalHeight }))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);
  return art;
}

function useLabelTextures(ready: boolean, front: FrontArt | null) {
  const { gl } = useThree();
  const tex = useMemo(() => {
    // The colour map carries all the fine print, so it gets 2× resolution
    // (4096 px around the can) on larger screens; the PBR map stays at 1×.
    const max = gl.capabilities.maxTextureSize / LABEL_W;
    const colorScale = Math.min(max, window.innerWidth < 768 ? 1.5 : 2);
    const make = (scale: number) => {
      const c = document.createElement("canvas");
      c.width = Math.round(LABEL_W * scale);
      c.height = Math.round(LABEL_H * scale);
      return new THREE.CanvasTexture(c);
    };
    const color = make(colorScale);
    color.colorSpace = THREE.SRGBColorSpace;
    color.userData.scale = colorScale;
    const pbr = make(1);
    const aniso = gl.capabilities.getMaxAnisotropy();
    color.anisotropy = pbr.anisotropy = aniso;
    const drops = new THREE.CanvasTexture(makeCondensation());
    drops.wrapS = drops.wrapT = THREE.RepeatWrapping;
    drops.repeat.set(3, 2);
    return { color, pbr, drops };
  }, [gl]);

  useEffect(() => {
    const fonts = { display: display.style.fontFamily, sans: sans.style.fontFamily };
    paintLabel((tex.color.image as HTMLCanvasElement).getContext("2d")!, "color", fonts, front, tex.color.userData.scale);
    paintLabel((tex.pbr.image as HTMLCanvasElement).getContext("2d")!, "pbr", fonts, front);
    tex.color.needsUpdate = true;
    tex.pbr.needsUpdate = true;
  }, [tex, ready, front]);

  useEffect(
    () => () => {
      tex.color.dispose();
      tex.pbr.dispose();
      tex.drops.dispose();
    },
    [tex],
  );
  return tex;
}

function lathe(points: [number, number][], segments = 192) {
  return new THREE.LatheGeometry(
    points.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
}

function makeTabShape() {
  const s = new THREE.Shape();
  const w = 0.17;
  const h = 0.3;
  const r = 0.07;
  s.moveTo(-w + r, -h / 2);
  s.lineTo(w - r, -h / 2);
  s.quadraticCurveTo(w, -h / 2, w, -h / 2 + r);
  s.lineTo(w, h / 2 - r);
  s.quadraticCurveTo(w, h / 2, w - r, h / 2);
  s.lineTo(-w + r, h / 2);
  s.quadraticCurveTo(-w, h / 2, -w, h / 2 - r);
  s.lineTo(-w, -h / 2 + r);
  s.quadraticCurveTo(-w, -h / 2, -w + r, -h / 2);
  const hole = new THREE.Path();
  hole.absellipse(0, 0.06, 0.1, 0.06, 0, Math.PI * 2, false, 0);
  s.holes.push(hole);
  return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.004, bevelSegments: 3 });
}

/** Shortest-path target angle that is a multiple of 2π (+ offset). */
function nearestTurn(current: number, offset: number) {
  const turns = Math.round((current - offset) / (Math.PI * 2));
  return turns * Math.PI * 2 + offset;
}

export default function SpiruliCan({ driven, spin = 0.5, interactive = true }: Props) {
  const tiltGroup = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const ready = useFontsReady();
  const front = useFrontArt();
  const label = useLabelTextures(ready, front);
  const { chilled, autoSpin, face } = useCan((s) => s);

  const geo = useMemo(
    () => ({
      body: new THREE.CylinderGeometry(CAN_R, CAN_R, BODY_H, 256, 1, true, Math.PI, Math.PI * 2),
      // Domed base with a standing ring.
      bottom: lathe([
        [0, -TOP - 0.03],
        [0.2, -TOP - 0.036],
        [0.35, -TOP - 0.052],
        [0.42, -TOP - 0.078],
        [0.445, -TOP - 0.093],
        [0.47, -TOP - 0.097],
        [0.5, -TOP - 0.09],
        [0.54, -TOP - 0.074],
        [0.565, -TOP - 0.048],
        [0.578, -TOP - 0.02],
        [CAN_R, -TOP],
      ]),
      // Shoulder, neck, rolled rim and the recessed lid panel.
      shoulder: lathe([
        [CAN_R, TOP],
        [0.579, TOP + 0.02],
        [0.572, TOP + 0.05],
        [0.556, TOP + 0.085],
        [0.535, TOP + 0.115],
        [0.515, TOP + 0.14],
        [0.506, TOP + 0.156],
        [0.507, TOP + 0.166],
        [0.512, TOP + 0.174],
        [0.514, TOP + 0.182],
        [0.51, TOP + 0.19],
        [0.502, TOP + 0.193],
        [0.495, TOP + 0.188],
        [0.492, TOP + 0.176],
        [0.489, TOP + 0.152],
        [0.48, TOP + 0.138],
        [0.468, TOP + 0.14],
        [0.455, TOP + 0.145],
        [0, TOP + 0.145],
      ]),
      tab: makeTabShape(),
    }),
    [],
  );

  const alu = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        // Polished aluminium: bright, low roughness, slightly brushed.
        color: "#f1f3f5",
        metalness: 1,
        roughness: 0.13,
        anisotropy: 0.55,
        clearcoat: 0.3,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.7,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const labelMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: label.color,
        // The artwork also drives emission so the can keeps the photo's
        // colours; scene lights only add shape and highlights on top.
        emissive: new THREE.Color("#ffffff"),
        emissiveMap: label.color,
        emissiveIntensity: 0.52,
        toneMapped: false,
        roughnessMap: label.pbr,
        metalnessMap: label.pbr,
        roughness: 1,
        metalness: 1,
        clearcoat: 0.12,
        clearcoatRoughness: 0.45,
        clearcoatNormalMap: label.drops,
        clearcoatNormalScale: new THREE.Vector2(0, 0),
        envMapIntensity: 0.45,
      }),
    [label],
  );

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
    snap: null as number | null,
    wet: chilled ? 1 : 0,
  });

  useEffect(() => {
    if (face.n === 0) return;
    const s = sim.current;
    s.snap = nearestTurn(s.rotY, face.side === "back" ? Math.PI : 0);
  }, [face]);

  const { gl } = useThree();
  useEffect(() => {
    if (!interactive) return;
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
      s.idleUntil = performance.now() + 1400;
      gl.domElement.style.cursor = s.hover ? "grab" : "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl, interactive]);

  useFrame((state, delta) => {
    const s = sim.current;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const now = performance.now();

    if (!s.dragging) {
      const coasting = now < s.idleUntil;
      if (s.snap !== null) {
        s.velY += (s.snap - s.rotY) * 30 * dt;
        s.velY *= Math.exp(-8 * dt);
        if (Math.abs(s.snap - s.rotY) < 0.002 && Math.abs(s.velY) < 0.01) s.snap = null;
      } else if (s.hover && !coasting) {
        // Ease the spin down while the visitor inspects the can.
        s.velY = THREE.MathUtils.damp(s.velY, 0.08, 3, dt);
      } else {
        s.velY = THREE.MathUtils.damp(s.velY, autoSpin ? spin : 0, coasting ? 0.8 : 1.6, dt);
      }
      s.rotY += s.velY * dt;
    }

    // Spring tilt toward the pointer for a weighty, physical feel.
    const tx = s.hover ? -state.pointer.y * 0.25 : Math.sin(t * 0.7) * 0.04;
    const ty = s.hover ? state.pointer.x * 0.3 : 0;
    s.vTiltX += (tx - s.tiltX) * 80 * dt;
    s.vTiltY += (ty - s.tiltY) * 80 * dt;
    s.vTiltX *= Math.exp(-10 * dt);
    s.vTiltY *= Math.exp(-10 * dt);
    s.tiltX += s.vTiltX * dt;
    s.tiltY += s.vTiltY * dt;

    // Condensation beads up or evaporates gradually.
    s.wet = THREE.MathUtils.damp(s.wet, chilled ? 1 : 0, 1.4, dt);
    labelMat.clearcoatNormalScale.setScalar(s.wet * 0.6);
    labelMat.clearcoatRoughness = 0.45 - s.wet * 0.35;
    labelMat.clearcoat = 0.12 + s.wet * 0.6;
    alu.roughness = 0.13 + s.wet * 0.12;

    const d = driven ?? restPose();
    if (group.current && tiltGroup.current) {
      group.current.rotation.y = s.rotY + d.rotation;
      group.current.position.y = Math.sin(t * 1.1) * 0.05 + d.y;
      group.current.position.x = d.x;
      group.current.scale.setScalar(d.scale);
      group.current.rotation.z = Math.sin(t * 0.5) * 0.025 + d.tilt;
      tiltGroup.current.rotation.x = s.tiltX + 0.08 + (d.pitch ?? 0);
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
    s.snap = null;
    s.lastX = e.nativeEvent.clientX;
    s.lastT = performance.now();
    gl.domElement.style.cursor = "grabbing";
  };

  return (
    <group ref={tiltGroup}>
      <group ref={group}>
        {interactive && (
          // Hit area slightly larger than the can for forgiving hover.
          <mesh onPointerOver={onOver} onPointerOut={onOut} onPointerDown={onDown}>
            <cylinderGeometry args={[CAN_R * 1.35, CAN_R * 1.35, BODY_H + 0.8, 24]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
        <mesh geometry={geo.body} material={labelMat} />
        <mesh geometry={geo.bottom} material={alu} />
        <mesh geometry={geo.shoulder} material={alu} />
        {/* Pull tab and rivet */}
        <mesh geometry={geo.tab} material={alu} position={[0, TOP + 0.152, 0.02]} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh material={alu} position={[0, TOP + 0.155, 0.06]}>
          <cylinderGeometry args={[0.035, 0.04, 0.02, 32]} />
        </mesh>
        {/* Score line of the opening */}
        <mesh position={[0, TOP + 0.147, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.004, 8, 64, Math.PI * 1.2]} />
          <meshStandardMaterial color="#8d9398" metalness={1} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
