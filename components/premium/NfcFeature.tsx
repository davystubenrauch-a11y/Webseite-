"use client";

import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { LazyNfcStage } from "@/components/three/Lazy";
import { configStore, useConfig } from "@/lib/configStore";
import { themes, type Theme } from "@/lib/pricing";

const steps = [
  { title: "Antippen", text: "Ihr Kunde hält sein Smartphone kurz an die Platte." },
  { title: "Bewertungsseite öffnet sich", text: "Ohne App und ohne Suchen, direkt bei Ihrem Google-Profil." },
  { title: "Sterne vergeben", text: "In wenigen Sekunden ist die Bewertung abgegeben." },
];

/** Dark band presenting the NFC disc: interactive 3D model next to three steps. */
export default function NfcFeature() {
  const theme = useConfig((s) => s.theme);
  const exploded = useConfig((s) => s.exploded);

  return (
    <section id="nfc" className="section relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="absolute -left-40 top-1/4 h-[560px] w-[560px] rounded-full bg-sage/25 blur-[140px]" />
      <div className="container-site relative">
        <div className="grid-12 items-center gap-y-16">
          <Reveal className="col-span-4 sm:col-span-8 lg:col-span-6">
            <div className="overflow-hidden rounded-[2rem] border border-paper/10 bg-gradient-to-b from-paper/[0.07] to-transparent">
              <div className="relative aspect-square">
                <LazyNfcStage className="absolute inset-0" cameraZ={8} spin={0.2} shadow="#000000" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 px-5 py-4">
                <div className="flex gap-1 rounded-full border border-paper/15 bg-paper/10 p-1 backdrop-blur-md">
                  {(Object.keys(themes) as Theme[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => configStore.set({ theme: k })}
                      aria-pressed={theme === k}
                      className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs transition ${theme === k ? "bg-paper text-ink" : "text-paper/70 hover:text-paper"}`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full ring-1 ring-paper/40" style={{ background: themes[k].swatch }} />
                      {themes[k].label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => configStore.set({ exploded: !exploded })}
                  aria-pressed={exploded}
                  className="rounded-full border border-paper/15 bg-paper/10 px-4 py-2 text-xs text-paper/80 backdrop-blur-md transition hover:text-paper"
                >
                  {exploded ? "Platte schließen" : "Aufbau zeigen"}
                </button>
              </div>
            </div>
          </Reveal>

          <div className="col-span-4 sm:col-span-8 lg:col-span-5 lg:col-start-8">
            <SectionHead
              dark
              eyebrow="NFC Review Disc"
              title={
                <>
                  Ein Tap. <em className="italic text-taupe">Fünf Sterne.</em>
                </>
              }
              lead="Eine runde Acryl-Platte mit Ø 10 cm, in Weiß oder Schwarz. Im Inneren sitzt ein NFC-Chip mit dem Link zu Ihrer Google-Bewertung."
            />
            <ol className="mt-12 space-y-0">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-6 border-t border-paper/10 py-6">
                  <span className="font-heading text-sm italic text-taupe">0{i + 1}</span>
                  <div>
                    <p className="font-heading text-xl text-paper">{s.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-paper/60">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
