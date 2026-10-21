"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { LazyChipStage } from "@/components/three/Lazy";
import { configStore } from "@/lib/configStore";
import { themes, type Theme } from "@/lib/pricing";

const chapters = [
  {
    kicker: "NFC Review Disc",
    title: "Klein, edel, wirkungsvoll.",
    text: "Eine runde Acryl-Platte mit Ø 10 cm, in Weiß oder Schwarz. Sie passt auf jede Theke, jeden Tisch und jede Tür.",
  },
  {
    kicker: "Was steckt drin?",
    title: "Technik, die man nicht sieht.",
    text: "Zwischen zwei Acrylschichten sitzt ein NFC-Chip mit Kupferantenne. Er braucht keine Batterie und keinen Strom.",
  },
  {
    kicker: "Ihr direkter Link",
    title: "Ein Tap öffnet Ihre Google-Bewertung.",
    text: "Auf dem Chip ist der Link zu Ihrer Bewertungsseite gespeichert. Kunden müssen nichts suchen und keine App installieren.",
  },
];

/**
 * Pinned, scroll-scrubbed section: the disc turns, splits into its layers and labels them
 * while three short chapters explain the product.
 */
export default function ChipReveal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [chapter, setChapter] = useState(0);
  const [theme, setTheme] = useState<Theme>("white");
  useMotionValueEvent(scrollYProgress, "change", (p) => setChapter(p < 0.3 ? 0 : p < 0.66 ? 1 : 2));

  const c = chapters[chapter];
  return (
    <section id="nfc" ref={ref} className="relative h-[320vh] bg-gradient-to-b from-slate-50 via-emerald-50/50 to-slate-50">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden lg:flex-row lg:items-center">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6 lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:pt-0 lg:px-8">
          <div className="max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div key={chapter} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{c.kicker}</p>
                <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{c.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{c.text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex gap-1.5">
                {chapters.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${chapter === i ? "w-8 bg-emerald-600" : "w-1.5 bg-slate-300"}`} />
                ))}
              </div>
              <div className="flex gap-1.5">
                {(Object.keys(themes) as Theme[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setTheme(k);
                      configStore.set({ theme: k });
                    }}
                    aria-pressed={theme === k}
                    aria-label={`Farbe ${themes[k].label}`}
                    className={`h-7 w-7 rounded-full border-2 transition ${theme === k ? "scale-110 border-brand" : "border-slate-300"}`}
                    style={{ background: themes[k].swatch }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="relative min-h-0 flex-1 lg:absolute lg:inset-y-0 lg:left-[30%] lg:right-0">
          <LazyChipStage className="absolute inset-0" progress={scrollYProgress} theme={theme} />
        </div>
      </div>
    </section>
  );
}
