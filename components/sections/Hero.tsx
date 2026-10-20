"use client";

import { motion } from "framer-motion";
import { LogoStacked } from "@/components/brand/Logo";
import Icon from "@/components/ui/Icon";
import { LazyNfcStage } from "@/components/three/Lazy";

const HERO_LOOK = { theme: "white", lang: "en", business: "" } as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20">
      <div aria-hidden className="absolute -right-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-gold/[0.07] blur-[120px]" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div className="text-center lg:text-left">
          <motion.div {...fade(0)} className="mx-auto w-28 sm:w-32 lg:mx-0">
            <LogoStacked />
          </motion.div>
          <motion.h1
            {...fade(0.1)}
            className="mt-8 font-serif text-[clamp(2.3rem,5vw,3.9rem)] font-semibold leading-[1.05] tracking-tight text-white"
          >
            Wir machen Ihr Unternehmen <span className="text-gold">online sichtbar.</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg lg:mx-0">
            Google-Bewertungen per NFC, moderne Websites und 360°-Roomtours. Persönlich betreut von Florian Dressler und Davy
            Stubenrauch aus München.
          </motion.p>
          <motion.div {...fade(0.3)} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a href="#anfrage" className="btn-gold w-full sm:w-auto">
              Projekt starten <Icon name="arrow" className="h-4 w-4" />
            </a>
            <a href="#konfigurator" className="btn-glass w-full sm:w-auto">
              Produkte entdecken
            </a>
          </motion.div>
          <motion.ul {...fade(0.4)} className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/55 lg:justify-start">
            {["Websites ab 300 €", "Roomtours ab 300 €", "Antwort in 24 h"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-gold" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div {...fade(0.2)} className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-[480px]">
            <LazyNfcStage className="absolute inset-0" look={HERO_LOOK} particles={0} cameraZ={7.6} spin={0.25} />
          </div>
          <p className="mt-1 text-center text-xs text-white/40">NFC Review Disc · Ø 10 cm · zum Drehen ziehen</p>
        </motion.div>
      </div>
    </section>
  );
}
