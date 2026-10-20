"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LazyCardCanvas from "@/components/three/LazyCardCanvas";
import type { ScrollState } from "@/components/three/ReviewCard";

const ease = [0.22, 1, 0.36, 1] as const;

const headline: { text: string; gold?: boolean }[] = [
  { text: "Elevate" },
  { text: "Your" },
  { text: "Online" },
  { text: "Reputation", gold: true },
  { text: "&" },
  { text: "Digital" },
  { text: "Presence", gold: true },
];

const stats = [
  { value: "9.4×", label: "more reviews per month" },
  { value: "4.9★", label: "avg. client rating" },
  { value: "0.3s", label: "tap-to-review time" },
];

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const scroll = useRef<ScrollState>({ progress: 0 }).current;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scroll.progress = self.progress;
        },
      });
      gsap.to(copy.current, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom 20%", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, [scroll]);

  return (
    <section ref={section} id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 lg:pt-20">
      {/* Studio light rig */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute right-[8%] top-[12%] h-[520px] w-[520px] rounded-full bg-royal/20 blur-[140px]" />
        <div className="absolute right-[22%] top-[38%] h-[360px] w-[360px] rounded-full bg-gold/15 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-900 to-transparent" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-4">
        <div ref={copy} className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="eyebrow"
          >
            Smart NFC Review Cards · Web · Airbnb
          </motion.span>

          <h1 className="mt-6 font-serif text-[2.9rem] font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl xl:text-7xl">
            {headline.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
                <motion.span
                  className={`inline-block ${w.gold ? "text-gold italic" : ""}`}
                  initial={{ y: "110%", rotate: 4 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ duration: 1.1, ease, delay: 0.35 + i * 0.07 }}
                >
                  {w.text}
                </motion.span>
                {i < headline.length - 1 && " "}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.9 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
          >
            One tap turns happy guests into 5-star Google reviews. We pair handcrafted smart review cards with
            high-converting websites and cinematic Airbnb walkthroughs — so every touchpoint feels as premium as your
            service.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 1.05 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <a href="#contact" className="btn-gold">
              Book a Strategy Call
              <Arrow />
            </a>
            <a href="#customizer" className="btn-glass">
              Design Your Card
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-serif text-3xl font-semibold text-white">{s.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-white/50">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease, delay: 0.2 }}
          className="relative -mx-5 h-[440px] sm:mx-0 sm:h-[560px] lg:h-[680px]"
        >
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10" />
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
          <LazyCardCanvas className="fade-edges absolute -inset-x-6 inset-y-0 sm:-inset-x-16 lg:-left-28 lg:-right-16" scroll={scroll} cameraZ={6.8} />
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-white/40">
            Hover to tilt · Drag to spin
          </div>
        </motion.div>
      </div>

      <a
        href="#customizer"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/40 lg:flex"
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
