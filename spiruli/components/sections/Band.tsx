"use client";

import { useEffect, useRef } from "react";

const words = ["Holunder", "Zitrone", "Spirulina", "Rotalge", "Orange", "Kohlensäure"];

/** Huge ingredient words that slide sideways with the scroll, in two opposing rows. */
export default function Band() {
  const rows = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const y = window.scrollY;
      rows.current.forEach((r, i) => {
        if (r) r.style.transform = `translate3d(${(i ? -1 : 1) * ((y * 0.35) % 1600) - 800}px,0,0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden className="overflow-hidden border-y border-cream-line bg-cream py-6">
      {[0, 1].map((i) => (
        <div key={i} ref={(el) => void (rows.current[i] = el)} className="flex w-max gap-10 whitespace-nowrap will-change-transform">
          {[...words, ...words, ...words, ...words].map((w, k) => (
            <span
              key={k}
              className={`headline text-[11vw] md:text-[7vw] ${(k + i) % 2 ? "text-petrol" : "text-transparent [-webkit-text-stroke:1.5px_#0f5257]"}`}
            >
              {w}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
