"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { configStore } from "@/lib/configStore";

/** A dated small-business homepage, the "before". */
function OldSite() {
  return (
    <div className="h-full w-full bg-[#f3eedc] p-3 text-[#222] sm:p-5" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div className="border-2 border-[#8a7f5c] bg-[#fffbe8] p-3 text-center">
        <p className="text-lg font-bold text-[#8b0000] sm:text-2xl">*** Herzlich Willkommen auf unserer Homepage!!! ***</p>
        <p className="mt-1 text-[10px] text-[#555] sm:text-xs">Café Isarblick – Ihr Café in München</p>
      </div>
      <div className="mt-3 flex gap-3">
        <ul className="w-1/4 space-y-1 border border-[#8a7f5c] bg-white p-2 text-[10px] text-[#0000ee] underline sm:text-xs">
          <li>» Startseite</li>
          <li>» Speisekarte (PDF)</li>
          <li>» Anfahrt</li>
          <li>» Gästebuch</li>
          <li>» Impressum</li>
        </ul>
        <div className="flex-1 border border-[#8a7f5c] bg-white p-2 text-[10px] leading-snug sm:p-3 sm:text-xs">
          <div className="float-right ml-2 grid h-14 w-20 place-items-center border border-dashed border-[#999] bg-[#eee] text-[9px] text-[#999] sm:h-20 sm:w-28">Bild</div>
          <p>
            Hallo und herzlich willkommen! Wir sind ein kleines Café in München. Bei uns gibt es Frühstück, Kaffee und Kuchen. Schauen Sie doch mal vorbei!!
            Öffnungszeiten finden Sie unter Anfahrt. Bitte beachten Sie das diese Seite am besten mit Internet Explorer angesehen wird.
          </p>
          <p className="mt-2 text-[#8b0000]">NEU: Jetzt auch mit Gästebuch!</p>
        </div>
      </div>
      <p className="mt-3 text-center text-[9px] text-[#777] sm:text-[10px]">Besucher: 004211 · Letzte Aktualisierung: 12.03.2014 · Optimiert für 1024×768</p>
    </div>
  );
}

/** The same business as a modern, mobile-first site, the "after". */
function NewSite() {
  return (
    <div className="h-full w-full bg-white font-sans text-slate-900">
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        <span className="text-sm font-extrabold tracking-tight">Café Isarblick</span>
        <span className="hidden gap-4 text-[11px] text-slate-500 sm:flex">
          <span>Speisekarte</span>
          <span>Über uns</span>
          <span>Kontakt</span>
        </span>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white">Reservieren</span>
      </div>
      <div className="relative mx-3 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-4 text-white sm:mx-5 sm:p-7">
        <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-300/40 blur-2xl" />
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
          <span className="text-amber-300">★</span> 4,9 auf Google
        </span>
        <p className="mt-2 max-w-[16rem] text-xl font-extrabold leading-tight sm:text-3xl">Frühstück mit Blick auf die Isar.</p>
        <p className="mt-1 text-[10px] text-blue-100 sm:text-xs">Täglich ab 8 Uhr · Glockenbachviertel</p>
        <span className="mt-3 inline-block rounded-full bg-amber-400 px-3 py-1.5 text-[10px] font-bold text-slate-900 sm:text-xs">Tisch reservieren</span>
      </div>
      <div className="mx-3 mt-3 grid grid-cols-3 gap-2 sm:mx-5 sm:gap-3">
        {[
          ["bg-emerald-100 text-emerald-700", "Frühstück"],
          ["bg-blue-100 text-blue-700", "Kaffee"],
          ["bg-amber-100 text-amber-700", "Kuchen"],
        ].map(([c, t]) => (
          <div key={t} className="rounded-xl border border-slate-100 p-2 sm:p-3">
            <span className={`block h-6 w-6 rounded-lg sm:h-8 sm:w-8 ${c.split(" ")[0]}`} />
            <p className={`mt-1.5 text-[10px] font-bold sm:text-xs ${c.split(" ")[1]}`}>{t}</p>
            <span className="mt-1 block h-1 w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Drag-to-compare: old homepage on the left, the modern version revealed on the right. */
export default function WebCompare() {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const touched = useRef(false);
  const inView = useInView(box, { once: true, amount: 0.5 });

  // Hint animation once the slider scrolls into view.
  useEffect(() => {
    if (!inView) return;
    const c = animate(50, [50, 18, 80, 50], {
      duration: 2.6,
      ease: "easeInOut",
      onUpdate: (v: number) => {
        if (!touched.current) setPos(v);
      },
    });
    return () => c.stop();
  }, [inView]);

  const move = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section id="web" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          center
          eyebrow="Webseiten-Erstellung · ab 300 €"
          title={
            <>
              Aus <span className="text-slate-400 line-through decoration-2">veraltet</span> wird <span className="text-brand">überzeugend.</span>
            </>
          }
          lead="Ziehen Sie den Regler: So kann der Unterschied für Ihr Unternehmen aussehen."
        />

        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.45)]">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 flex flex-1 items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] text-slate-500">
                <Icon name="lock" className="h-3 w-3 text-emerald-600" /> cafe-isarblick.de
              </span>
            </div>
            <div
              ref={box}
              className="relative h-[340px] cursor-ew-resize touch-pan-y select-none sm:h-[440px]"
              onPointerDown={(e) => {
                touched.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                move(e.clientX);
              }}
              onPointerMove={(e) => e.buttons === 1 && move(e.clientX)}
            >
              <div className="absolute inset-0">
                <NewSite />
              </div>
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                <OldSite />
              </div>
              <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white">Vorher</span>
              <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">Nachher</span>
              {/* Handle */}
              <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
                <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.15)]" />
                <button
                  type="button"
                  role="slider"
                  aria-label="Vorher-Nachher-Vergleich"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(pos)}
                  onKeyDown={(e) => {
                    touched.current = true;
                    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
                    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
                  }}
                  className="pointer-events-auto absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-slate-200"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: "web", title: "Für jedes Gerät", text: "Sieht auf Handy, Tablet und Computer gut aus.", c: "bg-blue-50 text-blue-600" },
            { icon: "spark", title: "Schnell & modern", text: "Kurze Ladezeiten und ein aufgeräumtes Design.", c: "bg-emerald-50 text-emerald-600" },
            { icon: "star", title: "Gut gefunden", text: "Google Maps, Bewertungen und SEO-Grundlagen inklusive.", c: "bg-amber-50 text-amber-600" },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className="card card-hover flex gap-4 p-5">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${f.c}`}>
                <Icon name={f.icon} />
              </span>
              <div>
                <p className="font-bold text-slate-900">{f.title}</p>
                <p className="mt-1 text-sm text-slate-600">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#preise" onClick={() => configStore.set({ inquiryServices: Array.from(new Set([...configStore.get().inquiryServices, "web" as const])) })} className="btn-primary">
            Website-Pakete ansehen <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
