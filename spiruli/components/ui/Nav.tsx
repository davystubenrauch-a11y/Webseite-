"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

const links = [
  { href: "#getraenk", label: "Getränk" },
  { href: "#shop", label: "Shop" },
  { href: "#zutaten", label: "Zutaten" },
  { href: "#naehrwerte", label: "Nährwerte" },
  { href: "#fragen", label: "Fragen" },
];

/** Hides while scrolling down, comes back on the way up; underlines the section in view. */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { cans, setOpen: openCart } = useCart();

  useEffect(() => {
    let last = window.scrollY;
    const f = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 300 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", f);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-500 ${solid || open ? "bg-mist/85 backdrop-blur-md" : ""} ${
        hidden && !open ? "-translate-y-full" : ""
      }`}
    >
      <div className="wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center sm:h-20">
        <a href="#top" className="font-display text-lg font-extrabold tracking-[0.18em]" aria-label="SPIRULI – nach oben">
          SPIRULI<sup className="text-[0.5em]">®</sup>
        </a>
        <nav className="hidden gap-8 text-sm md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={`group relative py-1 transition-colors ${active === l.href ? "text-ink" : "text-ink/60 hover:text-ink"}`}>
              {l.label}
              <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-ink transition-transform duration-500 ${active === l.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
            </a>
          ))}
        </nav>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="text-sm font-medium md:hidden">
          {open ? "Schließen" : "Menü"}
        </button>
        <div className="flex items-center gap-2 justify-self-end">
          <a href="#shop" className="btn hidden bg-fresh !px-5 !py-2.5 text-ink hover:bg-ink hover:text-mist sm:inline-flex">
            Jetzt kaufen
          </a>
          <button
            type="button"
            onClick={() => openCart(true)}
            aria-label={`Warenkorb, ${cans} Dosen`}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-mist"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {cans > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-teal px-1 text-[0.65rem] font-semibold text-mist">{cans}</span>
            )}
          </button>
        </div>
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
