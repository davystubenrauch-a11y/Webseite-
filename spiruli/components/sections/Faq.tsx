"use client";

import { useState } from "react";
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
    <section id="fragen" className="relative z-10 bg-mist py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p data-reveal className="label text-teal">
            Fragen
          </p>
          <Split className="headline mt-6 text-6xl sm:text-7xl" lines={["Kurz", <span key="b" className="text-teal">gefragt.</span>]} />
        </div>
        <ul className="border-t border-line">
          {faqs.map((f, i) => (
            <li key={f.q} className="border-b border-line">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                <span className="text-xl font-medium">{f.q}</span>
                <span className={`text-2xl text-ink/50 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                <p className="max-w-2xl overflow-hidden text-lg leading-relaxed text-ink/70">{f.a}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
