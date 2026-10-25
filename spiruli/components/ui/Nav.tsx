"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#getraenk", label: "Getränk" },
  { href: "#zutaten", label: "Zutaten" },
  { href: "#naehrwerte", label: "Nährwerte" },
  { href: "#fragen", label: "Fragen" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid || open ? "bg-mist/85 backdrop-blur-md" : ""}`}>
      <div className="wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center sm:h-20">
        <a href="#top" className="font-display text-lg font-extrabold tracking-[0.18em]" aria-label="SPIRULI – nach oben">
          SPIRULI<sup className="text-[0.5em]">®</sup>
        </a>
        <nav className="hidden gap-8 text-sm text-ink/70 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="text-sm font-medium md:hidden">
          {open ? "Schließen" : "Menü"}
        </button>
        <a href="#kaufen" className="btn justify-self-end bg-fresh !px-5 !py-2.5 text-ink hover:bg-ink hover:text-mist">
          Wo kaufen?
        </a>
      </div>
      {open && (
        <nav className="wrap flex flex-col pb-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-3 text-lg">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
