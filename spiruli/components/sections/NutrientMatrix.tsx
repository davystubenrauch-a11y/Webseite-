"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import SplitHeading from "@/components/ui/SplitHeading";
import { filters, groups, nutrients, type Nutrient } from "@/lib/nutrients";

const ease = [0.22, 1, 0.36, 1] as const;

function Tile({ n, index, active, onSelect }: { n: Nutrient; index: number; active: boolean; onSelect: () => void }) {
  const color = groups[n.group].color;
  return (
    <motion.button
      layout
      type="button"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.45, ease }}
      onClick={onSelect}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      aria-pressed={active}
      className={`group relative aspect-square overflow-hidden rounded-2xl border p-3 text-left transition-colors duration-300 sm:p-4 ${
        active ? "border-transparent" : "border-white/10 bg-white/[0.03] hover:border-white/25"
      }`}
      style={active ? { background: `linear-gradient(150deg, ${color}33, ${color}0d)`, boxShadow: `0 0 0 1px ${color}, 0 20px 50px -20px ${color}` } : undefined}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(160px circle at var(--mx) var(--my), ${color}26, transparent 70%)` }}
      />
      <span className="relative flex items-start justify-between font-display text-[10px] font-semibold tabular-nums text-white/40">
        {String(index + 1).padStart(2, "0")}
        {n.tags.includes("BCAA") && <span className="rounded-full bg-emerald-bright/15 px-1.5 text-[9px] tracking-wider text-emerald-bright">BCAA</span>}
      </span>
      <span className="relative mt-1 block font-display text-3xl font-semibold leading-none sm:text-4xl" style={{ color }}>
        {n.symbol}
      </span>
      <span className="relative mt-2 block truncate text-[11px] font-medium text-white/60">{n.name}</span>
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

  const vitamins = nutrients.filter((n) => n.group !== "amino").length;
  const aminos = nutrients.filter((n) => n.group === "amino" && n.symbol !== "GABA").length;

  return (
    <section id="matrix" className="marble-dark relative py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-emerald/10 blur-[150px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <span data-reveal className="eyebrow">
              Ingredient &amp; Nutrition Matrix
            </span>
            <SplitHeading
              words={["Das", "Periodensystem", { text: "der Vitalität.", className: "font-serif font-medium normal-case italic text-gold" }]}
              className="mt-5 max-w-3xl font-display text-[2.4rem] font-semibold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl"
            />
          </div>
          <dl data-reveal-stagger className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6 lg:border-0 lg:pt-0">
            {[
              { v: vitamins, l: "Vitamine" },
              { v: `${aminos}+`, l: "Aminosäuren" },
              { v: "GABA", l: "aus Fermentation" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-4xl font-semibold text-white">{s.v}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="-mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Nährstoffe filtern">
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
              className={`relative shrink-0 rounded-full px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                filter === f.id ? "text-petrol-950" : "text-white/60 hover:text-white"
              }`}
            >
              {filter === f.id && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <LayoutGroup>
            <motion.div layout className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 xl:grid-cols-6">
              <AnimatePresence mode="popLayout">
                {visible.map((n) => (
                  <Tile
                    key={n.symbol}
                    n={n}
                    index={nutrients.indexOf(n)}
                    active={n.symbol === selected}
                    onSelect={() => setSelected(n.symbol)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait">
              <motion.article
                key={current.symbol}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.45, ease }}
                className="glass rim overflow-hidden p-8"
                aria-live="polite"
              >
                <div aria-hidden className="absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl" style={{ background: `${color}33` }} />
                <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em]" style={{ color }}>
                  {groups[current.group].label}
                </span>
                <div className="mt-4 flex items-end gap-5">
                  <span className="font-display text-7xl font-semibold leading-none" style={{ color }}>
                    {current.symbol}
                  </span>
                  <div className="pb-1">
                    <h3 className="font-display text-2xl font-semibold uppercase tracking-wide text-white">{current.name}</h3>
                    {current.alt && <p className="font-serif text-lg italic text-white/50">{current.alt}</p>}
                  </div>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {current.tags.map((t) => (
                    <li key={t} className="chip !text-[10px]">
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 leading-relaxed text-white/70">{current.text}</p>
                {current.claims && (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">Trägt bei zu</p>
                    <ul className="mt-3 space-y-2">
                      {current.claims.map((c) => (
                        <li key={c} className="flex items-start gap-3 text-sm text-white/80">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.article>
            </AnimatePresence>
            <p className="mt-4 text-xs leading-relaxed text-white/35">
              Nährstoffe aus der natürlichen Holunder-Zitrus-Algen-Basis. Gehaltsangaben gemäß Nährwertanalyse auf der Dose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
