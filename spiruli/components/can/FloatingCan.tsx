"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/ticker";

const SRC = "/can/spiruli.webp";
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * One can for the whole page: the cut-out product photo. It sits in the hero
 * slot, glides into the intro frame as you scroll, then travels with that
 * section. Position and tilt are eased towards the scroll target every frame,
 * and a soft light band sweeps across the aluminium as it moves.
 */
export default function FloatingCan() {
  const box = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current!;
    const sh = shine.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let p = 0;
    let sm = window.scrollY;
    const t0 = performance.now();
    let readyAt = 0;

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
        // Entrance: the can rises into place once the preloader lifts.
        if (!readyAt && document.documentElement.classList.contains("is-ready")) readyAt = t;
        const k = still ? 1 : readyAt ? 1 - Math.pow(1 - Math.min(1, Math.max(0, (t - readyAt - 0.25) / 1.6)), 4) : 0;
        const bob = still ? 0 : Math.sin(t * 1.3) * 7 * (1 - e);
        const tilt = Math.sin(Math.PI * e) * -14 + (still ? 0 : Math.sin(t * 0.9) * 1.2 * (1 - e));
        // Scale and tilt about the centre; shift so the scaled can lands on (x, y).
        const ox = x - (rb.width * (1 - s)) / 2;
        const oy = y + bob + (1 - k) * innerHeight * 0.6 - (rb.height * (1 - s)) / 2;
        el.style.width = `${rb.width}px`;
        el.style.height = `${rb.height}px`;
        el.style.transform = `translate3d(${ox}px, ${oy}px, 0) scale(${s}) rotate(${tilt + (1 - k) * 10}deg)`;
        el.style.opacity = String(k);
        el.style.visibility = y > innerHeight || y + h < 0 ? "hidden" : "visible";
        // Light band: drifts slowly on its own and follows the scroll.
        const pos = still ? 50 : 50 + Math.sin(t * 0.35 + sm * 0.004) * 60;
        sh.style.backgroundPosition = `${pos}% 0`;
      }
    };
    const stop = onFrame(null, tick);
    return stop;
  }, []);

  return (
    <div ref={box} className="pointer-events-none fixed left-0 top-0 z-30 origin-center will-change-transform">
      <img src={SRC} alt="SPIRULI Dose" className="h-full w-full" fetchPriority="high" />
      <div
        ref={shine}
        aria-hidden
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: "linear-gradient(100deg, transparent 38%, rgba(255,255,255,0.55) 50%, transparent 62%)",
          backgroundSize: "260% 100%",
          WebkitMaskImage: `url(${SRC})`,
          maskImage: `url(${SRC})`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      />
    </div>
  );
}
