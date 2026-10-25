"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#geschmack", label: "Geschmack" },
  { href: "#zutaten", label: "Zutaten" },
  { href: "#naehrwerte", label: "Nährwerte" },
  { href: "#fragen", label: "Fragen" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? "bg-night-deep/85 backdrop-blur-md" : ""}`}>
      <div className="wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center sm:h-20">
        <nav className="hidden gap-7 text-sm text-cream/75 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-cream">
              {l.label}
            </a>
          ))}
        </nav>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="justify-self-start text-sm text-cream/80 md:hidden">
          {open ? "Schließen" : "Menü"}
        </button>
        <a href="#top" className="font-display text-lg font-semibold tracking-[0.32em] text-cream" aria-label="SPIRULI – nach oben">
          SPIRULI<sup className="text-[0.5em]">®</sup>
        </a>
        <a href="#kaufen" className="btn justify-self-end border border-cream/30 !px-4 !py-2 text-cream hover:border-gold hover:text-gold">
          Wo kaufen?
        </a>
      </div>
      {open && (
        <nav className="wrap flex flex-col bg-night-deep pb-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-cream/10 py-3 text-lg">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
