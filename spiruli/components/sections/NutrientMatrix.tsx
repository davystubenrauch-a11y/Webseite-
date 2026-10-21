"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { filters, groups, nutrients, type Nutrient } from "@/lib/nutrients";

const ease = [0.22, 1, 0.36, 1] as const;

function Tile({ n, active, onSelect }: { n: Nutrient; active: boolean; onSelect: () => void }) {
  const color = groups[n.group].color;
  return (
    <motion.button
      layout
      type="button"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, ease }}
      onClick={onSelect}
      aria-pressed={active}
      className={`relative flex aspect-square flex-col justify-between rounded-2xl border bg-white p-3 text-left transition-all duration-200 sm:p-4 ${
        active ? "shadow-lift" : "border-sand-300/70 hover:-translate-y-0.5 hover:shadow-card"
      }`}
      style={active ? { borderColor: color, boxShadow: `0 0 0 1px ${color}, 0 20px 40px -24px ${color}` } : undefined}
    >
      <span className="flex items-start justify-between">
        <span className="h-1.5 w-6 rounded-full" style={{ background: color }} />
        {n.tags.includes("BCAA") && <span className="rounded-full bg-leaf-50 px-1.5 text-[10px] font-bold text-leaf-dark">BCAA</span>}
      </span>
      <span>
        <span className="block text-2xl font-extrabold leading-none tracking-tight sm:text-3xl" style={{ color }}>
          {n.symbol}
        </span>
        <span className="mt-1.5 block truncate text-xs font-medium text-muted">{n.name}</span>
      </span>
    </motion.button>
  );
}

export default function NutrientMatrix() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState("B12");
  const test = filters.find((f) => f.id === filter)!.test;
  const visible = nutrients.filter(test);
  const current = nutrients.find((n) => n.symbol === selected)!;
  const color = groups[current.group].color;

  return (
    <section id="matrix" className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <div data-reveal className="max-w-2xl">
          <span className="eyebrow">Inhaltsstoffe &amp; Nährwerte</span>
          <h2 className="h-section mt-4">Was in jeder Dose steckt.</h2>
          <p className="lead mt-4">
            6 Vitamine aus dem natürlichen B-Komplex, Vitamin C und Folsäure – dazu 18 Aminosäuren und GABA aus der Fermentation. Tippen Sie auf
            einen Nährstoff für Details.
          </p>
        </div>

        <div className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Nährstoffe filtern">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => {
                setFilter(f.id);
                const first = nutrients.find(f.test);
                if (first && !f.test(current)) setSelected(first.symbol);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === f.id ? "bg-petrol text-white" : "bg-sand text-petrol-900/75 hover:bg-sand-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <motion.div layout className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 xl:grid-cols-6">
            <AnimatePresence mode="popLayout">
              {visible.map((n) => (
                <Tile key={n.symbol} n={n} active={n.symbol === selected} onSelect={() => setSelected(n.symbol)} />
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait">
              <motion.article
                key={current.symbol}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease }}
                className="rounded-2xl bg-sand p-7 ring-1 ring-sand-300/70"
                aria-live="polite"
              >
                <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color }}>
                  {groups[current.group].label}
                </span>
                <div className="mt-3 flex items-end gap-4">
                  <span className="text-6xl font-extrabold leading-none tracking-tight" style={{ color }}>
                    {current.symbol}
                  </span>
                  <div className="pb-1">
                    <h3 className="text-xl font-bold text-petrol-900">{current.name}</h3>
                    {current.alt && <p className="text-sm text-muted">{current.alt}</p>}
                  </div>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {current.tags.map((t) => (
                    <li key={t} className="chip !py-1 !text-xs">
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 leading-relaxed text-petrol-900/80">{current.text}</p>
                {current.claims && (
                  <div className="mt-6 border-t border-sand-300 pt-5">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Trägt bei zu</p>
                    <ul className="mt-3 space-y-2">
                      {current.claims.map((c) => (
                        <li key={c} className="flex items-start gap-3 text-sm text-petrol-900">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.article>
            </AnimatePresence>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Nährstoffe aus der natürlichen Holunder-Zitrus-Algen-Basis. Gehaltsangaben gemäß Nährwertanalyse auf der Dose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
