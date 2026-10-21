"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { LazyRoomTour } from "@/components/three/Lazy";
import { VIEWS } from "@/lib/roomViews";
import { configStore } from "@/lib/configStore";

const notes = [
  "Ziehen zum Umsehen, scrollen oder zwei Finger zum Zoomen.",
  "Sofa, Couchtisch und Fensterplatz: Interessenten sehen den Raum so, wie er wirklich ist.",
  "Info-Punkte zeigen Details wie Maße, Ausstattung oder Besonderheiten.",
  "Von Raum zu Raum, ganz ohne Besichtigungstermin.",
];

/** Interactive 3D demo room with guided viewpoints. */
export default function RoomTourSection() {
  const [view, setView] = useState(0);
  return (
    <section id="roomtour" className="bg-gradient-to-b from-slate-50 via-amber-50/60 to-slate-50 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          center
          eyebrow="Roomtour & 360° · ab 300 €"
          title={
            <>
              Räume erleben, <span className="text-amber-600">bevor man sie betritt.</span>
            </>
          }
          lead="Probieren Sie es aus: Bewegen Sie sich durch diesen Beispielraum oder springen Sie über die Info-Punkte direkt in einen Bereich."
        />

        <Reveal className="mt-12">
          <div className="relative h-[460px] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-sky-50 to-amber-50 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.45)] sm:h-[600px]">
            <LazyRoomTour className="absolute inset-0" view={view} onPick={setView} />
            <div className="pointer-events-none absolute left-4 top-4 max-w-[17rem] rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                Beispielraum
              </p>
              <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <p className="mt-1 font-heading text-lg font-bold text-slate-900">{VIEWS[view].label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{notes[view]}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
              <div className="flex gap-1 overflow-x-auto rounded-full bg-white/90 p-1 shadow-lg backdrop-blur">
                {VIEWS.map((v, i) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setView(i)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${view === i ? "bg-amber-500 text-white" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["360°-Rundgang", "Zum Einbetten auf Website und Immobilienportalen."],
            ["Walkthrough-Video", "Für Exposé, Social Media und Ihre Website."],
            ["Grundriss & Info-Punkte", "Maße und Details direkt im Rundgang."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08} className="card card-hover flex gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Icon name="roomtour" />
              </span>
              <div>
                <p className="font-bold text-slate-900">{t}</p>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="#preise"
            onClick={() => configStore.set({ inquiryServices: Array.from(new Set([...configStore.get().inquiryServices, "roomtour" as const])) })}
            className="btn-primary !bg-amber-500 hover:!bg-amber-600"
          >
            Roomtour-Pakete ansehen <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
