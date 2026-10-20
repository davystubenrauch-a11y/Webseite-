"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const links = [
  { href: "#story", label: "Expertise" },
  { href: "#geschmack", label: "Geschmack" },
  { href: "#matrix", label: "Nährstoffe" },
  { href: "#qualitaet", label: "Qualität" },
];

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
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 sm:px-6 ${
          scrolled ? "border border-white/10 bg-petrol-900/75 shadow-rim backdrop-blur-xl" : "border border-transparent"
        }`}
      >
        <Logo />
        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group relative font-display text-xs font-semibold uppercase tracking-[0.22em] text-white/70 transition hover:text-white">
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#bezug" className="btn-gold hidden !px-5 !py-2.5 !text-xs sm:inline-flex">
            Jetzt entdecken
          </a>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü öffnen"
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-white transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-4 bg-white transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass mx-auto mt-3 max-w-7xl bg-petrol-900/90 p-4 md:hidden"
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-display uppercase tracking-[0.2em] text-white/80 hover:bg-white/5">
                {l.label}
              </a>
            ))}
            <a href="#bezug" onClick={() => setOpen(false)} className="btn-gold mt-2 w-full justify-center">
              Jetzt entdecken
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
