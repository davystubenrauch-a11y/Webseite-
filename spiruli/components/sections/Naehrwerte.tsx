"use client";

import { useState } from "react";
import { nutrition } from "@/lib/site";
import { nutrients } from "@/lib/nutrients";

const vitamins = nutrients.filter((n) => n.group !== "amino");

/** Nutrition panel like the can's, and the vitamins in plain words. */
export default function Naehrwerte() {
  const [open, setOpen] = useState("B12");
  return (
    <section id="naehrwerte" className="bg-paper py-24 sm:py-32">
      <div className="wrap grid gap-16 lg:grid-cols-2 [&>*]:min-w-0">
        <div>
          <p data-reveal className="label text-teal">
            Nährwerte
          </p>
          <h2 data-reveal className="headline mt-6 text-6xl sm:text-7xl">
            Leicht, <span className="text-teal">nicht leer.</span>
          </h2>
          <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
            Rund 43 kcal pro Dose. Dazu natürliche B-Vitamine aus der Alge, Vitamin C aus der Zitrone und Aminosäuren – unter anderem Tryptophan, Asparaginsäure
            und Threonin.
          </p>
          <div data-reveal className="mt-10 max-w-lg rounded-3xl border border-line bg-mist p-4 sm:p-6">
            <div className="flex items-end justify-between border-b border-ink/30 pb-3">
              <p className="font-display text-2xl font-extrabold">Nährwerte</p>
              <p className="text-xs text-ink/55">je 100 ml · je Dose (200 ml)</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {nutrition.map((n) => (
                  <tr key={n.name} className="border-b border-line last:border-0">
                    <td className={`py-2 ${n.sub ? "pl-4 text-ink/55" : ""}`}>{n.name}</td>
                    <td className="whitespace-nowrap py-2 pl-3 text-right tabular-nums">{n.per100}</td>
                    <td className="whitespace-nowrap py-2 pl-4 text-right tabular-nums text-ink/65">{n.perCan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-lg text-xs text-ink/45">Angaben laut veröffentlichter Produktinformation. Maßgeblich ist die Angabe auf der Dose.</p>
        </div>

        <div className="lg:pt-28">
          <ul className="border-t border-line">
            {vitamins.map((v) => {
              const isOpen = open === v.symbol;
              return (
                <li key={v.symbol} className="border-b border-line">
                  <button type="button" onClick={() => setOpen(isOpen ? "" : v.symbol)} aria-expanded={isOpen} className="flex w-full items-baseline gap-6 py-5 text-left">
                    <span className="w-16 font-display text-3xl font-extrabold text-teal">{v.symbol}</span>
                    <span className="flex-1 text-lg">{v.name}</span>
                    <span className={`text-xl text-ink/50 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div className={`grid transition-all duration-500 ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden pl-14 sm:pl-[5.5rem] pr-4 text-ink/70">
                      <p>{v.text}</p>
                      {v.claims && <p className="mt-2 text-sm text-algae">Trägt bei zu: {v.claims.join(" · ")}.</p>}
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
