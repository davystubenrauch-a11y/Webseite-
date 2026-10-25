"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/ticker";

const text =
  "SPIRULI ist kein Energy-Drink und kein grüner Smoothie. Es ist das vegane, natürliche Mehrwertgetränk auf Holunder-Zitrus-Algen-Basis – mit Vitaminen der B-Gruppe und Aminosäuren aus rein pflanzlicher Herkunft.";
const highlight = new Set(["Mehrwertgetränk", "Holunder-Zitrus-Algen-Basis", "B-Gruppe", "Aminosäuren", "pflanzlicher"]);

/** Pinned statement whose words light up one by one as you scroll through it. */
export default function Manifest() {
  const section = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = section.current!;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => (s.style.opacity = "1"));
      return;
    }
    const tick = () => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
        const lit = p * (spans.length + 4);
        spans.forEach((s, i) => (s.style.opacity = String(0.14 + 0.86 * Math.min(1, Math.max(0, lit - i)))));
      }
    };
    const stop = onFrame(el, tick);
    return stop;
  }, []);

  return (
    <section ref={section} className="relative z-10 h-[260vh] bg-ink text-mist">
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="wrap">
          <p className="label text-fresh">Worum es geht</p>
          <p className="mt-8 max-w-6xl font-display text-[8.5vw] font-extrabold leading-[1.02] tracking-tight sm:text-[5.6vw] lg:text-[4.6vw]">
            {words.map((w, i) => (
              <span key={i} data-w className={`transition-opacity duration-200 ${highlight.has(w) ? "text-fresh" : ""}`} style={{ opacity: 0.14 }}>
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
