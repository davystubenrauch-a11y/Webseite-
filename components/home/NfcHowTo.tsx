"use client";

import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { LazyNfcStage } from "@/components/three/Lazy";
import { configStore, useConfig } from "@/lib/configStore";
import { themes, type Theme } from "@/lib/pricing";

const steps = [
  { title: "Handy an die Platte halten", text: "Ihr Kunde hält sein Smartphone kurz an die NFC-Platte." },
  { title: "Google-Bewertung öffnet sich", text: "Ohne App und ohne Suchen landet er direkt auf Ihrer Bewertungsseite." },
  { title: "Sterne vergeben, fertig", text: "In wenigen Sekunden ist die Bewertung abgegeben." },
];

/** How the NFC disc works: three numbered steps next to the interactive 3D model. */
export default function NfcHowTo() {
  const theme = useConfig((s) => s.theme);
  const exploded = useConfig((s) => s.exploded);

  return (
    <section id="nfc" className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-2 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-50 lg:order-1">
          <div className="relative aspect-square">
            <LazyNfcStage className="absolute inset-0" particles={0} cameraZ={8} spin={0.25} />
          </div>
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1 rounded-full bg-white/90 p-1 shadow-sm">
              {(Object.keys(themes) as Theme[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => configStore.set({ theme: k })}
                  aria-pressed={theme === k}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme === k ? "bg-slate-900 text-white" : "text-slate-600"}`}
                >
                  <span className="h-3 w-3 rounded-full border border-slate-300" style={{ background: themes[k].swatch }} />
                  {themes[k].label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => configStore.set({ exploded: !exploded })}
              aria-pressed={exploded}
              className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:text-emerald-700"
            >
              {exploded ? "Platte schließen" : "Aufbau zeigen"}
            </button>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHead eyebrow="NFC-Platte" title="So einfach sammeln Sie Bewertungen." />
          <div className="mt-8 space-y-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="flex gap-5 rounded-3xl border border-slate-200 bg-white p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-600 font-heading text-lg font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="font-bold text-slate-900">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {["Ø 10 cm Acryl", "Weiß oder Schwarz", "Funktioniert mit iPhone & Android", "Keine Batterie"].map((t) => (
              <li key={t} className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                <Icon name="check" className="h-3.5 w-3.5" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
