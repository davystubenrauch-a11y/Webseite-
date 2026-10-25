"use client";

import { useState } from "react";
import CopyPzn from "@/components/ui/CopyPzn";
import PznBarcode from "@/components/ui/PznBarcode";
import { site } from "@/lib/site";

const faqs = [
  { q: "Wie schmeckt SPIRULI?", a: "Fruchtig nach Holunder, frisch durch Zitrone und Orange, leicht spritzig. Die Alge schmeckt man kaum – am besten gut gekühlt." },
  { q: "Was kostet SPIRULI?", a: "2,95 € pro Dose. Im 24er Tray gibt es 10 % Rabatt – das sind 2,66 € pro Dose." },
  { q: "Ist SPIRULI vegan und glutenfrei?", a: "Ja. Die Milchsäure stammt aus fermentiertem Gerstenmalz und ist vegan; laut Hersteller ist das Getränk trotzdem glutenfrei." },
  { q: "Wie viel Zucker ist drin?", a: "Rund 3,6 g Zucker pro 100 ml aus Agavensirup und Fruchtsaft – etwa 7 g pro Dose." },
  { q: "Ist das ein Medikament?", a: "Nein. SPIRULI ist ein Nahrungsergänzungsmittel in der Dose – ein fermentiertes, verzehrfertiges Getränk. Die PZN sorgt dafür, dass jede Apotheke es eindeutig bestellen kann." },
];

/** Questions on the left, where to get it on the right. */
export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="fragen" className="relative z-10 bg-mist py-24 sm:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p data-reveal className="label text-teal">
            Fragen
          </p>
          <h2 data-reveal className="headline mt-4 text-5xl sm:text-7xl">
            Kurz <span className="text-teal">gefragt.</span>
          </h2>
          <ul className="mt-10 border-t border-line">
            {faqs.map((f, i) => (
              <li key={f.q} className="border-b border-line">
                <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-5 text-left">
                  <span className="text-lg font-semibold">{f.q}</span>
                  <span className={`text-2xl text-ink/50 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}>
                  <p className="max-w-xl overflow-hidden leading-relaxed text-ink/70">{f.a}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside id="kaufen" data-reveal className="self-start rounded-3xl bg-ink p-8 text-mist lg:sticky lg:top-28">
          <p className="label text-fresh">Wo gibt&apos;s SPIRULI?</p>
          <div className="mt-6 border-b border-mist/15 pb-6">
            <p className="font-display text-2xl font-extrabold">Online</p>
            <p className="mt-1 text-mist/70">12er oder 24er Tray, direkt nach Hause.</p>
            <a href="#shop" className="btn mt-4 bg-fresh text-ink hover:bg-mist">
              Zum Shop
            </a>
          </div>
          <div className="pt-6">
            <p className="font-display text-2xl font-extrabold">In der Apotheke</p>
            <p className="mt-1 text-mist/70">Jede Apotheke in Deutschland kann SPIRULI bestellen – einfach die PZN nennen.</p>
            <div className="mt-5 rounded-2xl bg-paper p-5 text-ink">
              <p className="font-display text-3xl font-extrabold tracking-tight">PZN {site.pzn}</p>
              <PznBarcode pzn={site.pzn} className="mt-3 h-12 w-full text-ink" />
            </div>
            <CopyPzn className="btn mt-4 border border-mist/30 text-mist hover:border-mist" />
          </div>
          <p className="mt-6 text-sm text-mist/55">
            Händler & Praxen:{" "}
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Händleranfrage SPIRULI")}`} className="underline underline-offset-4">
              {site.email}
            </a>
          </p>
        </aside>
      </div>
    </section>
  );
}
