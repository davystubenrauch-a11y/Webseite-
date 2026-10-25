"use client";

import { useEffect, useRef } from "react";
import { KEYS, ZERO, useChoreography, type Pose } from "./choreography";

/**
 * Photoreal can: a 360° turntable pre-rendered with Blender Cycles
 * (scripts/render_can.py), played back as an image sequence. The scroll
 * choreography picks the frame (spin) and moves, scales and tilts the image.
 */
export const FRAMES = 60;
const src = (i: number) => `/can/frame-${String(i).padStart(3, "0")}.webp`;

/** Can height on screen at scale 1, as a fraction of the viewport height. */
const HEIGHT_VH = 0.7;

const damp = (a: number, b: number, lambda: number, dt: number) => a + (b - a) * (1 - Math.exp(-lambda * dt));

export default function CanSequence() {
  const target = useChoreography();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const frames: HTMLImageElement[] = [];
    // Load the front first, then the rest in turn order outward from it.
    const order = [0];
    for (let k = 1; k <= FRAMES / 2; k++) order.push(k % FRAMES, (FRAMES - k) % FRAMES);
    for (const i of new Set(order)) {
      const img = new Image();
      img.decoding = "async";
      img.src = src(i);
      frames[i] = img;
    }

    const current: Pose = { ...ZERO, y: 1.6, s: 0.8 };
    const pointer = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move);

    let raf = 0;
    let last = performance.now();
    let drawn = -1;
    let ready = false;
    const start = last;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      for (const k of KEYS) current[k] = damp(current[k], target.current[k], 4.5, dt);
      const t = (now - start) / 1000;

      // Spin → frame, with a slow idle turn and a little pointer parallax.
      const turn = current.ry + t * 0.18 + pointer.x * 0.5;
      const idx = ((Math.round((turn / (Math.PI * 2)) * FRAMES) % FRAMES) + FRAMES) % FRAMES;
      // Nearest loaded frame, so the can never blinks while frames stream in.
      let pick = idx;
      for (let d = 0; d < FRAMES && !(frames[pick]?.complete && frames[pick].naturalWidth); d++) {
        pick = (idx + (d % 2 ? -1 : 1) * Math.ceil(d / 2) + FRAMES) % FRAMES;
      }
      const img = frames[pick];
      if (img?.complete && img.naturalWidth && pick !== drawn) {
        if (el.width !== img.naturalWidth) {
          el.width = img.naturalWidth;
          el.height = img.naturalHeight;
        }
        ctx.clearRect(0, 0, el.width, el.height);
        ctx.drawImage(img, 0, 0);
        drawn = pick;
        ready = true;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const h = vh * HEIGHT_VH * current.s;
      el.style.height = `${h}px`;
      el.style.opacity = ready ? String(Math.max(0, Math.min(1, current.o))) : "0";
      // Pitch has no image equivalent; a slight vertical squash suggests it.
      const pitch = Math.cos(Math.min(Math.abs(current.rx + pointer.y * 0.15), 1.2) * 0.35);
      el.style.transform =
        `translate(-50%, -50%) translate(${(current.x * vw) / 2}px, ${(-current.y * vh) / 2 + Math.sin(t * 1.1) * 6}px) ` +
        `rotate(${-current.rz - Math.sin(t * 0.5) * 0.025}rad) scaleY(${pitch})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, [target]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <canvas ref={canvas} className="absolute left-1/2 top-1/2 w-auto max-w-none opacity-0 will-change-transform" />
    </div>
  );
}
