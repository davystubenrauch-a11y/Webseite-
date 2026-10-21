"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nutrients } from "@/lib/nutrients";

const vitamins = nutrients.filter((n) => n.group !== "amino");
const aminos = nutrients.filter((n) => n.group === "amino");

const aminoFilters = [
  { id: "all", label: "Alle", test: () => true },
  { id: "ess", label: "Essentiell", test: (tags: string[]) => tags.includes("Essentiell") },
  { id: "bcaa", label: "BCAA", test: (tags: string[]) => tags.includes("BCAA") },
] as const;

export default function Nutrients() {
  const [openVit, setOpenVit] = useState<string | null>("B12");
  const [filter, setFilter] = useState<(typeof aminoFilters)[number]["id"]>("all");
  const [amino, setAmino] = useState(aminos[0].symbol);
  const test = aminoFilters.find((f) => f.id === filter)!.test;
  const currentAmino = aminos.find((a) => a.symbol === amino)!;

  return (
    <section id="naehrstoffe" className="bg-cream py-24 sm:py-32">
      <div className="wrap">
        <div data-reveal className="max-w-3xl">
          <span className="kicker">Nährstoffe</span>
          <h2 className="display mt-5 text-5xl sm:text-7xl">
            Klein im Etikett.
            <br />
            <span className="text-algae">Groß im Inhalt.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Vitamins: accordion with the authorised claims */}
          <div>
            <h3 className="flex items-baseline gap-3 text-2xl font-extrabold">
              Vitamine <span className="font-hand text-2xl font-bold text-citrus">natürlicher B-Komplex + C</span>
            </h3>
            <ul className="mt-5 border-t-2 border-ink">
              {vitamins.map((v) => {
                const open = openVit === v.symbol;
                return (
                  <li key={v.symbol} className="border-b-2 border-ink">
                    <button
                      type="button"
                      onClick={() => setOpenVit(open ? null : v.symbol)}
                      aria-expanded={open}
                      className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-lime/40"
                    >
                      <span className="grid h-12 w-14 shrink-0 place-items-center rounded-xl border-2 border-ink bg-lime text-lg font-extrabold">{v.symbol}</span>
                      <span className="flex-1">
                        <span className="block text-lg font-bold">{v.name}</span>
                        {v.alt && <span className="block text-sm text-ink/60">{v.alt}</span>}
                      </span>
                      <span className={`text-2xl font-bold transition-transform ${open ? "rotate-45" : ""}`}>+</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pb-5 pl-[4.5rem] pr-4">
                            <p className="leading-relaxed text-ink/80">{v.text}</p>
                            {v.claims && (
                              <ul className="mt-3 flex flex-wrap gap-2">
                                {v.claims.map((c) => (
                                  <li key={c} className="rounded-full bg-algae-soft px-3 py-1 text-sm font-medium">
                                    ✓ {c}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Amino acids: chip cloud with filters */}
          <div>
            <h3 className="flex items-baseline gap-3 text-2xl font-extrabold">
              Aminosäuren <span className="font-hand text-2xl font-bold text-algae">18 + GABA</span>
            </h3>
            <div className="mt-5 flex gap-2">
              {aminoFilters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold transition-colors ${filter === f.id ? "bg-ink text-lime" : "hover:bg-lime"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {aminos.map((a) => {
                const on = test(a.tags);
                const sel = a.symbol === amino;
                return (
                  <li key={a.symbol}>
                    <button
                      type="button"
                      onClick={() => setAmino(a.symbol)}
                      aria-pressed={sel}
                      className={`rounded-xl border-2 px-3 py-2 text-left transition-all duration-300 ${
                        sel ? "border-ink bg-algae text-cream shadow-[3px_3px_0_0_#12343F]" : on ? "border-ink bg-algae-soft hover:-translate-y-0.5" : "border-ink/15 text-ink/30"
                      }`}
                    >
                      <span className="block text-lg font-extrabold leading-none">{a.symbol}</span>
                      <span className="mt-0.5 block text-xs font-medium">{a.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAmino.symbol}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="sticker mt-6 bg-algae-soft p-5"
                aria-live="polite"
              >
                <p className="text-xl font-extrabold">
                  {currentAmino.name} <span className="text-base font-bold text-ink/50">({currentAmino.symbol})</span>
                </p>
                <p className="mt-1 text-sm font-bold uppercase tracking-wide text-algae">{currentAmino.tags.join(" · ")}</p>
                <p className="mt-2 leading-relaxed">{currentAmino.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-10 text-sm text-ink/60">Nährstoffe aus der natürlichen Holunder-Zitrus-Algen-Basis. Gehaltsangaben gemäß Nährwertanalyse auf der Dose.</p>
      </div>
    </section>
  );
}
