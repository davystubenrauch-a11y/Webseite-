"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/ticker";
import CountUp from "@/components/ui/CountUp";

const stats = [
  { n: 22, u: "kcal / 100 ml" },
  { n: 9, u: "Zutaten" },
  { n: 2, u: "Algen" },
  { n: 0, u: "Pulver" },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Fly-through: a giant word sits on a light screen with the product photo
 * showing through its letters. Scrolling zooms into the last "I" until the
 * photo fills the screen, then the brand line and numbers come in.
 */
export default function Balancer() {
  const section = useRef<HTMLElement>(null);
  const mask = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLParagraphElement>(null);
  const target = useRef<HTMLSpanElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let p = still ? 1 : 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const goal = still ? 1 : clamp(-r.top / (r.height - innerHeight));
      p += (goal - p) * 0.12;
      // Zoom around the centre of the target letter.
      const w = word.current!;
      const t = target.current!;
      const ox = t.offsetLeft + t.offsetWidth / 2;
      const oy = t.offsetTop + t.offsetHeight * 0.55;
      w.style.transformOrigin = `${ox}px ${oy}px`;
      const z = clamp(p / 0.6);
      w.style.transform = `scale(${1 + Math.pow(z, 3) * 60})`;
      mask.current!.style.opacity = String(1 - clamp((p - 0.55) / 0.08));
      photo.current!.style.transform = `scale(${1.25 - 0.25 * clamp(p / 0.7)})`;
      const c = clamp((p - 0.62) / 0.15);
      copy.current!.style.opacity = String(c);
      copy.current!.style.transform = `translateY(${(1 - c) * 40}px)`;
    };
    const stop = onFrame(el, tick);
    return stop;
  }, []);

  return (
    <section ref={section} data-cursor="Scrollen" className="relative z-10 h-[300vh] bg-algae-deep text-mist">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <img
          ref={photo}
          src="/photos/stimmung.webp"
          alt="SPIRULI Dose auf Schiefer mit Holunder, Zitrone und Spirulina"
          className="absolute inset-0 h-full w-full object-cover object-[50%_35%] will-change-transform"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-algae-deep/90 via-algae-deep/40 to-transparent" />

        {/* Light screen; black letters + screen blend = the photo shows through the word. */}
        <div ref={mask} aria-hidden className="absolute inset-0 grid place-items-center overflow-hidden bg-white mix-blend-screen">
          <p ref={word} className="headline relative whitespace-nowrap text-[23vw] text-black will-change-transform">
            Spirul<span ref={target}>i</span>
          </p>
        </div>

        <div ref={copy} className="wrap relative flex h-full flex-col justify-end pb-14 opacity-0">
          <p className="label text-fresh">Willkommen bei SPIRULI</p>
          <h2 className="headline mt-5 text-[15vw] sm:text-[9vw] lg:text-[7vw]">
            Der <span className="text-fresh">Balancer.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-mist/85">
            Für den Schreibtisch, unterwegs oder nach dem Training – eine Erfrischung mit Mikroalge, die nach Holunder und Zitrone schmeckt.
          </p>
          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-mist/20 backdrop-blur-sm sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.u} className="bg-algae-deep/75 p-5">
                <dt className="font-display text-5xl font-extrabold text-fresh">
                  <CountUp to={s.n} />
                </dt>
                <dd className="mt-1 text-sm text-mist/75">{s.u}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
