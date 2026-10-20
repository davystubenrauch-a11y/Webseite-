"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LazyCanCanvas from "@/components/three/LazyCanCanvas";
import { restPose } from "@/components/three/SpiruliCan";

const notes = [
  {
    key: "holunder",
    name: "Holunder",
    latin: "Sambucus nigra",
    color: "#6B3D8A",
    tint: "rgba(107,61,138,0.32)",
    text: "Dunkle, samtige Beerennoten bilden das Fundament – fruchtig, leicht herb und mit natürlicher Tiefe.",
    tags: ["Beerig", "Samtig", "Tief"],
  },
  {
    key: "zitrus",
    name: "Zitrus",
    latin: "Citrus",
    color: "#E2B33A",
    tint: "rgba(226,179,58,0.26)",
    text: "Lebendige Zitrusnoten heben die Komposition an und sorgen für einen klaren, belebenden Abgang.",
    tags: ["Frisch", "Hell", "Belebend"],
  },
  {
    key: "algen",
    name: "Algen",
    latin: "Spirulina",
    color: "#2FA35B",
    tint: "rgba(47,163,91,0.3)",
    text: "Die fermentierte Algenbasis liefert den Kern: natürliche B-Vitamine und ein breites Spektrum an Aminosäuren.",
    tags: ["Fermentiert", "Vital", "Natürlich"],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Flavor() {
  const section = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const driven = useRef(restPose()).current;
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        // One full turn per chapter, with a slight lean into each note.
        driven.rotation = p * Math.PI * 2 * notes.length;
        driven.tilt = Math.sin(p * Math.PI * notes.length) * 0.12;
        if (bar.current) bar.current.style.transform = `scaleY(${p})`;
        setActive(Math.min(notes.length - 1, Math.floor(p * notes.length)));
      },
    });
    return () => st.kill();
  }, [driven]);

  const note = notes[active];

  return (
    <section ref={section} id="geschmack" className="relative" style={{ height: `${notes.length * 100 + 60}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{ background: `radial-gradient(900px 600px at 50% 55%, ${note.tint}, transparent 70%)` }}
          transition={{ duration: 1.2, ease }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_minmax(300px,0.9fr)_1fr]">
          <div className="relative z-10">
            <span className="eyebrow">Flavor Profile</span>
            <h2 className="mt-5 font-display text-3xl font-semibold uppercase leading-tight tracking-tight text-white sm:text-4xl">
              Fermentierte <br />
              <span className="text-gold">Holunder-Zitrus-</span>
              <br />
              Algen-Basis
            </h2>

            <ol className="mt-10 flex gap-6 lg:flex-col lg:gap-4">
              {notes.map((n, i) => (
                <li key={n.key} className="flex items-center gap-4">
                  <span
                    className="h-2.5 w-2.5 rounded-full transition-all duration-500"
                    style={{ background: i === active ? n.color : "rgba(255,255,255,0.15)", boxShadow: i === active ? `0 0 16px ${n.color}` : "none" }}
                  />
                  <span className={`font-display text-xs font-semibold uppercase tracking-[0.3em] transition-colors ${i === active ? "text-white" : "text-white/35"}`}>
                    0{i + 1} {n.name}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative h-[46svh] sm:h-[60svh] lg:h-[80svh]">
            <LazyCanCanvas className="absolute -inset-x-16 inset-y-0" driven={driven} spin={0} accent={note.color} particles={380} drops={active !== 2} cameraZ={7.6} />
          </div>

          {/* All notes stay mounted and crossfade, so fast scrubbing never strands an exit. */}
          <div className="relative z-10 grid min-h-[260px]">
            {notes.map((n, i) => (
              <motion.div
                key={n.key}
                aria-hidden={i !== active}
                className="col-start-1 row-start-1"
                initial={false}
                animate={i === active ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: i < active ? -30 : 30, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease }}
              >
                <span className="font-serif text-lg italic text-white/45">{n.latin}</span>
                <p className="font-display text-6xl font-semibold uppercase leading-none tracking-tight sm:text-7xl" style={{ color: n.color }}>
                  {n.name}
                </p>
                <p className="mt-5 max-w-sm leading-relaxed text-white/70">{n.text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {n.tags.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll progress through the three notes */}
        <div className="absolute right-6 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-white/10 lg:block xl:right-24">
          <span ref={bar} className="absolute inset-0 origin-top bg-gradient-to-b from-gold to-emerald-bright" style={{ transform: "scaleY(0)" }} />
        </div>
      </div>
    </section>
  );
}
