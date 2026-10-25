"use client";

import { useEffect, useRef } from "react";

/** Decorative cut-out that drifts vertically against the scroll (parallax). */
export default function Drift({ src, className = "", speed = 0.15 }: { src: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    let raf = 0;
    const tick = () => {
      const r = el.parentElement!.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) el.style.translate = `0 ${(r.top + r.height / 2 - innerHeight / 2) * speed}px`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed]);
  return <img ref={ref} src={src} alt="" aria-hidden loading="lazy" className={`pointer-events-none absolute drop-shadow-[0_30px_30px_rgba(0,0,0,0.4)] ${className}`} />;
}
