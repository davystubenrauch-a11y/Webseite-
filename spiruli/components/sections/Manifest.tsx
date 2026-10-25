"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/ticker";

const slides = [
  {
    title: "Kein Energy-Drink.",
    text: "Kein Kick, kein Absturz – sondern Zutaten, die man kennt: Holunder, Zitrus und Alge.",
    img: "/photos/zitrone-xl.webp",
    accent: "text-[#f3d64a]",
  },
  {
    title: "Kein Smoothie.",
    text: "Kein Pulver, kein Brei. Spritzig, leicht und mit rund 43 kcal pro Dose.",
    img: "/photos/orange-xl.webp",
    accent: "text-[#ff9b3d]",
  },
  {
    title: "Ein Mehrwert\u00ADgetränk.",
    text: "Vegan, fermentiert und mit Vitaminen der B-Gruppe sowie Aminosäuren aus rein pflanzlicher Herkunft.",
    img: "/photos/holunder-xl.webp",
    accent: "text-fresh",
  },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Three short statements, pinned: each one rises in over its own full-screen
 * ingredient photo while the previous fades out.
 */
export default function Manifest() {
  const section = useRef<HTMLElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = section.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let p = 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const goal = clamp(-r.top / (r.height - innerHeight));
      p = still ? goal : p + (goal - p) * 0.12;
      const pos = p * slides.length; // 0..3
      layers.current.forEach((ly, i) => {
        if (!ly) return;
        // Fully visible during its own third; crossfades with the next over the last quarter.
        const fadeIn = i === 0 ? 1 : clamp((pos - i) / 0.25 + 1);
        const fadeOut = i === slides.length - 1 ? 1 : clamp((i + 1 - pos) / 0.25);
        const vis = fadeIn * fadeOut;
        const local = clamp(pos - i);
        ly.style.opacity = String(vis);
        ly.style.setProperty("--in", String(clamp((pos - i + 0.35) / 0.4)));
        ly.style.setProperty("--zoom", String(1.15 - 0.15 * local));
        const bar = bars.current[i];
        if (bar) bar.style.transform = `scaleX(${local})`;
      });
    };
    return onFrame(el, tick);
  }, []);

  return (
    <section ref={section} className="relative z-10 h-[330vh] bg-black text-mist">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {slides.map((s, i) => (
          <div key={s.title} ref={(el) => void (layers.current[i] = el)} className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
            <img
              src={s.img}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
              style={{ transform: "scale(var(--zoom, 1.15))" }}
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
            <div className="wrap relative flex h-full flex-col justify-end pb-20 sm:pb-24">
              <h2
                className={`headline max-w-5xl text-[15vw] sm:text-[10vw] lg:text-[8vw] ${s.accent}`}
                style={{ opacity: "var(--in, 0)", transform: "translateY(calc((1 - var(--in, 0)) * 60px))" }}
              >
                {s.title}
              </h2>
              <p
                className="mt-6 max-w-lg text-lg leading-relaxed text-mist/85 sm:text-xl"
                style={{ opacity: "var(--in, 0)", transform: "translateY(calc((1 - var(--in, 0)) * 30px))" }}
              >
                {s.text}
              </p>
            </div>
          </div>
        ))}

        {/* Progress: one bar per statement. */}
        <div className="wrap pointer-events-none absolute inset-x-0 top-24 flex items-center gap-4 sm:top-28">
          <p className="label text-mist/70">Worum es geht</p>
          <div className="flex flex-1 gap-2">
            {slides.map((s, i) => (
              <span key={s.title} className="h-0.5 flex-1 overflow-hidden rounded-full bg-mist/20">
                <span ref={(el) => void (bars.current[i] = el)} className="block h-full origin-left bg-mist" style={{ transform: "scaleX(0)" }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
