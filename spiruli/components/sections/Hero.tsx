"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LazyCanCanvas from "@/components/three/LazyCanCanvas";
import { restPose } from "@/components/three/SpiruliCan";
import CanControls from "@/components/ui/CanControls";
import Icon from "@/components/ui/Icon";

const ease = [0.22, 1, 0.36, 1] as const;

const facts = ["100 % vegan", "Natürliche B-Vitamine", "18+ Aminosäuren", "PZN 11110571"];

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const driven = useRef(restPose()).current;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // The can turns and settles as the visitor scrolls on.
      gsap.to(driven, {
        rotation: Math.PI,
        y: 0.5,
        scale: 0.9,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, [driven]);

  return (
    <section ref={section} id="hero" className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="container-page grid items-center gap-6 pb-12 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-2 lg:gap-10 lg:pb-16">
        <div className="order-2 lg:order-1">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
            Health &amp; Vitality
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.08 }}
            className="mt-5 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-petrol-900 sm:text-6xl"
          >
            <span className="font-display font-semibold tracking-[0.06em] text-petrol">SPIRULI®</span>
            <br />
            Natürliche Energie aus fermentierten Algen.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.16 }}
            className="lead mt-6 max-w-xl"
          >
            Das vegane &amp; natürliche Mehrwertgetränk mit natürlichen <strong className="font-semibold text-petrol-900">B-Vitaminen</strong> und
            essentiellen <strong className="font-semibold text-petrol-900">Aminosäuren</strong>.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href="#bezug" className="btn-primary">
              Jetzt entdecken
              <Arrow />
            </a>
            <a href="#matrix" className="btn-secondary">
              Nährstoffe ansehen
            </a>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-10 flex flex-wrap gap-2">
            {facts.map((f) => (
              <li key={f} className="chip">
                <Icon name="check" className="h-4 w-4 text-leaf" />
                {f}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease }}
          className="relative order-1 h-[58svh] min-h-[420px] lg:order-2 lg:h-[72svh] lg:max-h-[760px]"
        >
          {/* Soft studio backdrop */}
          <div aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[min(88%,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#EEF6EB_55%,#E3EEF0_100%)]" />
          <LazyCanCanvas className="absolute -inset-x-10 inset-y-0" driven={driven} cameraZ={8.1} />
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <CanControls />
          </div>
        </motion.div>
      </div>
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
