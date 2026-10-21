"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";

const links = [
  { href: "#story", label: "Über uns" },
  { href: "#geschmack", label: "Geschmack" },
  { href: "#matrix", label: "Nährstoffe" },
  { href: "#qualitaet", label: "Qualität" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-sand-300/80 bg-sand/90 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between sm:h-20">
        <Logo />
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium text-petrol-900/75 transition-colors hover:text-petrol">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#bezug" className="btn-primary hidden !py-2.5 sm:inline-flex">
            Jetzt entdecken
          </a>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-petrol/20 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü öffnen"
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-0.5 w-4 bg-petrol transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-0.5 w-4 bg-petrol transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="card mx-4 mb-4 p-3 md:hidden"
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-medium text-petrol-900 hover:bg-sand">
                {l.label}
              </a>
            ))}
            <a href="#bezug" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Jetzt entdecken
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
