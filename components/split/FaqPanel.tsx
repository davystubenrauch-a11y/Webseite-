"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "@/lib/content";
import Panel from "./Panel";

/** Accordion of common questions. */
export default function FaqPanel() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Panel id="faq" title="Häufige Fragen." lead="Ihre Frage ist nicht dabei? Rufen Sie uns an oder schreiben Sie uns.">
      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={`rounded-2xl border transition ${isOpen ? "border-ink/20 bg-white" : "border-line bg-white/50"}`}>
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left">
                <span className="font-heading font-bold text-ink">{f.q}</span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-lg transition ${isOpen ? "rotate-45 bg-ink text-paper" : "bg-sand text-ink"}`}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-6 pb-6 text-[15px] leading-relaxed text-ink-muted">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
