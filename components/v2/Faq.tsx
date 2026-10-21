"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHead } from "@/components/ui/Reveal";

const faqs = [
  {
    q: "Wie funktioniert die NFC-Platte?",
    a: "In der Platte steckt ein NFC-Chip mit dem Link zu Ihrer Google-Bewertungsseite. Hält ein Kunde sein Smartphone daran, öffnet sich die Seite direkt im Browser.",
  },
  {
    q: "Brauchen meine Kunden eine App?",
    a: "Nein. Aktuelle iPhones und Android-Smartphones lesen NFC ohne zusätzliche App. Bei Android muss NFC in den Einstellungen aktiviert sein, was meist der Fall ist.",
  },
  {
    q: "Was bekomme ich für eine Website ab 300 €?",
    a: "Das Basis-Paket ist ein moderner One-Pager mit Ihren Inhalten, optimiert für Handy und Computer, inklusive Kontaktformular, Impressum und Datenschutz. Mehr Seiten oder Funktionen gibt es in den größeren Paketen.",
  },
  {
    q: "Wie läuft eine Roomtour ab?",
    a: "Wir vereinbaren einen Termin vor Ort, nehmen die Räume auf und bereiten den Rundgang auf. Sie erhalten einen Link, den Sie auf Ihrer Website oder auf Immobilienportalen einbinden können.",
  },
  {
    q: "Gibt es versteckte Kosten?",
    a: "Nein. Sie bekommen vorab ein Festpreis-Angebot. Laufende Kosten entstehen nur, wenn Sie zum Beispiel Hosting und Wartung bei uns buchen.",
  },
];

/** Accordion with the most common questions. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.4fr]">
        <SectionHead eyebrow="FAQ" title="Häufige Fragen." lead="Ihre Frage ist nicht dabei? Rufen Sie uns einfach an oder schreiben Sie uns." />
        <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-slate-900"
                >
                  {f.q}
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${isOpen ? "rotate-45 bg-brand text-white" : "bg-slate-100 text-slate-600"}`}>
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-6 pb-5 leading-relaxed text-slate-600">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
