"use client";

import { useState } from "react";
import { nutrition } from "@/lib/site";
import { nutrients } from "@/lib/nutrients";

const vitamins = nutrients.filter((n) => n.group !== "amino");

/** Nutrition panel like the can's, and the vitamins in plain words. */
export default function Naehrwerte() {
  const [open, setOpen] = useState("B12");
  return (
    <section id="naehrwerte" className="bg-set py-28 text-cream sm:py-36">
      <div className="wrap grid gap-16 lg:grid-cols-2 [&>*]:min-w-0">
        <div>
          <p data-reveal className="eyebrow text-gold">
            Nährwerte
          </p>
          <h2 data-reveal className="display mt-6 text-6xl sm:text-7xl">
            Leicht, <em>aber nicht leer.</em>
          </h2>
          <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-cream/75">
            Rund 43 kcal pro Dose. Dazu natürliche B-Vitamine aus der Alge, Vitamin C aus der Zitrone und Aminosäuren – unter anderem Tryptophan, Asparaginsäure
            und Threonin.
          </p>
          <div data-reveal className="mt-10 max-w-lg rounded-xl border border-cream/15 p-4 sm:p-6">
            <div className="flex items-end justify-between border-b border-cream/30 pb-3">
              <p className="display text-3xl">Nährwerte</p>
              <p className="text-xs text-cream/60">je 100 ml · je Dose (200 ml)</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {nutrition.map((n) => (
                  <tr key={n.name} className="border-b border-cream/10 last:border-0">
                    <td className={`py-2 ${n.sub ? "pl-4 text-cream/60" : ""}`}>{n.name}</td>
                    <td className="whitespace-nowrap py-2 pl-3 text-right tabular-nums">{n.per100}</td>
                    <td className="whitespace-nowrap py-2 pl-4 text-right tabular-nums text-cream/70">{n.perCan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-lg text-xs text-cream/45">Angaben laut veröffentlichter Produktinformation. Maßgeblich ist die Angabe auf der Dose.</p>
        </div>

        <div className="lg:pt-28">
          <ul className="border-t border-cream/15">
            {vitamins.map((v) => {
              const isOpen = open === v.symbol;
              return (
                <li key={v.symbol} className="border-b border-cream/15">
                  <button type="button" onClick={() => setOpen(isOpen ? "" : v.symbol)} aria-expanded={isOpen} className="flex w-full items-baseline gap-6 py-5 text-left">
                    <span className="display w-16 text-4xl text-gold-soft">{v.symbol}</span>
                    <span className="flex-1 text-lg">{v.name}</span>
                    <span className={`text-xl text-cream/60 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div className={`grid transition-all duration-500 ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden pl-14 sm:pl-[5.5rem] pr-4 text-cream/70">
                      <p>{v.text}</p>
                      {v.claims && <p className="mt-2 text-sm text-leaf">Trägt bei zu: {v.claims.join(" · ")}.</p>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
