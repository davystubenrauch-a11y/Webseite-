"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Pattern from "@/components/ui/Pattern";
import { nutrients } from "@/lib/nutrients";

const vitamins = nutrients.filter((n) => n.group !== "amino");
const aminos = nutrients.filter((n) => n.group === "amino");

/** Lime field: vitamins as big tiles, amino acids as a dense strip. The can sits left. */
export default function Naehrstoffe() {
  const [sel, setSel] = useState("B12");
  const cur = nutrients.find((n) => n.symbol === sel)!;
  return (
    <section
      id="naehrstoffe"
      data-can='{"x":-0.6,"y":-0.05,"s":0.82,"ry":8.2,"rx":0.5,"rz":0.4}'
      className="relative min-h-[100svh] overflow-hidden bg-lime text-ink"
    >
      <Pattern color="#CBE84B" />
      <div className="wrap relative grid gap-10 py-28 md:grid-cols-[0.8fr_1.2fr]">
        <div className="hidden md:block" />
        <div>
          <p className="micro text-ink/70">Inhaltsstoffe</p>
          <h2 data-reveal className="mega mt-4 text-[12vw] md:text-[6.5vw]">
            Was drin
            <br />
            steckt.
          </h2>

          <div className="dotted mt-10 text-ink/50" />
          <p className="micro mt-6">Natürliche Vitamine – antippen für Details</p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {vitamins.map((v) => (
              <button
                key={v.symbol}
                type="button"
                onClick={() => setSel(v.symbol)}
                aria-pressed={sel === v.symbol}
                className={`rounded-2xl border-2 border-ink px-2 py-4 text-left transition-colors ${sel === v.symbol ? "bg-ink text-lime" : "bg-lime-soft hover:bg-white"}`}
              >
                <span className="mega block text-3xl">{v.symbol}</span>
                <span className="micro mt-1 block truncate !text-[0.6rem]">{v.name}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={cur.symbol}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-4 rounded-2xl bg-ink p-5 text-lime"
              aria-live="polite"
            >
              <p className="mega text-2xl">{cur.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-lime-soft">{cur.text}</p>
              {cur.claims && <p className="micro mt-3 text-lime">Trägt bei zu: {cur.claims.join(" · ")}</p>}
            </motion.div>
          </AnimatePresence>

          <p className="micro mt-10">18 Aminosäuren + GABA</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {aminos.map((a) => (
              <li key={a.symbol} title={a.name} className="pill cursor-default bg-ink !px-3 text-lime hover:bg-algae">
                {a.symbol}
                {a.tags.includes("BCAA") && <span className="text-lime-soft">· BCAA</span>}
              </li>
            ))}
          </ul>
          <p className="micro mt-8 text-ink/60">Gehaltsangaben gemäß Nährwertanalyse auf der Dose.</p>
        </div>
      </div>
    </section>
  );
}
