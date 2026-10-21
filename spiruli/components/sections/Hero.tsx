"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LazyCanCanvas from "@/components/three/LazyCanCanvas";
import { restPose } from "@/components/three/SpiruliCan";
import Floaters from "@/components/ui/Floaters";
import { Stamp } from "@/components/ui/Illustrations";

const ease = [0.22, 1, 0.36, 1] as const;

function Word({ children, delay }: { children: string; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.04em] pt-[0.1em]">
      <motion.span className="block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease, delay }}>
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const driven = useRef(restPose()).current;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(driven, {
        rotation: Math.PI * 1.5,
        y: -0.4,
        scale: 0.85,
        tilt: 0.2,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-word]", {
        xPercent: (i) => (i === 0 ? -12 : 12),
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, [driven]);

  return (
    <section ref={section} id="top" className="paper relative overflow-hidden bg-lime pb-10 pt-24 sm:pt-28">
      <Floaters />

      <div className="wrap relative">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="text-center">
          <span className="kicker bg-cream">Neu · SPIRULI® Health &amp; Vitality</span>
        </motion.p>

        <h1 className="sr-only">SPIRULI® – Natürliche Energie</h1>
        <div aria-hidden className="display relative mt-4 text-center text-[12.5vw] uppercase text-ink xl:text-[11rem]">
          <div data-hero-word>
            <Word delay={0.1}>Natürliche</Word>
          </div>
          {/* The can floats between the words; on wide screens it overlaps them. */}
          <div className="relative z-10 -my-[3vw] h-[50svh] min-h-[340px] lg:-my-[12rem] lg:h-[72svh]">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.3 }} className="absolute inset-0">
              <LazyCanCanvas className="absolute -inset-x-10 inset-y-0" driven={driven} particles={60} cameraZ={8.6} />
            </motion.div>
          </div>
          <div data-hero-word>
            <Word delay={0.2}>Energie.</Word>
          </div>
        </div>

        <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1.2fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.6 }}>
            <p className="max-w-xl text-xl font-medium leading-snug sm:text-2xl">
              Das vegane &amp; natürliche Mehrwertgetränk mit natürlichen B-Vitaminen und essentiellen Aminosäuren.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#kaufen" className="btn-ink">
                Jetzt probieren
                <Arrow />
              </a>
              <a href="#zutaten" className="btn-line">
                Was drin ist
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.9 }}
            className="flex justify-start lg:justify-end"
          >
            <Stamp text="VEGAN · FERMENTIERT · NATÜRLICH · " className="w-32 sm:w-36">
              <span className="block text-center font-hand text-3xl font-bold leading-none">
                Dreh
                <br />
                mich!
              </span>
            </Stamp>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
