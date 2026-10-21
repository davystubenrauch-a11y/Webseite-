"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoInline } from "@/components/brand/Logo";
import { nav } from "@/lib/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-500 ${
          scrolled ? "border-b border-slate-200 bg-white/85 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Hauptnavigation">
          <LogoInline />
          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active === id ? "text-brand-dark" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {active === id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full border border-brand/20 bg-brand/[0.05]" />
                  )}
                  <span className="relative">{label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a href="#anfrage" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
              Projekt starten
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-slate-800 transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-slate-800 transition ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-slate-800 transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[74px] z-40 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-2 px-6 pt-10">
              {nav.map(({ id, label }, i) => (
                <motion.li key={id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <a href={`#${id}`} onClick={() => setOpen(false)} className="block border-b border-slate-200 py-4 font-heading text-3xl text-slate-900">
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="px-6 pt-10">
              <a href="#anfrage" onClick={() => setOpen(false)} className="btn-primary w-full">
                Projekt starten
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
