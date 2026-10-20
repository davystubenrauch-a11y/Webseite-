"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LogoStacked } from "@/components/brand/Logo";
import { LazyNfcStage } from "@/components/three/Lazy";

const HERO_LOOK = { theme: "classic", lang: "en", business: "" } as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Parallax: the product drifts up and away, copy fades slower than the page scrolls.
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 lg:pt-24">
      {/* Backdrop: fine gold grid + glows. */}
      <div aria-hidden className="hero-grid absolute inset-0 -z-10" />
      <div aria-hidden className="absolute -right-40 top-10 -z-10 h-[620px] w-[620px] rounded-full bg-gold/10 blur-[140px]" />
      <div aria-hidden className="absolute -left-40 bottom-0 -z-10 h-[520px] w-[520px] rounded-full bg-google-blue/10 blur-[140px]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="relative z-10 text-center lg:text-left">
          <motion.div {...fade(0.05)} className="mx-auto w-36 sm:w-44 lg:mx-0">
            <LogoStacked />
          </motion.div>
          <motion.p {...fade(0.2)} className="eyebrow mt-8 justify-center lg:justify-start">
            Digitale Innovation · München
          </motion.p>
          <motion.h1
            {...fade(0.3)}
            className="mt-5 font-serif text-[clamp(2.6rem,6.4vw,5.4rem)] font-semibold leading-[0.98] tracking-tight text-white"
          >
            Vertrauen, <span className="text-gold italic">automatisiert.</span>
            <br />
            Zukunft, gebaut.
          </motion.h1>
          <motion.p {...fade(0.45)} className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg lg:mx-0">
            Smarte NFC-Bewertungssysteme, High-End-Websites und KI-gestützte Roomtours, alles aus einer Hand. Damit Ihr
            Unternehmen online genauso überzeugt wie im persönlichen Gespräch.
          </motion.p>
          <motion.div {...fade(0.6)} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a href="#anfrage" className="btn-gold w-full sm:w-auto">
              Projekt starten
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#konfigurator" className="btn-glass w-full sm:w-auto">
              Produkte entdecken
            </a>
          </motion.div>
          <motion.dl {...fade(0.75)} className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 text-left">
            {[
              ["3 Sek.", "vom Tap zur Bewertung"],
              ["100 %", "Maßanfertigung"],
              ["24 h", "Antwortzeit"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-serif text-2xl font-semibold text-gold-soft sm:text-3xl">{v}</dd>
                <dd className="mt-1 text-[10px] uppercase leading-snug tracking-[0.06em] text-white/45 sm:text-xs sm:tracking-[0.15em]">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div style={{ y: stageY, scale: stageScale }} className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-square w-full max-w-[620px]"
          >
            <div aria-hidden className="absolute inset-[12%] rounded-full border border-gold/15" />
            <div aria-hidden className="absolute inset-[4%] rounded-full border border-dashed border-white/[0.06]" />
            <LazyNfcStage className="absolute inset-0" look={HERO_LOOK} particles={320} cameraZ={7.4} />

            <FloatingBadge className="left-0 top-[14%]" delay={1}>
              <span className="text-google-yellow">★★★★★</span>
              <span>5-Sterne in Sekunden</span>
            </FloatingBadge>
            <FloatingBadge className="bottom-[16%] right-0" delay={1.2}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-google-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-google-green" />
              </span>
              <span>NFC-Chip NTAG 215 · kein App-Download</span>
            </FloatingBadge>
          </motion.div>
          <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-white/35">Ziehen zum Drehen</p>
        </motion.div>
      </div>

      <a href="#vision" aria-label="Weiter scrollen" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
        <span className="block h-10 w-6 rounded-full border border-white/20">
          <span className="mx-auto mt-2 block h-2 w-1 animate-float rounded-full bg-gold" />
        </span>
      </a>
    </section>
  );
}

function FloatingBadge({ className, delay, children }: { className: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay }}
      className={`glass pointer-events-none absolute flex animate-float items-center gap-2 !rounded-full px-4 py-2.5 text-xs font-semibold text-white/85 ${className}`}
    >
      {children}
    </motion.div>
  );
}
