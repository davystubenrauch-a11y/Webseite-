"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/ticker";

/**
 * "Was in der Dose steckt": the section pins, and as you scroll the
 * ingredients burst out of the can to their places around it; a hairline and
 * a label draw in once each one has landed.
 * x / y: landing spot in % of the stage, relative to its centre.
 */
const parts = [
  { src: "/float/pulver.webp", name: "Spirulina", note: "Die Mikroalge – B-Vitamine & Aminosäuren", x: -28, y: -26, w: 15, rot: -8 },
  { src: "/float/algenbund.webp", name: "Rotalge", note: "Lithothamnium calcareum – das LI im Namen", x: 28, y: -26, w: 15, rot: 14 },
  { src: "/float/holunder.webp", name: "Holunder", note: "Die Basis – fruchtig und samtig", x: -33, y: 15, w: 14, rot: 0 },
  { src: "/float/zitrone.webp", name: "Zitrone", note: "Frische Säure, klarer Abgang", x: 32, y: 14, w: 6.5, rot: 22 },
  { src: "/float/orange.webp", name: "Orange", note: "Rund und fruchtig", x: -15, y: 22, w: 6.5, rot: -30 },
  { src: "", name: "Kohlensäure", note: "Ein Schuss – spritzig, nicht scharf", x: 16, y: 22, w: 7, rot: 0 },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Explosion() {
  const section = useRef<HTMLElement>(null);
  const can = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = section.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let p = still ? 1 : 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const target = still ? 1 : clamp(-r.top / (r.height - innerHeight));
      p += (target - p) * 0.12;
      // Can: shakes a little just before the burst, then sinks back.
      const pre = clamp(p / 0.12);
      const shake = pre < 1 ? Math.sin(p * 220) * 2 * pre : 0;
      can.current!.style.transform = `translate(-50%, -50%) rotate(${shake}deg) scale(${1 + 0.06 * pre - 0.12 * clamp((p - 0.12) / 0.5)})`;
      let landed = 0;
      parts.forEach((it, i) => {
        const start = 0.1 + i * 0.07;
        const t = easeOut(clamp((p - start) / 0.3));
        const box = items.current[i];
        if (box) {
          box.style.transform = `translate(calc(-50% + ${it.x * t}cqw * var(--sx)), calc(-50% + ${it.y * t}cqh)) scale(${0.15 + 0.85 * t})`;
          box.style.setProperty("--r", `${it.rot * t + (1 - t) * 90}deg`);
          box.style.opacity = String(clamp(t * 3));
        }
        const lt = clamp((p - start - 0.22) / 0.12);
        if (box) box.style.setProperty("--l", String(lt));
        if (lt > 0.5) landed++;
      });
      if (counter.current) counter.current.textContent = String(landed);
    };
    const stop = onFrame(el, tick);
    return stop;
  }, []);

  return (
    <section ref={section} className="relative z-10 h-[320vh] bg-algae-deep text-mist">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Rings behind the can. */}
        <svg aria-hidden viewBox="0 0 600 600" className="absolute left-1/2 top-1/2 w-[110vmin] -translate-x-1/2 -translate-y-1/2 text-fresh/[0.08]">
          {[290, 230, 170, 110].map((r) => (
            <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="currentColor" strokeWidth="1" />
          ))}
        </svg>

        <div className="wrap relative z-20 flex items-start justify-between pt-24 sm:pt-28">
          <div>
            <p className="label text-fresh">Was in der Dose steckt</p>
            <h2 className="headline mt-4 text-5xl sm:text-7xl">
              Alles <span className="text-fresh">drin.</span>
            </h2>
          </div>
          <p className="text-right font-display text-5xl font-extrabold sm:text-7xl">
            <span ref={counter} className="tabular-nums text-fresh">
              0
            </span>
            <span className="text-mist/30">/{parts.length}</span>
          </p>
        </div>

        {/* Stage: positions in container units, so it scales with the screen. */}
        <div className="absolute inset-x-0 bottom-0 top-[22%] [--k:1.8] [--sx:1.1] [container-type:size] sm:[--k:1] sm:[--sx:1]">
          <div ref={can} className="absolute left-1/2 top-1/2 z-10 h-[58%] sm:h-[78%]" style={{ aspectRatio: "var(--can-aspect)" }}>
            <img src="/can/spiruli.webp" alt="SPIRULI Dose" className="h-full w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.5)]" />
          </div>
          {parts.map((it, i) => (
            <div
              key={it.name}
              ref={(el) => void (items.current[i] = el)}
              className="absolute left-1/2 top-1/2 z-20 opacity-0 will-change-transform"
              style={{ width: `calc(${it.w}cqw * var(--k))`, ["--l" as string]: 0 }}
            >
              {it.src ? (
                <img src={it.src} alt="" className="w-full rotate-[var(--r)] drop-shadow-[0_25px_30px_rgba(0,0,0,0.45)]" />
              ) : (
                // Carbonation: a cluster of bubbles.
                <div className="relative aspect-square w-full">
                  {[
                    [20, 30, 34],
                    [62, 18, 22],
                    [55, 60, 30],
                    [18, 70, 16],
                    [80, 55, 12],
                    [40, 8, 10],
                  ].map(([x, y, s], k) => (
                    <span
                      key={k}
                      className="absolute rounded-full border-2 border-mist/70 bg-mist/10"
                      style={{ left: `${x}%`, top: `${y}%`, width: `${s}%`, height: `${s}%` }}
                    />
                  ))}
                </div>
              )}
              {/* Label under the item: a short hairline grows, then the text fades in. */}
              <div className="absolute left-1/2 top-full flex w-24 -translate-x-1/2 sm:w-48 flex-col items-center text-center" style={{ opacity: "var(--l)" }}>
                <span className="h-5 w-px origin-top bg-fresh" style={{ transform: "scaleY(var(--l))" }} />
                <p className="mt-1 font-display text-base font-extrabold sm:text-xl">{it.name}</p>
                <p className="hidden text-sm leading-snug text-mist/65 sm:block">{it.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
