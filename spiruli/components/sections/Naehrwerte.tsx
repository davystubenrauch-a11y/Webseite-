"use client";

import { useState } from "react";
import { ingredients, nutrition } from "@/lib/site";
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
          {/* The gold band from the can. */}
          <div data-reveal className="mt-10 flex max-w-lg items-center justify-around rounded-full bg-gold px-4 py-3 text-ink">
            {[
              ["V", "Vegan"],
              ["B11", "12 mg"],
              ["B12", "2 µg"],
            ].map(([k, v]) => (
              <div key={k} className="grid h-20 w-20 place-items-center rounded-full border-2 border-ink/80 bg-[#d9b872] text-center leading-none sm:h-24 sm:w-24">
                <div>
                  <p className="font-display text-2xl font-extrabold sm:text-3xl">{k}</p>
                  <p className="mt-1 text-[0.7rem] font-semibold">{v}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 max-w-lg text-xs text-ink/45">Angaben laut Dose.</p>

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

      <div className="wrap mt-24">
        <h3 data-reveal className="headline text-4xl sm:text-5xl">
          Alle <span className="text-teal">9 Zutaten</span>
        </h3>
        <ol data-reveal className="mt-8 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((ing, i) => (
            <li key={ing.name} className="flex items-baseline gap-4 border-b border-line py-4 sm:pr-6">
              <span className="w-6 text-sm tabular-nums text-ink/40">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-medium">{ing.name}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-ink/60">Vegan · glutenfrei · mit Kohlensäure · gesüßt mit Agavensirup</p>
      </div>
    </section>
  );
}
