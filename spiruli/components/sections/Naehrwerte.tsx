"use client";

import { useState } from "react";
import CountUp from "@/components/ui/CountUp";
import Drift from "@/components/ui/Drift";
import Split from "@/components/ui/Split";
import { ingredients, nutrition } from "@/lib/site";
import { nutrients } from "@/lib/nutrients";

const vitamins = nutrients.filter((n) => n.group !== "amino");
const card = "rounded-[1.75rem] p-6 sm:p-8";

/** Nutrition as a bento grid: table, the can's gold band, calories, vitamins and the full ingredient list. */
export default function Naehrwerte() {
  const [open, setOpen] = useState("B12");
  const current = vitamins.find((v) => v.symbol === open) ?? vitamins[0];

  return (
    <section id="naehrwerte" className="relative z-10 overflow-hidden bg-ink py-24 text-mist sm:py-32">
      <Drift src="/float/tabletten.webp" className="-right-6 top-24 w-40 rotate-12 sm:w-56" speed={0.15} />
      <Drift src="/float/presslinge.webp" className="-left-10 top-[45%] w-32 -rotate-12 opacity-80 sm:w-44" speed={-0.1} />
      <div className="wrap relative">
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <div>
            <p data-reveal className="label text-fresh">
              Nährwerte
            </p>
            <Split className="headline mt-6 text-6xl sm:text-8xl" lines={["Leicht,", <span key="b" className="text-fresh">nicht leer.</span>]} />
          </div>
          <p data-reveal className="max-w-md text-lg leading-relaxed text-mist/70 lg:justify-self-end">
            Natürliche B-Vitamine aus der Alge, Vitamin C aus der Zitrone und Aminosäuren – unter anderem Tryptophan, Asparaginsäure und Threonin.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12 [&>*]:min-w-0">
          <div data-reveal className={`${card} bg-paper text-ink lg:col-span-5 lg:row-span-2`}>
            <div className="flex items-end justify-between border-b border-ink/30 pb-3">
              <p className="font-display text-2xl font-extrabold">Nährwerte</p>
              <p className="text-xs text-ink/55">je 100 ml · je Dose</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {nutrition.map((n) => (
                  <tr key={n.name} className="border-b border-line last:border-0">
                    <td className={`py-2.5 ${n.sub ? "pl-4 text-ink/55" : ""}`}>{n.name}</td>
                    <td className="whitespace-nowrap py-2.5 pl-3 text-right tabular-nums">{n.per100}</td>
                    <td className="whitespace-nowrap py-2.5 pl-4 text-right tabular-nums text-ink/60">{n.perCan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-ink/45">Laut veröffentlichter Produktinformation. Maßgeblich ist die Angabe auf der Dose.</p>
          </div>

          <div data-reveal className={`${card} flex flex-col justify-between gap-8 bg-gold text-ink lg:col-span-4`} style={{ ["--d" as string]: "0.08s" }}>
            <p className="label text-ink/70">Wie auf der Dose</p>
            <div className="flex items-center justify-between gap-2">
              {[
                ["V", "Vegan"],
                ["B11", "12 mg"],
                ["B12", "2 µg"],
              ].map(([k, v]) => (
                <div key={k} className="grid aspect-square w-[30%] place-items-center rounded-full border-2 border-ink/80 bg-[#d9b872] text-center leading-none">
                  <div>
                    <p className="font-display text-2xl font-extrabold sm:text-3xl">{k}</p>
                    <p className="mt-1 text-[0.7rem] font-semibold">{v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className={`${card} flex flex-col justify-between bg-fresh text-ink lg:col-span-3`} style={{ ["--d" as string]: "0.16s" }}>
            <p className="label text-ink/60">Pro Dose</p>
            <p className="mt-10 font-display text-8xl font-extrabold leading-none">
              <CountUp to={43} />
            </p>
            <p className="mt-2 text-ink/70">kcal bei 200 ml</p>
          </div>

          <div data-reveal className={`${card} bg-algae text-mist lg:col-span-7`}>
            <p className="label text-fresh">Vitamine aus Alge und Frucht</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {vitamins.map((v) => (
                <button
                  key={v.symbol}
                  type="button"
                  onClick={() => setOpen(v.symbol)}
                  aria-pressed={open === v.symbol}
                  className={`rounded-full px-4 py-2 font-display text-lg font-extrabold transition-colors ${
                    open === v.symbol ? "bg-fresh text-ink" : "bg-mist/10 text-mist hover:bg-mist/20"
                  }`}
                >
                  {v.symbol}
                </button>
              ))}
            </div>
            <div className="mt-6 min-h-[7rem]">
              <p className="font-medium">{current.name}</p>
              <p className="mt-2 text-mist/75">{current.text}</p>
              {current.claims && <p className="mt-2 text-sm text-fresh">Trägt bei zu: {current.claims.join(" · ")}.</p>}
            </div>
          </div>

          <div data-reveal className={`${card} bg-paper text-ink lg:col-span-12`}>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="font-display text-2xl font-extrabold">
                Alle <span className="text-teal">9 Zutaten</span>
              </p>
              <p className="text-sm text-ink/55">Vegan · glutenfrei · mit Kohlensäure · gesüßt mit Agavensirup</p>
            </div>
            <ol className="mt-6 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
              {ingredients.map((ing, i) => (
                <li key={ing.name} className="flex items-baseline gap-4 border-b border-line py-3.5 sm:pr-6">
                  <span className="w-6 text-sm tabular-nums text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{ing.name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
