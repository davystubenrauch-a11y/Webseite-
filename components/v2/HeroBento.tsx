"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { LazyNfcStage } from "@/components/three/Lazy";
import { site, telHref } from "@/lib/site";

const LOOK = { theme: "white", lang: "en", business: "" } as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("");

/** Centred headline over a bento grid: the 3D disc as the hero tile, services and team around it. */
export default function HeroBento() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-36">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-gradient-to-b from-blue-50 via-sky-50/60 to-transparent" />

      <div className="mx-auto max-w-3xl text-center">
        <motion.span {...rise(0)} className="eyebrow">
          F&amp;D Solutions · München
        </motion.span>
        <motion.h1 {...rise(0.08)} className="mt-6 font-heading text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-slate-900">
          Bewertungen, Websites und Roomtours. <span className="text-brand">Einfach gemacht.</span>
        </motion.h1>
        <motion.p {...rise(0.16)} className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Wir helfen Unternehmen, online so zu überzeugen wie im persönlichen Gespräch. Fair bepreist und direkt mit uns, ohne Umwege.
        </motion.p>
        <motion.div {...rise(0.24)} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#anfrage" className="btn-primary">
            Projekt starten <Icon name="arrow" className="h-4 w-4" />
          </a>
          <a href="#preise" className="btn-secondary">
            Preise ansehen
          </a>
        </motion.div>
      </div>

      <motion.div {...rise(0.32)} className="mx-auto mt-14 grid max-w-6xl auto-rows-[minmax(150px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 3D product tile */}
        <div className="card relative overflow-hidden sm:col-span-2 sm:row-span-2">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-blue-100 via-sky-50 to-emerald-100" />
          <LazyNfcStage className="absolute inset-0" look={LOOK} particles={0} cameraZ={7.2} spin={0.3} />
          <div className="pointer-events-none relative flex h-full min-h-[340px] flex-col justify-between p-6">
            <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 backdrop-blur">NFC Review Disc</span>
            <div className="flex items-end justify-between">
              <p className="max-w-[12rem] text-sm font-medium text-slate-700">Handy dranhalten, Google-Bewertung öffnet sich.</p>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-slate-500 backdrop-blur">zum Drehen ziehen</span>
            </div>
          </div>
        </div>

        {/* Websites */}
        <a href="#leistungen" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white sm:col-span-2">
          <div className="flex h-full flex-col justify-between gap-6">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
                <Icon name="web" />
              </span>
              <Icon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" />
            </div>
            <div>
              <p className="text-sm text-blue-100">Webseiten-Erstellung</p>
              <p className="font-heading text-3xl font-extrabold">ab 300 €</p>
            </div>
          </div>
          {/* Mini browser illustration */}
          <div aria-hidden className="absolute -bottom-6 right-6 hidden w-48 rounded-t-xl bg-white/95 p-2 shadow-xl transition duration-500 group-hover:-translate-y-2 sm:block">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-2 h-10 rounded bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="mt-2 grid grid-cols-3 gap-1">
              <span className="h-6 rounded bg-slate-100" />
              <span className="h-6 rounded bg-slate-100" />
              <span className="h-6 rounded bg-slate-100" />
            </div>
          </div>
        </a>

        {/* Roomtours */}
        <a href="#leistungen" className="group flex flex-col justify-between rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-600">
            <Icon name="roomtour" />
          </span>
          <div>
            <p className="text-sm text-amber-800">Roomtour & 360°</p>
            <p className="font-heading text-3xl font-extrabold text-slate-900">ab 300 €</p>
          </div>
        </a>

        {/* Team */}
        <a href="#team" className="card card-hover flex flex-col justify-between p-6">
          <div className="flex -space-x-2">
            {site.founders.map((f, i) => (
              <span
                key={f.name}
                className={`grid h-11 w-11 place-items-center rounded-full border-2 border-white text-sm font-bold text-white ${i ? "bg-emerald-500" : "bg-brand"}`}
              >
                {initials(f.name)}
              </span>
            ))}
          </div>
          <div>
            <p className="font-semibold text-slate-900">Persönlich betreut</p>
            <p className="text-sm text-slate-500">Antwort innerhalb von 24 h</p>
          </div>
        </a>
      </motion.div>

      <p className="mx-auto mt-6 max-w-6xl text-center text-sm text-slate-500">
        Lieber direkt sprechen?{" "}
        <a href={telHref(site.founders[1].phone)} className="font-semibold text-brand hover:underline">
          {site.founders[1].phone}
        </a>
      </p>
    </section>
  );
}
