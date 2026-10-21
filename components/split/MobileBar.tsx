"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoInline } from "@/components/brand/Logo";
import { sections } from "./sections";

/** Top bar for small screens (the sidebar index is desktop-only). */
export default function MobileBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-paper/90 backdrop-blur-xl lg:hidden">
      <div className="flex h-16 items-center justify-between px-5 sm:px-8">
        <LogoInline />
        <div className="flex items-center gap-2">
          <a href="#anfrage" className="btn-primary !px-4 !py-2 !text-xs">
            Anfragen
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            className="grid h-10 w-10 place-items-center rounded-full border border-line"
          >
            <span className="relative block h-2.5 w-4">
              <span className={`absolute left-0 h-0.5 w-4 rounded bg-ink transition ${open ? "top-1 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-0.5 w-4 rounded bg-ink transition ${open ? "top-1 -rotate-45" : "top-2.5"}`} />
            </span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.ol initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden px-5 sm:px-8">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} onClick={() => setOpen(false)} className="flex gap-4 border-t border-line py-4 text-lg font-semibold text-ink">
                  <span className="w-6 text-sm text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </header>
  );
}
