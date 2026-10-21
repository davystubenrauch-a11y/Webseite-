"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import Icon from "@/components/ui/Icon";
import WordReveal from "@/components/ui/WordReveal";
import { LazyTapStory } from "@/components/three/Lazy";
import { storyStep, storyTime } from "@/lib/story";

const steps = [
  { label: "Antippen", hint: "Handy an die Platte halten" },
  { label: "Google öffnet sich", hint: "Ohne App, ohne Suchen" },
  { label: "5 Sterne", hint: "Bewertung in Sekunden" },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** Hero: word-by-word headline next to the animated 3D tap story. */
export default function HeroV3() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(storyStep(storyTime())), 150);
    return () => clearInterval(id);
  }, []);

  // Soft light that follows the pointer across the hero.
  const mx = useMotionValue(70);
  const my = useMotionValue(30);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bg = useMotionTemplate`radial-gradient(600px circle at ${sx}% ${sy}%, rgba(37,99,235,0.12), transparent 60%)`;

  return (
    <section
      id="top"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative isolate overflow-hidden pb-12 pt-28 sm:pt-32 lg:min-h-[100svh] lg:pb-16"
    >
      <div aria-hidden className="dot-grid absolute inset-0 -z-20" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/80 via-white/40 to-slate-50" />
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ background: bg }} />

      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
        <div className="text-center lg:text-left">
          <motion.span {...fade(0)} className="eyebrow">
            F&amp;D Solutions · München
          </motion.span>
          <h1 className="mt-6 font-heading text-[clamp(2.5rem,6vw,4.75rem)] font-extrabold leading-[1.02] tracking-tight text-slate-900">
            <WordReveal text="Ein Tap. Fünf Sterne. *Mehr* *Kunden.*" delay={0.1} />
          </h1>
          <motion.p {...fade(0.5)} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
            Wir sorgen dafür, dass Ihr Unternehmen online überzeugt: mit NFC-Platten für Google-Bewertungen, modernen Websites und
            360°-Roomtours. Persönlich betreut aus München.
          </motion.p>
          <motion.div {...fade(0.6)} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <a href="#anfrage" className="btn-primary">
              Projekt starten <Icon name="arrow" className="h-4 w-4" />
            </a>
            <a href="#nfc" className="btn-secondary">
              So funktioniert&apos;s
            </a>
          </motion.div>
          <motion.ul {...fade(0.7)} className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500 lg:justify-start">
            {["Websites ab 300 €", "Roomtours ab 300 €", "Antwort in 24 h"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-emerald-600" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div {...fade(0.3)} className="relative">
          <div className="relative mx-auto aspect-[1.1] w-full max-w-[680px]">
            <div aria-hidden className="absolute inset-[8%] rounded-full bg-gradient-to-br from-blue-200/70 via-sky-100/60 to-emerald-100/70 blur-2xl" />
            <LazyTapStory className="absolute inset-0" />
          </div>
          {/* Step labels synced with the 3D story. */}
          <ol className="mx-auto -mt-2 grid max-w-[560px] grid-cols-3 gap-2">
            {steps.map((s, i) => (
              <li
                key={s.label}
                className={`rounded-2xl border px-3 py-2.5 text-center transition-all duration-500 ${
                  step === i ? "border-brand/30 bg-white shadow-[0_8px_24px_-12px_rgba(37,99,235,0.5)]" : "border-transparent bg-white/40"
                }`}
              >
                <span className={`block text-sm font-bold ${step === i ? "text-brand" : "text-slate-400"}`}>
                  {i + 1}. {s.label}
                </span>
                <span className="hidden text-xs text-slate-500 sm:block">{s.hint}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
