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
    color: "#6B3D8A",
    bg: "#F3EEF6",
    text: "Dunkle, samtige Beerennoten bilden das Fundament – fruchtig, leicht herb und mit natürlicher Tiefe.",
    tags: ["Beerig", "Samtig"],
  },
  {
    key: "zitrus",
    name: "Zitrus",
    color: "#C97A0A",
    bg: "#FBF4E3",
    text: "Lebendige Zitrusnoten heben die Komposition an und sorgen für einen klaren, erfrischenden Abgang.",
    tags: ["Frisch", "Hell"],
  },
  {
    key: "algen",
    name: "Algen",
    color: "#2C7A3B",
    bg: "#EEF6EB",
    text: "Die fermentierte Algenbasis liefert den Kern: natürliche B-Vitamine und ein breites Spektrum an Aminosäuren.",
    tags: ["Fermentiert", "Natürlich"],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Flavor() {
  const section = useRef<HTMLElement>(null);
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
        // One full turn per note.
        driven.rotation = self.progress * Math.PI * 2 * notes.length;
        setActive(Math.min(notes.length - 1, Math.floor(self.progress * notes.length)));
      },
    });
    return () => st.kill();
  }, [driven]);

  const note = notes[active];

  return (
    <section ref={section} id="geschmack" className="relative" style={{ height: `${notes.length * 90 + 60}vh` }}>
      <motion.div
        className="sticky top-0 flex h-[100svh] items-center overflow-hidden"
        animate={{ backgroundColor: note.bg }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="container-page grid items-center gap-4 lg:grid-cols-[1fr_0.9fr_1fr]">
          <div>
            <span className="eyebrow">Geschmack</span>
            <h2 className="h-section mt-4">Fermentierte Holunder-Zitrus-Algen-Basis</h2>
            <ol className="mt-8 flex gap-2 lg:flex-col lg:items-start">
              {notes.map((n, i) => (
                <li
                  key={n.key}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${i === active ? "bg-white shadow-card" : "text-muted"}`}
                  style={i === active ? { color: n.color } : undefined}
                >
                  {i + 1}. {n.name}
                </li>
              ))}
            </ol>
          </div>

          <div className="relative h-[38svh] sm:h-[50svh] lg:h-[74svh]">
            <LazyCanCanvas className="absolute -inset-x-16 inset-y-0" driven={driven} spin={0} accent={note.color} drops={active !== 2} cameraZ={8.3} />
          </div>

          {/* All notes stay mounted and crossfade, so fast scrubbing never strands an exit. */}
          <div className="grid min-h-[200px]">
            {notes.map((n, i) => (
              <motion.div
                key={n.key}
                aria-hidden={i !== active}
                className="col-start-1 row-start-1"
                initial={false}
                animate={i === active ? { opacity: 1, y: 0 } : { opacity: 0, y: i < active ? -20 : 20 }}
                transition={{ duration: 0.5, ease }}
              >
                <p className="text-5xl font-extrabold tracking-tight sm:text-6xl" style={{ color: n.color }}>
                  {n.name}
                </p>
                <p className="mt-4 max-w-sm leading-relaxed text-petrol-900/80">{n.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
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
      </motion.div>
    </section>
  );
}
