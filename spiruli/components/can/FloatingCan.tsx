"use client";

import { useEffect, useRef } from "react";

/** Pre-rendered half turn of the can (scripts/render_scenes.py --mode spin). */
export const FRAMES = 96;
const src = (i: number) => `/can/spin-${String(i).padStart(2, "0")}.webp`;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * One can for the whole page. It sits in the hero slot, glides into the intro
 * frame as you scroll, then travels with that section. Position and tilt are
 * eased towards the scroll target every frame, and the spin runs on time plus
 * smoothed scroll, so it never jumps with the scroll wheel.
 */
export default function FloatingCan() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const imgs: (HTMLImageElement | null)[] = Array(FRAMES).fill(null);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true;

    const load = (i: number) =>
      new Promise<void>((res) => {
        const im = new Image();
        im.src = src(i);
        im.decode().then(
          () => {
            imgs[i] = im;
            res();
          },
          () => res(),
        );
      });
    load(0).then(async () => {
      cv.style.opacity = "1";
      for (let i = 1; i < FRAMES && alive; i += 4) await Promise.all([i, i + 1, i + 2, i + 3].filter((k) => k < FRAMES).map(load));
    });

    let shown = -1;
    const draw = (i: number) => {
      // Fall back to the nearest decoded frame while the rest are loading.
      let k = i;
      while (!imgs[k] && k > 0) k--;
      const im = imgs[k];
      if (!im || k === shown) return;
      if (cv.width !== im.naturalWidth) {
        cv.width = im.naturalWidth;
        cv.height = im.naturalHeight;
      }
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(im, 0, 0);
      shown = k;
    };

    let p = 0;
    let sm = window.scrollY;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const a = document.querySelector<HTMLElement>('[data-can-slot="hero"]');
      const b = document.querySelector<HTMLElement>('[data-can-slot="intro"]');
      if (a && b) {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        // 0 at the top of the page, 1 once the intro frame is centred on screen.
        const yB = rb.top + window.scrollY - (innerHeight - rb.height) / 2;
        const target = clamp(window.scrollY / Math.max(1, yB));
        p = still ? target : p + (target - p) * 0.09;
        sm += (window.scrollY - sm) * 0.08;
        const e = ease(p);
        const x = ra.left + (rb.left - ra.left) * e;
        const y = ra.top + (rb.top - ra.top) * e;
        const h = ra.height + (rb.height - ra.height) * e;
        const s = h / rb.height;
        const t = (now - t0) / 1000;
        const bob = still ? 0 : Math.sin(t * 1.3) * 7 * (1 - e);
        const tilt = Math.sin(Math.PI * e) * -16 + (still ? 0 : Math.sin(t * 0.9) * 1.5 * (1 - e));
        cv.style.width = `${rb.width}px`;
        cv.style.height = `${rb.height}px`;
        // Scale and tilt about the centre; shift so the scaled can lands on (x, y).
        const ox = x - (rb.width * (1 - s)) / 2;
        const oy = y + bob - (rb.height * (1 - s)) / 2;
        cv.style.transform = `translate3d(${ox}px, ${oy}px, 0) scale(${s}) rotate(${tilt}deg)`;
        cv.style.visibility = y > innerHeight || y + h < 0 ? "hidden" : "visible";
        const f = still ? 0 : Math.floor(t * 7 + sm * 0.06) % FRAMES;
        draw((f + FRAMES) % FRAMES);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label="Die SPIRULI Dose"
      className="pointer-events-none fixed left-0 top-0 z-30 origin-center opacity-0 transition-opacity duration-700 will-change-transform"
    />
  );
}
