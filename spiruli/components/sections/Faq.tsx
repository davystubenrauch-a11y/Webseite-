"use client";

import { useState } from "react";
import Drift from "@/components/ui/Drift";
import Split from "@/components/ui/Split";
import { site } from "@/lib/site";

const faqs = [
  { q: "Wie schmeckt SPIRULI?", a: "Fruchtig nach Holunder, frisch durch Zitrone und Orange, leicht spritzig. Die Alge schmeckt man kaum – am besten gut gekühlt." },
  { q: "Ist SPIRULI vegan und glutenfrei?", a: "Ja. Die Milchsäure stammt aus fermentiertem Gerstenmalz und ist vegan; laut Hersteller ist das Getränk trotzdem glutenfrei." },
  { q: "Wie viel Zucker ist drin?", a: "Rund 3,6 g Zucker pro 100 ml aus Agavensirup und Fruchtsaft – etwa 7 g pro Dose." },
  { q: "Ist das ein Medikament?", a: "Nein. SPIRULI ist ein Erfrischungsgetränk. Die PZN sorgt nur dafür, dass Apotheken es eindeutig bestellen können." },
  { q: "Wo bekomme ich SPIRULI?", a: `In der Apotheke über die PZN ${site.pzn} sowie im Handel. Für Händler und Praxen gibt es eine eigene Anfrage.` },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="fragen" className="relative z-10 overflow-hidden bg-fresh py-24 text-ink sm:py-32">
      <Drift src="/float/zitrone.webp" className="right-[4%] top-16 hidden w-28 rotate-[30deg] lg:block" speed={0.2} />
      <Drift src="/float/blatt.webp" className="-left-16 bottom-10 w-56 -rotate-12 opacity-90" speed={-0.12} />
      <div className="wrap relative grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p data-reveal className="label text-ink/60">
            Fragen
          </p>
          <Split className="headline mt-6 text-6xl sm:text-8xl" lines={["Kurz", "gefragt."]} />
          <p data-reveal className="mt-6 max-w-xs text-ink/70">
            Noch etwas offen? Schreib uns an{" "}
            <a href={`mailto:${site.email}`} className="font-semibold underline decoration-2 underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        </div>
        <ul className="space-y-3">
          {faqs.map((f, i) => (
            <li key={f.q} data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }} className={`rounded-3xl transition-colors duration-500 ${open === i ? "bg-ink text-mist" : "bg-mist/60 hover:bg-mist"}`}>
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center gap-5 px-6 py-6 text-left sm:px-8">
                <span className={`font-display text-lg font-extrabold ${open === i ? "text-fresh" : "text-ink/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-xl font-semibold">{f.q}</span>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl transition-transform duration-500 ${open === i ? "rotate-45 bg-fresh text-ink" : "bg-ink text-mist"}`}>+</span>
              </button>
              <div className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <p className="overflow-hidden px-6 text-lg leading-relaxed text-mist/80 sm:pl-[4.75rem] sm:pr-8">
                  <span className="block pb-7">{f.a}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
