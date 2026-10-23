"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "#zutaten", label: "Zutaten" },
  { href: "#naehrstoffe", label: "Nährstoffe" },
  { href: "#qualitaet", label: "Qualität" },
  { href: "#team", label: "Team" },
];

/** Pill navigation like a printed label: readable over every colour field. */
export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="wrap flex items-center justify-between py-4">
        <nav className="hidden gap-1.5 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="pill bg-lime text-ink ring-1 ring-ink/20">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#top" className="pill bg-lime px-5 font-display !text-base !font-semibold !tracking-[0.2em] text-ink ring-1 ring-ink/20" aria-label="SPIRULI – nach oben">
          SPIRULI®
        </a>
        <div className="flex gap-1.5">
          <a href="#kaufen" className="pill bg-ink text-lime">
            Wo kaufen?
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Menü" className="pill bg-lime text-ink ring-1 ring-ink/20 md:hidden">
            {open ? "Schließen" : "Menü"}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="wrap flex flex-col gap-2 pb-4 md:hidden"
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="pill justify-start bg-lime !py-3 !text-sm text-ink">
                {l.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
