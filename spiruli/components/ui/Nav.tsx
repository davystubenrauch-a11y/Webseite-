"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#zutaten", label: "Zutaten" },
  { href: "#naehrwerte", label: "Nährwerte" },
  { href: "#qualitaet", label: "Qualität" },
  { href: "#fragen", label: "Fragen" },
];

/** Light text over the petrol hero, ink on cream once the visitor scrolls past it. */
export default function Nav() {
  const [onCream, setOnCream] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const update = () => setOnCream(!!hero && hero.getBoundingClientRect().bottom < 64);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const tone = onCream ? "text-ink" : "text-cream";
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${onCream ? "bg-cream/95 shadow-[0_1px_0_#d8cdb5] backdrop-blur" : ""}`}>
      <div className={`wrap flex h-16 items-center justify-between ${tone}`}>
        <a href="#top" className="font-display text-lg font-semibold tracking-[0.25em]" aria-label="SPIRULI – nach oben">
          SPIRULI<sup className="text-[0.55em]">®</sup>
        </a>
        <nav className="hidden gap-8 text-sm font-semibold md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="opacity-80 transition-opacity hover:opacity-100">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#kaufen" className={`btn !py-2 ${onCream ? "bg-petrol text-cream hover:bg-petrol-deep" : "bg-cream text-petrol-deep hover:bg-white"}`}>
            Wo kaufen?
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="btn !px-3 !py-2 md:hidden" aria-label="Menü">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && (
        <nav className="wrap flex flex-col gap-1 bg-cream pb-4 text-ink md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-cream-line py-3 text-lg font-bold">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
