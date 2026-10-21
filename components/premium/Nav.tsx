"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoInline } from "@/components/brand/Logo";
import { nav } from "@/lib/site";

/** Transparent at the top, frosted glass once the page scrolls. */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-line/70 bg-paper/90 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Hauptnavigation" className="container-site flex h-20 items-center justify-between">
        <LogoInline />
        <ul className="hidden items-center gap-9 lg:flex">
          {nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="group relative text-sm text-ink-muted transition hover:text-ink">
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#anfrage" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            Projekt besprechen
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
          >
            <span className="relative block h-2.5 w-5">
              <span className={`absolute left-0 h-px w-5 bg-ink transition ${open ? "top-1 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-5 bg-ink transition ${open ? "top-1 -rotate-45" : "top-2.5"}`} />
            </span>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden lg:hidden">
            <ul className="container-site pb-8 pt-2">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block border-b border-line py-4 font-heading text-2xl text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
              <li className="pt-6">
                <a href="#anfrage" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Projekt besprechen
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
