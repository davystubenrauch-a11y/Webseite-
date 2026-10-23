"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import SpiruliCan, { restPose } from "@/components/three/SpiruliCan";
import Studio from "@/components/three/Studio";

/**
 * Pose of the can for a section, read from its data-can attribute.
 * x, y: position as a fraction of the half viewport (y up), s: scale,
 * ry / rx / rz: rotation in radians (spin, pitch, roll).
 */
export type Pose = { x: number; y: number; s: number; ry: number; rx: number; rz: number };
const ZERO: Pose = { x: 0, y: 0, s: 1, ry: 0, rx: 0, rz: 0 };
const KEYS = ["x", "y", "s", "ry", "rx", "rz"] as const;

const ease = (t: number) => t * t * (3 - 2 * t);

/** Collects section anchors and turns the scroll position into a target pose. */
function useChoreography() {
  const target = useRef<Pose>({ ...ZERO, y: 1.6 });

  useEffect(() => {
    let anchors: { top: number; pose: Pose }[] = [];
    const measure = () => {
      const mobile = window.innerWidth < 768;
      anchors = [...document.querySelectorAll<HTMLElement>("[data-can]")].map((el) => {
        const p = { ...ZERO, ...JSON.parse(el.dataset.can!) } as Pose;
        // Narrow screens: centred poses shrink a little; side poses (content
        // sections) move to the screen edge so the can only peeks in.
        if (mobile) {
          if (Math.abs(p.x) >= 0.5) Object.assign(p, { x: Math.sign(p.x) * 1.4, s: p.s * 0.55 });
          else Object.assign(p, { x: p.x * 0.35, s: p.s * 0.72 });
        }
        return { top: el.getBoundingClientRect().top + window.scrollY, pose: p };
      });
      update();
    };
    const update = () => {
      if (!anchors.length) return;
      const y = window.scrollY;
      let i = 0;
      while (i < anchors.length - 1 && y >= anchors[i + 1].top) i++;
      const a = anchors[i];
      const b = anchors[Math.min(i + 1, anchors.length - 1)];
      const span = b.top - a.top;
      const t = span > 0 ? ease(THREE.MathUtils.clamp((y - a.top) / span, 0, 1)) : 0;
      for (const k of KEYS) target.current[k] = THREE.MathUtils.lerp(a.pose[k], b.pose[k], t);
    };

    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    document.fonts?.ready.then(measure);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  return target;
}

function Rig({ target }: { target: React.MutableRefObject<Pose> }) {
  const viewport = useThree((s) => s.viewport);
  const current = useRef<Pose>({ ...ZERO, y: 1.6, s: 0.8 });
  const driven = useRef(restPose()).current;
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const c = current.current;
    for (const k of KEYS) c[k] = THREE.MathUtils.damp(c[k], target.current[k], 4.5, dt);
    const t = state.clock.elapsedTime;
    driven.x = (c.x * viewport.width) / 2;
    driven.y = (c.y * viewport.height) / 2;
    driven.scale = c.s;
    // A slow idle turn plus a little pointer parallax keeps it alive.
    driven.rotation = c.ry + t * 0.18 + pointer.current.x * 0.5;
    driven.pitch = c.rx + pointer.current.y * 0.15;
    driven.tilt = c.rz;
  });

  return <SpiruliCan driven={driven} spin={0} interactive={false} />;
}

/** One can for the whole page, in a fixed layer that floats over the sections. */
export default function CanStage() {
  const target = useChoreography();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 30 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <Studio accent="#D7F25A" />
          <Rig target={target} />
        </Suspense>
      </Canvas>
    </div>
  );
}
