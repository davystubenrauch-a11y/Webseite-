"use client";

import { useEffect, useRef } from "react";

/**
 * Cut-out ingredients around the can. They fly in on load, drift with the
 * mouse by their depth, and scatter outwards as you scroll away.
 * front: drawn above the can; the rest sit behind the headline, softly blurred.
 */
const items = [
  { src: "/float/zitrone.webp", x: 15, y: 18, w: 7, depth: 1, rot: -24, front: true },
  { src: "/float/orange.webp", x: 78, y: 50, w: 7.5, depth: 0.9, rot: 28, front: true },
  { src: "/float/tabletten.webp", x: 28, y: 62, w: 5, depth: 0.8, rot: -12, front: true },
  { src: "/float/blatt.webp", x: 66, y: 12, w: 12, depth: 0.45, rot: -28, front: false },
  { src: "/float/algenbund.webp", x: 4, y: 44, w: 12, depth: 0.3, rot: 35, front: false },
  { src: "/float/presslinge.webp", x: 88, y: 18, w: 5, depth: 0.25, rot: 10, front: false },
];

export default function HeroFloaters() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move, { passive: true });
    const tick = () => {
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      const s = Math.min(window.scrollY, innerHeight * 1.5);
      refs.current.forEach((el, i) => {
        if (!el) return;
        const it = items[i];
        // Scatter away from the centre while scrolling, deeper ones slower.
        const dirX = it.x < 50 ? -1 : 1;
        const x = mx * 40 * it.depth + dirX * s * 0.25 * it.depth;
        const y = my * 30 * it.depth - s * (0.35 + it.depth * 0.5);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${it.rot + s * 0.04 * it.depth * dirX}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {items.map((it, i) => (
        <div
          key={i}
          className={`floater absolute ${it.front ? "z-40" : "z-0"} ${i > 3 ? "hidden md:block" : ""}`}
          style={{ left: `${it.x}%`, top: `${it.y}%`, width: `clamp(${it.w * 5}px, ${it.w}vw, ${it.w * 16}px)`, ["--i" as string]: i }}
        >
          <div ref={(el) => void (refs.current[i] = el)} className="will-change-transform">
            <img
              src={it.src}
              alt=""
              className="animate-bob w-full"
              style={{
                animationDelay: `${-i * 1.3}s`,
                filter: it.front ? "drop-shadow(0 30px 30px rgba(13,38,33,0.25))" : `blur(${(1 - it.depth) * 3}px)`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
