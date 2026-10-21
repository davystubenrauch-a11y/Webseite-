"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHead } from "@/components/ui/Reveal";
import { faqs } from "@/lib/content";

/** Accordion with hairline dividers. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section">
      <div className="container-site">
        <div className="grid-12 gap-y-12">
          <SectionHead
            className="col-span-4 sm:col-span-8 lg:col-span-4"
            eyebrow="FAQ"
            title="Häufige Fragen."
            lead="Ihre Frage ist nicht dabei? Rufen Sie uns an oder schreiben Sie uns."
          />
          <div className="col-span-4 border-t border-ink/15 sm:col-span-8 lg:col-span-7 lg:col-start-6">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="border-b border-ink/15">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-7 text-left"
                  >
                    <span className="font-heading text-xl text-ink">{f.q}</span>
                    <span className="relative h-4 w-4 shrink-0" aria-hidden>
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-ink" />
                      <span className={`absolute left-1/2 top-0 h-4 w-px bg-ink transition-transform duration-300 ${isOpen ? "scale-y-0" : ""}`} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-8 text-[15px] leading-[1.8] text-ink-muted">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
