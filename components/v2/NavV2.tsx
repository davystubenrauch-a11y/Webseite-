"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monogram } from "@/components/brand/Logo";
import { navV2 } from "./nav";

/** Floating pill navigation, centred at the top of the viewport. */
export default function NavV2() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3">
      <nav
        aria-label="Hauptnavigation"
        className={`mx-auto flex max-w-4xl items-center justify-between rounded-full border bg-white/85 py-2 pl-5 pr-2 backdrop-blur-xl transition-shadow ${
          scrolled ? "border-slate-200 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.35)]" : "border-transparent"
        }`}
      >
        <a href="#top" aria-label="F&D Solutions – nach oben" className="flex items-center gap-2">
          <Monogram className="h-7 w-auto" />
          <span className="hidden text-sm font-bold tracking-tight text-slate-900 sm:block">Solutions</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {navV2.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href="#anfrage" className="btn-primary !px-5 !py-2.5">
            Anfragen
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-0.5 w-4 rounded bg-slate-800 transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-4 rounded bg-slate-800 transition ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-4 rounded bg-slate-800 transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="card mx-auto mt-2 max-w-4xl p-2 md:hidden"
          >
            {navV2.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50">
                  {n.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
