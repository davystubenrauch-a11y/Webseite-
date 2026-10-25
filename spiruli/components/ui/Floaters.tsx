"use client";

import { useEffect, useRef } from "react";

export type Floater = {
  /** One of the rendered props in public/props (lemon-a, berries-b, leaf-a …). */
  src: string;
  /** Position inside the section, in percent. */
  x: number;
  y: number;
  /** Width in vw (desktop); phones get 60 % of it. */
  size: number;
  /** Parallax: px moved per px scrolled (negative = against the scroll). */
  depth: number;
  /** Degrees turned per 1000 px scrolled. */
  spin?: number;
  rotate?: number;
  blur?: boolean;
};

/**
 * Photoreal ingredients (rendered by scripts/render_props.py) floating in a
 * section. They drift and turn with the scroll at different depths.
 */
export default function Floaters({ items, className = "" }: { items: Floater[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = [...el.children] as HTMLElement[];
    let raf = 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      // 0 when the section's centre is at the viewport centre.
      const d = r.top + r.height / 2 - window.innerHeight / 2;
      nodes.forEach((n, i) => {
        const it = items[i];
        n.style.transform = `translate3d(-50%, calc(-50% + ${(-d * it.depth).toFixed(1)}px), 0) rotate(${((it.rotate ?? 0) + (d * (it.spin ?? 0)) / 1000).toFixed(2)}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items]);

  return (
    <div ref={root} aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {items.map((it, i) => (
        <img
          key={i}
          src={`/props/${it.src}.webp`}
          alt=""
          loading="lazy"
          className={`absolute w-[calc(var(--s)*0.6vw)] max-w-none will-change-transform md:w-[calc(var(--s)*1vw)] ${it.blur ? "blur-[3px]" : ""}`}
          style={{ left: `${it.x}%`, top: `${it.y}%`, ["--s" as string]: it.size, transform: "translate(-50%, -50%)", filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.25))" }}
        />
      ))}
    </div>
  );
}
