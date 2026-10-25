"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import CanPose from "@/components/stage/CanPose";

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
    <section id="fragen" className="relative border-t border-cream-line bg-cream-warm py-24 sm:py-32">
      <CanPose at="40%" pose={{ x: 0.45, y: -1.5, s: 1, ry: 17.5, rz: -0.08, o: 0 }} />
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="label text-petrol">Fragen</p>
          <h2 className="headline mt-4 text-5xl text-petrol-deep sm:text-6xl">Kurz gefragt.</h2>
        </div>
        <ul className="border-t border-ink/20">
          {faqs.map((f, i) => (
            <li key={f.q} className="border-b border-ink/20">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-5 text-left">
                <span className="text-xl font-bold">{f.q}</span>
                <span className={`text-2xl transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {open === i && <p className="max-w-2xl pb-6 text-lg leading-relaxed text-ink/75">{f.a}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
