"use client";

import { useRef } from "react";
import { ingredients } from "@/lib/site";

const cards = [
  { name: "Spirulina", latin: "Spirulina platensis", text: "Die Mikroalge liefert natürliche B-Vitamine und Aminosäuren.", cls: "bg-algae text-mist", dot: "bg-fresh" },
  { name: "Holunder", latin: "Sambucus nigra", text: "Beerig und samtig – der Grundgeschmack. Laut Hersteller pestizidfrei aus Mitteleuropa.", cls: "bg-berry text-mist", dot: "bg-[#8e5a86]" },
  { name: "Zitrone & Orange", latin: "Citrus", text: "Frische Säure für einen klaren, spritzigen Abgang.", cls: "bg-citrus text-ink", dot: "bg-[#e0c341]" },
  { name: "Rotalge", latin: "Lithothamnium calcareum", text: "Die zweite Alge im Namen – das LI in SPIRULI.", cls: "bg-teal text-mist", dot: "bg-[#7cc6c9]" },
];

/** Product photo next to a swipeable row of ingredient cards, then the full list. */
export default function Zutaten() {
  const row = useRef<HTMLDivElement>(null);
  const go = (dir: number) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section id="zutaten" className="py-24 sm:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-reveal className="headline text-6xl sm:text-8xl">
            Was <span className="text-teal">drin</span> ist
          </h2>
          <div className="flex gap-2">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => go(d)}
                aria-label={d < 0 ? "Zurück" : "Weiter"}
                className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 text-lg transition-colors hover:bg-ink hover:text-mist"
              >
                {d < 0 ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <figure data-reveal className="overflow-hidden rounded-3xl">
            <img src="/spiruli-can.jpg" alt="SPIRULI Dose auf Schiefer mit Holunder, Zitrone und Spirulina" loading="lazy" className="h-full max-h-[640px] w-full object-cover" />
          </figure>
          <div ref={row} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
            {cards.map((c, i) => (
              <article
                key={c.name}
                data-reveal
                style={{ ["--d" as string]: `${i * 0.08}s` }}
                className={`flex min-h-[420px] w-[78%] shrink-0 snap-start flex-col justify-between rounded-3xl p-8 sm:w-[46%] ${c.cls}`}
              >
                <span className={`h-14 w-14 rounded-full ${c.dot}`} />
                <div>
                  <p className="text-sm italic opacity-70">{c.latin}</p>
                  <h3 className="headline mt-2 text-4xl sm:text-5xl">{c.name}</h3>
                  <p className="mt-4 leading-relaxed opacity-80">{c.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <ol data-reveal className="mt-16 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((ing, i) => (
            <li key={ing.name} className="flex items-baseline gap-4 border-b border-line py-4 sm:pr-6">
              <span className="w-6 text-sm tabular-nums text-ink/40">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-medium">{ing.name}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-ink/60">Vegan · glutenfrei · mit Kohlensäure · gesüßt mit Agavensirup</p>
      </div>
    </section>
  );
}
