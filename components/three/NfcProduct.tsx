"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { DISC, paintBack, paintFront, paintInlay, type FaceOptions } from "@/lib/drawNfc";
import { sans, serif } from "@/lib/fonts";
import type { Lang, Theme } from "@/lib/pricing";

export type ProductLook = { theme: Theme; lang: Lang; business: string };

type Props = ProductLook & {
  /** Separates the acrylic layers to reveal the NFC inlay. */
  exploded?: boolean;
  /** Idle spin speed in rad/s. */
  spin?: number;
  /**
   * External, per-frame control (e.g. scroll-scrubbed). When given, it drives the explode
   * amount (0–1), yaw and tilt instead of the built-in spin and drag.
   */
  control?: { current: { explode: number; yaw: number; tilt: number } };
  /** Disable the gentle up/down float and pointer tilt. */
  still?: boolean;
};

const BEVEL = 0.014;

/** Waits until the brand fonts are usable on canvas, then flips to true. */
function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const families = [sans.style.fontFamily, serif.style.fontFamily];
    Promise.all(families.flatMap((f) => [document.fonts.load(`500 64px ${f}`), document.fonts.load(`700 64px ${f}`)]))
      .catch(() => undefined)
      .then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

/** Flat circular face; CircleGeometry already maps UVs across the full texture. */
const makeFace = () => new THREE.CircleGeometry(DISC.radius, 128);

const discShape = () => new THREE.Shape().absarc(0, 0, DISC.radius, 0, Math.PI * 2, false);

function useCanvasTexture(px: number) {
  const gl = useThree((s) => s.gl);
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = px;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = gl.capabilities.getMaxAnisotropy();
    return t;
  }, [px, gl]);
}

const paint = (t: THREE.CanvasTexture, fn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
  const c = t.image as HTMLCanvasElement;
  fn(c.getContext("2d")!, c.width, c.height);
  t.needsUpdate = true;
};

/** Body/edge material per colour: frosted white acrylic or glossy black. */
function bodyMaterial(theme: Theme) {
  if (theme === "black")
    return new THREE.MeshPhysicalMaterial({ color: "#151619", metalness: 0.3, roughness: 0.35, clearcoat: 1 });
  return new THREE.MeshPhysicalMaterial({
    color: "#f3f6fa",
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.88,
  });
}

export default function NfcProduct({ theme, lang, business, exploded = false, spin = 0.35, control, still = false }: Props) {
  const fontsReady = useFontsReady();
  const half = DISC.depth / 2;

  const front = useCanvasTexture(DISC.px);
  const back = useCanvasTexture(DISC.px);
  const inlay = useCanvasTexture(DISC.px);

  // Repaint artwork whenever the look changes (and once more when fonts arrive).
  useEffect(() => {
    const o: FaceOptions = { theme, lang, business, sans: sans.style.fontFamily, serif: serif.style.fontFamily };
    paint(front, (ctx, w, h) => paintFront(ctx, w, h, o));
    paint(back, (ctx, w, h) => paintBack(ctx, w, h, o));
    paint(inlay, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      paintInlay(ctx, w, h);
    });
  }, [theme, lang, business, fontsReady, front, back, inlay]);

  const geometries = useMemo(() => {
    const body = new THREE.ExtrudeGeometry(discShape(), {
      depth: half,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 3,
      curveSegments: 96,
    });
    return { body, face: makeFace() };
  }, [half]);

  const materials = useMemo(
    () => ({
      body: bodyMaterial(theme),
      // Low reflection keeps the printed colours saturated against the light page.
      front: new THREE.MeshPhysicalMaterial({ map: front, roughness: 0.45, clearcoat: 0.35, clearcoatRoughness: 0.2, envMapIntensity: 0.35 }),
      back: new THREE.MeshPhysicalMaterial({ map: back, roughness: 0.45, clearcoat: 0.35, envMapIntensity: 0.35 }),
      inlay: new THREE.MeshStandardMaterial({
        map: inlay,
        transparent: true,
        side: THREE.DoubleSide,
        metalness: 0.55,
        roughness: 0.35,
        depthWrite: false,
      }),
    }),
    [theme, front, back, inlay],
  );

  useEffect(
    () => () => {
      geometries.body.dispose();
      geometries.face.dispose();
    },
    [geometries],
  );
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  // ---- Interaction: idle spin, drag-to-spin with inertia, pointer tilt. ----
  const root = useRef<THREE.Group>(null);
  const frontLayer = useRef<THREE.Group>(null);
  const backLayer = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, lastX: 0, velocity: 0 });
  const yaw = useRef(-0.35);
  const explode = useRef(0);

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    document.body.style.cursor = "grabbing";
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    yaw.current += dx * 0.012;
    drag.current.velocity = dx * 0.6;
  };
  const onUp = () => {
    drag.current.active = false;
    document.body.style.cursor = "";
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const d = drag.current;
    if (control) {
      const c = control.current;
      yaw.current = THREE.MathUtils.damp(yaw.current, c.yaw, 6, dt);
      explode.current = THREE.MathUtils.damp(explode.current, c.explode, 8, dt);
    } else if (!d.active) {
      if (exploded && Math.abs(d.velocity) < 0.05) {
        // Exploded view: settle at the nearest three-quarter angle so the layers separate visibly.
        const target = Math.round((yaw.current + 1.15) / (Math.PI * 2)) * Math.PI * 2 - 1.15;
        yaw.current = THREE.MathUtils.damp(yaw.current, target, 3, dt);
      } else {
        yaw.current += (spin + d.velocity) * dt;
      }
      d.velocity *= Math.pow(0.04, dt);
    }
    if (!control) explode.current = THREE.MathUtils.damp(explode.current, exploded ? 1 : 0, 5, dt);
    const g = root.current;
    if (g) {
      g.rotation.y = yaw.current;
      // The exploded view tips the product forward so the separated layers read clearly.
      const tilt = control ? control.current.tilt : (still ? 0 : -state.pointer.y * 0.25) + explode.current * 0.3;
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tilt, 4, dt);
      g.position.y = still ? 0 : Math.sin(state.clock.elapsedTime * 1.1) * 0.06;
    }
    const gap = explode.current * 0.95;
    if (frontLayer.current) frontLayer.current.position.z = gap;
    if (backLayer.current) backLayer.current.position.z = -gap;
  });

  const faceZ = half + BEVEL + 0.001;

  return (
    <group
      ref={root}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerOver={() => (document.body.style.cursor = "grab")}
      onPointerOut={() => !drag.current.active && (document.body.style.cursor = "")}
    >
      {/* Front acrylic half with the printed Google review artwork. */}
      <group ref={frontLayer}>
        <mesh geometry={geometries.body} material={materials.body} />
        <mesh geometry={geometries.face} material={materials.front} position-z={faceZ} />
      </group>

      {/* Embedded NFC inlay: copper coil and NTAG chip between the two halves. */}
      <group>
        <mesh geometry={geometries.face} material={materials.inlay} scale={0.98} />
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[0.2, 0.2, 0.02]} />
          <meshStandardMaterial color="#111317" metalness={0.6} roughness={0.25} />
        </mesh>
      </group>

      {/* Back half, rotated so its artwork reads correctly from behind. */}
      <group ref={backLayer}>
        <mesh geometry={geometries.body} material={materials.body} position-z={-half} />
        <mesh geometry={geometries.face} material={materials.back} position-z={-faceZ} rotation-y={Math.PI} />
      </group>

    </group>
  );
}
