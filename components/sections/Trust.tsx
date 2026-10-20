"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { seals, stats, testimonials } from "@/lib/content";

export default function Trust() {
  return (
    <section id="referenzen" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          center
          eyebrow="Kundenstimmen"
          title={
            <>
              Darauf können Sie sich <span className="text-gold">verlassen.</span>
            </>
          }
        />

        <Stats />
        <Testimonials />

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {seals.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-gold/40">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition group-hover:shadow-rim">
                <Icon name="shield" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">{s.title}</span>
                <span className="block text-xs text-white/50">{s.text}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <div ref={ref} className="mt-10 grid grid-cols-2 overflow-hidden rounded-3xl border border-white/10 lg:grid-cols-4">
      {stats.map((s, i) => {
                return (
          <div key={s.label} className={`bg-white/[0.02] p-6 text-center sm:p-10 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} border-white/10 lg:border-l lg:first:border-l-0`}>
            <p className="font-serif text-4xl font-semibold text-gold-soft sm:text-5xl">
              <AnimatedNumber value={inView ? s.value : 0} format={(n) => Math.round(n).toLocaleString("de-DE")} />
              <span className="text-2xl sm:text-3xl">{s.suffix}</span>
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/45">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6500);
    return () => clearInterval(t);
  }, [paused]);
  const t = testimonials[i];

  return (
    <Reveal className="mt-10">
      <div
        className="glass rim relative overflow-hidden px-6 py-12 text-center sm:px-16 sm:py-16"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <span aria-hidden className="absolute left-6 top-0 font-serif text-[10rem] leading-none text-gold/10 sm:left-12">
          &ldquo;
        </span>
        <div className="flex justify-center gap-1 text-google-yellow" aria-label="5 von 5 Sternen">
          {Array.from({ length: 5 }).map((_, k) => (
            <Icon key={k} name="star" className="h-5 w-5 fill-current" />
          ))}
        </div>
        <div className="relative min-h-[200px] sm:min-h-[160px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.6 }}
            >
              <blockquote className="mx-auto mt-6 max-w-3xl font-serif text-2xl leading-snug text-white sm:text-3xl">{t.quote}</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold text-gold-soft">{t.name}</span>
                <span className="text-white/45"> · {t.role}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, k) => (
            <button
              key={k}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Stimme ${k + 1} anzeigen`}
              className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-gold" : "w-3 bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
