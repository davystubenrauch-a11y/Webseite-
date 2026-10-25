"use client";

import { useState } from "react";
import { nutrition } from "@/lib/site";
import { nutrients } from "@/lib/nutrients";
import CanPose from "@/components/stage/CanPose";

const vitamins = nutrients.filter((n) => n.group !== "amino");

/** Nutrition panel laid out like the one on a can, plus the vitamins in plain words. */
export default function Naehrwerte() {
  const [open, setOpen] = useState("B12");
  return (
    <section id="naehrwerte" className="relative bg-cream py-24 sm:py-32">
      <CanPose at="0%" pose={{ x: -0.7, y: 0.4, s: 0.7, ry: 12, rz: -0.4, o: 0 }} />
      <CanPose at="70%" pose={{ x: 0.8, y: -0.2, s: 0.8, ry: 13, rz: 0.3, o: 0 }} />
      <div className="wrap grid gap-14 lg:grid-cols-2">
        <div>
          <p data-reveal className="label text-petrol">
            Nährwerte
          </p>
          <h2 data-reveal className="headline mt-4 text-5xl text-petrol-deep sm:text-6xl">
            Leicht, <br />
            aber nicht leer.
          </h2>
          <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
            Eine Dose hat rund 43 kcal. Dazu kommen natürliche B-Vitamine aus der Alge, Vitamin C aus der Zitrone und Aminosäuren – unter anderem
            Tryptophan, Asparaginsäure und Threonin.
          </p>

          <div data-reveal className="mt-10 max-w-lg border-[3px] border-ink bg-white p-4 font-semibold">
            <div className="flex items-end justify-between border-b-[6px] border-ink pb-2">
              <p className="text-2xl font-extrabold">Nährwerte</p>
              <p className="text-right text-xs">
                je 100 ml <span className="mx-1 text-ink/30">|</span> je Dose (200 ml)
              </p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {nutrition.map((n) => (
                  <tr key={n.name} className="border-b border-ink/25 last:border-0">
                    <td className={`py-1.5 ${n.sub ? "pl-4 font-normal" : ""}`}>{n.name}</td>
                    <td className="whitespace-nowrap py-1.5 pl-3 text-right tabular-nums">{n.per100}</td>
                    <td className="whitespace-nowrap py-1.5 pl-4 text-right tabular-nums">{n.perCan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-md text-xs text-ink/50">Angaben laut veröffentlichter Produktinformation. Maßgeblich ist die Angabe auf der Dose.</p>
        </div>

        <div className="lg:pt-24">
          <p className="label text-ink/60">Vitamine – antippen</p>
          <ul className="mt-4 border-t border-cream-line">
            {vitamins.map((v) => {
              const isOpen = open === v.symbol;
              return (
                <li key={v.symbol} className="border-b border-cream-line">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? "" : v.symbol)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-5 py-4 text-left"
                  >
                    <span className="headline w-16 text-3xl text-petrol">{v.symbol}</span>
                    <span className="flex-1 text-lg font-semibold">{v.name}</span>
                    <span className={`text-xl transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {isOpen && (
                    <div className="pb-5 pl-[5.25rem] pr-4 text-ink/75">
                      <p>{v.text}</p>
                      {v.claims && <p className="mt-2 text-sm text-petrol">Trägt bei zu: {v.claims.join(" · ")}.</p>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
