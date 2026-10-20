"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LazyCanCanvas from "@/components/three/LazyCanCanvas";
import { restPose } from "@/components/three/SpiruliCan";
import CanControls from "@/components/ui/CanControls";
import Magnetic from "@/components/ui/Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

const highlights = ["100 % vegan", "Natürlicher B-Komplex", "18+ Aminosäuren", "PZN 11110571"];

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const giant = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const driven = useRef(restPose()).current;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(driven, {
        rotation: Math.PI * 1.25,
        y: 0.9,
        scale: 0.78,
        tilt: -0.18,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(giant.current, {
        xPercent: -14,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(copy.current, {
        yPercent: -20,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom 25%", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, [driven]);

  return (
    <section ref={section} id="hero" className="marble-dark relative flex min-h-[100svh] flex-col overflow-hidden pb-10 pt-28">
      {/* Studio light rig */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[30%] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-emerald/20 blur-[150px]" />
        <div className="absolute left-[58%] top-[55%] h-[340px] w-[340px] rounded-full bg-gold/15 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-petrol-950 to-transparent" />
      </div>

      {/* Oversized wordmark behind the can */}
      <div ref={giant} className="pointer-events-none absolute inset-x-0 top-[22%] select-none text-center lg:top-[24%]">
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.4em" }}
          animate={{ opacity: 1, letterSpacing: "0.06em" }}
          transition={{ duration: 2, ease }}
          className="font-display text-[23vw] font-extralight leading-none text-white/[0.04] [-webkit-text-stroke:1px_rgba(226,196,122,0.4)] lg:text-[19vw]"
        >
          SPIRULI<span className="align-top text-[0.25em]">®</span>
          <span className="sr-only"> – Health &amp; Vitality</span>
        </motion.h1>
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_minmax(340px,0.95fr)_1fr]">
        <div ref={copy} className="relative z-10 order-2 lg:order-1">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.4 }} className="eyebrow">
            Health &amp; Vitality
          </motion.span>
          <p className="mt-6 font-display text-[2.6rem] font-semibold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[3.6rem] xl:text-7xl" aria-hidden>
            {["Natürliche", "Energie,"].map((w, i) => (
              <span key={w} className="block overflow-hidden pt-[0.14em]">
                <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease, delay: 0.5 + i * 0.08 }}>
                  {w}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block font-serif font-medium normal-case italic text-emerald-grad"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease, delay: 0.66 }}
              >
                fermentiert.
              </motion.span>
            </span>
          </p>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {highlights.map((h) => (
              <li key={h} className="chip">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-bright shadow-[0_0_8px_#6CC04A]" />
                {h}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, ease, delay: 0.15 }}
          className="relative order-1 -mx-5 h-[62svh] min-h-[440px] sm:mx-0 lg:order-2 lg:h-[78svh] lg:max-h-[820px]"
        >
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[78%] w-[78%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-gold/15" />
          <LazyCanCanvas className="absolute -inset-x-10 inset-y-0 sm:-inset-x-24" driven={driven} cameraZ={7.4} />
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <CanControls />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1 }}
          className="relative z-10 order-3"
        >
          <div className="glass rim max-w-sm p-7 lg:ml-auto">
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">Das Mehrwertgetränk</span>
            <p className="mt-4 font-serif text-2xl leading-snug text-white sm:text-[1.7rem]">
              Das vegane &amp; natürliche Mehrwertgetränk mit natürlichen{" "}
              <em className="text-gold not-italic">B-Vitaminen</em> und essentiellen{" "}
              <em className="text-emerald-bright not-italic">Aminosäuren</em>.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic>
                <a href="#bezug" className="btn-gold">
                  Jetzt entdecken
                  <Arrow />
                </a>
              </Magnetic>
              <a href="#matrix" className="btn-glass !px-5">
                Nährstoffe
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <a
        href="#story"
        className="relative mx-auto mt-6 hidden flex-col items-center gap-2 font-display text-[10px] uppercase tracking-[0.4em] text-white/40 lg:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-4 animate-[float_2s_ease-in-out_infinite] bg-gold" />
        </span>
      </a>
    </section>
  );
}

export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
