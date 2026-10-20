"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { LogoInline } from "@/components/brand/Logo";
import { nav } from "@/lib/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

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
      <motion.div className="h-[2px] origin-left bg-gradient-to-r from-gold-deep via-gold-bright to-gold-soft" style={{ scaleX: progress }} />
      <div
        className={`transition-all duration-500 ${
          scrolled ? "border-b border-white/[0.06] bg-navy-900/75 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Hauptnavigation">
          <LogoInline />
          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active === id ? "text-gold-soft" : "text-white/65 hover:text-white"
                  }`}
                >
                  {active === id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full border border-gold/30 bg-gold/[0.07]" />
                  )}
                  <span className="relative">{label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a href="#anfrage" className="btn-gold hidden !px-5 !py-2.5 sm:inline-flex">
              Projekt starten
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-px w-5 bg-white transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1.5 h-px w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 h-px w-5 bg-white transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
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
            className="fixed inset-0 top-[74px] z-40 bg-navy-950/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-2 px-6 pt-10">
              {nav.map(({ id, label }, i) => (
                <motion.li key={id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <a href={`#${id}`} onClick={() => setOpen(false)} className="block border-b border-white/5 py-4 font-serif text-3xl text-white">
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="px-6 pt-10">
              <a href="#anfrage" onClick={() => setOpen(false)} className="btn-gold w-full">
                Projekt starten
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
