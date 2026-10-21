"use client";

import Reveal from "@/components/ui/Reveal";
import { LazyNfcStage } from "@/components/three/Lazy";
import { configStore, useConfig } from "@/lib/configStore";
import { themes, type Theme } from "@/lib/pricing";
import Panel from "./Panel";

const steps = [
  { title: "Antippen", text: "Ihr Kunde hält sein Smartphone kurz an die Platte." },
  { title: "Google öffnet sich", text: "Ohne App und ohne Suchen, direkt bei Ihrer Bewertungsseite." },
  { title: "Sterne vergeben", text: "In wenigen Sekunden ist die Bewertung abgegeben." },
];

/** The NFC disc: dark 3D stage with colour switch and exploded view, then three steps. */
export default function NfcPanel() {
  const theme = useConfig((s) => s.theme);
  const exploded = useConfig((s) => s.exploded);
  return (
    <Panel
      id="nfc"
      title="Ein Tap. Fünf Sterne."
      lead="Eine runde Acryl-Platte mit Ø 10 cm. Im Inneren sitzt ein NFC-Chip mit dem Link zu Ihrer Google-Bewertung, ganz ohne Batterie."
    >
      <Reveal className="overflow-hidden rounded-[2rem] bg-ink">
        <div className="relative aspect-[4/3] min-h-[320px]">
          <div aria-hidden className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage/30 blur-3xl" />
          <LazyNfcStage className="absolute inset-0" cameraZ={8} spin={0.2} shadow="#000000" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 px-5 py-4 sm:px-8">
          <div className="flex gap-1 rounded-full bg-paper/10 p-1">
            {(Object.keys(themes) as Theme[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => configStore.set({ theme: k })}
                aria-pressed={theme === k}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${theme === k ? "bg-paper text-ink" : "text-paper/70 hover:text-paper"}`}
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
            className="rounded-full bg-paper/10 px-4 py-2 text-xs font-semibold text-paper/80 transition hover:text-paper"
          >
            {exploded ? "Platte schließen" : "Aufbau zeigen"}
          </button>
        </div>
      </Reveal>
      <ol className="mt-4 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-line bg-white/70 p-6">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-sage text-sm font-bold text-paper">{i + 1}</span>
            <p className="mt-5 font-heading text-lg font-bold text-ink">{s.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
