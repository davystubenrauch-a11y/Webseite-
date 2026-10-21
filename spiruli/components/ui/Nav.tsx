"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";

const links = [
  { href: "#zutaten", label: "Zutaten" },
  { href: "#dose", label: "Die Dose" },
  { href: "#naehrstoffe", label: "Nährstoffe" },
  { href: "#faq", label: "Fragen" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${
          scrolled ? "border-2 border-ink bg-cream/95 shadow-[4px_4px_0_0_#12343F] backdrop-blur" : "border-2 border-transparent"
        }`}
      >
        <Logo />
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="font-semibold text-ink/80 underline-offset-4 transition hover:text-ink hover:underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href="#kaufen" className="btn-ink hidden !px-5 !py-2 !text-sm sm:inline-flex">
            Wo kaufen?
          </a>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü öffnen"
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-0.5 w-4 bg-ink transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-0.5 w-4 bg-ink transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="sticker mx-auto mt-2 max-w-7xl p-3 md:hidden">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-lg font-bold hover:bg-lime">
                {l.label}
              </a>
            ))}
            <a href="#kaufen" onClick={() => setOpen(false)} className="btn-ink mt-2 w-full">
              Wo kaufen?
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
