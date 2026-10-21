"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/Reveal";
import { LazyShowcaseStage } from "@/components/three/Lazy";
import { accents } from "@/lib/accents";
import { configStore } from "@/lib/configStore";
import { services } from "@/lib/content";
import type { ServiceId } from "@/lib/pricing";

// Backdrop behind the sticky 3D stage, one per service (cross-faded).
const backdrops = [
  "bg-gradient-to-br from-emerald-100 via-sky-50 to-white",
  "bg-gradient-to-br from-blue-100 via-indigo-50 to-white",
  "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
];
const captions = ["NFC Review Disc · Ø 10 cm", "Beispiel-Website", "360°-Raumscan"];

const inquire = (id: ServiceId) => {
  const cur = configStore.get().inquiryServices;
  if (!cur.includes(id)) configStore.set({ inquiryServices: [...cur, id] });
};

/**
 * Scroll story: the 3D stage stays pinned while the service texts scroll past.
 * The stage swaps model (disc → laptop → room) as each text reaches the middle of the screen.
 */
export default function Showcase() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="leistungen" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Leistungen" title="Drei Leistungen. Ein Ansprechpartner." lead="Scrollen Sie durch unsere Leistungen. Das 3D-Modell zeigt jeweils, worum es geht." />

        <div className="mt-10 flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-14">
          {/* Pinned stage */}
          <div className="sticky top-20 z-10 h-[38vh] min-h-[260px] lg:top-28 lg:h-[calc(100vh-9rem)] lg:max-h-[640px]">
            <div className="relative h-full overflow-hidden rounded-3xl border border-slate-200 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.35)]">
              {backdrops.map((b, i) => (
                <div key={b} aria-hidden className={`absolute inset-0 transition-opacity duration-700 ${b} ${active === i ? "opacity-100" : "opacity-0"}`} />
              ))}
              <LazyShowcaseStage className="absolute inset-0" active={active} />
              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${active === 2 ? "bg-white/10 text-white" : "bg-white/80 text-slate-700"}`}>
                  {captions[active]}
                </span>
                <span className="flex gap-1.5">
                  {services.map((s, i) => (
                    <span key={s.id} className={`h-1.5 rounded-full transition-all ${active === i ? "w-6 bg-brand" : active === 2 ? "w-1.5 bg-white/40" : "w-1.5 bg-slate-300"}`} />
                  ))}
                </span>
              </div>
            </div>
          </div>

          {/* Scrolling texts */}
          <div className="relative z-0">
            {services.map((s, i) => {
              const a = accents[s.id];
              return (
                <article
                  key={s.id}
                  data-index={i}
                  ref={(el) => {
                    steps.current[i] = el;
                  }}
                  className={`flex min-h-[70vh] flex-col justify-center py-10 transition-opacity duration-500 lg:min-h-[85vh] ${active === i ? "opacity-100" : "opacity-40"}`}
                >
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl border ${a.chip}`}>
                    <Icon name={s.id} className="h-6 w-6" />
                  </span>
                  <p className={`mt-6 text-xs font-bold uppercase tracking-[0.2em] ${a.kicker}`}>
                    {String(i + 1).padStart(2, "0")} · {s.kicker}
                  </p>
                  <h3 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{s.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600">{s.text}</p>
                  <ul className="mt-6 space-y-2.5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-slate-700">
                        <Icon name="check" className={`h-5 w-5 shrink-0 ${a.check}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href="#anfrage" onClick={() => inquire(s.id)} className="btn-primary">
                      Anfragen
                    </a>
                    <a href="#preise" className="btn-secondary">
                      Preise
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
