"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/ticker";

const words = ["Spirulina", "Holunder", "Zitrone", "Orange", "Rotalge", "Vegan", "Made in Germany"];

/** Ingredient band: drifts on its own, speeds up and leans with the scroll speed. */
export default function Marquee() {
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = band.current!;
    let x = 0;
    let v = 0;
    let last = window.scrollY;
    return onFrame(el, () => {
      const d = window.scrollY - last;
      last = window.scrollY;
      v += (d - v) * 0.1;
      x += 1 + Math.abs(v) * 0.8;
      const half = el.scrollWidth / 2;
      el.style.transform = `translate3d(${-(x % half)}px, 0, 0) skewX(${Math.max(-14, Math.min(14, -v * 0.6))}deg)`;
    });
  }, []);

  return (
    <div aria-hidden className="relative z-10 overflow-hidden bg-fresh py-5 text-ink">
      <div ref={band} className="flex w-max will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {words.map((w) => (
              <span key={w} className="headline flex items-center whitespace-nowrap px-6 text-5xl sm:text-6xl">
                {w}
                <span className="ml-12 h-3 w-3 rounded-full bg-ink" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
