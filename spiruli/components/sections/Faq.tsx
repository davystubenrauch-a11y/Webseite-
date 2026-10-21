"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";

const faqs = [
  {
    q: "Was ist SPIRULI?",
    a: "SPIRULI ist das vegane & natürliche Mehrwertgetränk mit natürlichen B-Vitaminen und essentiellen Aminosäuren – auf Basis einer fermentierten Holunder-Zitrus-Algen-Mischung.",
  },
  {
    q: "Wie schmeckt SPIRULI?",
    a: "Beerig vom Holunder, frisch von der Zitrus-Note und rund durch die fermentierte Algenbasis. Am besten gut gekühlt.",
  },
  { q: "Ist SPIRULI vegan?", a: "Ja. SPIRULI ist 100 % pflanzlich – das Vegan-Siegel finden Sie auf dem Goldband der Dose." },
  {
    q: "Wo bekomme ich SPIRULI?",
    a: `In der Apotheke. Nennen Sie einfach die PZN ${site.pzn} – die Apotheke kann SPIRULI darüber bestellen.`,
  },
  {
    q: "Was bedeutet die PZN?",
    a: "Die Pharmazentralnummer ist die bundesweit eindeutige Nummer, unter der Produkte im Apothekenhandel bei der IFA GmbH gelistet sind.",
  },
  { q: "Wer prüft die Qualität?", a: "Der Qualitätsschutzprozess von SPIRULI wird von SGS Fresenius analysiert und zertifiziert." },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-berry-soft py-24 sm:py-32">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div data-reveal>
          <span className="kicker bg-cream">Fragen</span>
          <h2 className="display mt-5 text-5xl sm:text-7xl">Gut, dass Sie fragen.</h2>
          <p className="mt-4 font-hand text-3xl font-bold text-berry">Noch was offen? Schreiben Sie uns!</p>
          <a href={`mailto:${site.email}`} className="btn-line mt-6">
            {site.email}
          </a>
        </div>
        <ul data-reveal-stagger className="grid gap-3">
          {faqs.map((f, i) => (
            <li key={f.q} className="sticker overflow-hidden bg-cream">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <span className="text-xl font-extrabold">{f.q}</span>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink text-xl font-bold transition-all ${open === i ? "rotate-45 bg-lime" : ""}`}>
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-lg leading-snug text-ink/85">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
