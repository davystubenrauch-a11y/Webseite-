"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SplitHeading from "@/components/ui/SplitHeading";
import PznBarcode from "@/components/ui/PznBarcode";
import CopyPzn from "@/components/ui/CopyPzn";
import { isValidPzn, site } from "@/lib/site";

const digits = site.pzn.split("").map(Number);
const weighted = digits.slice(0, 7).map((d, i) => d * (i + 1));
const sum = weighted.reduce((a, b) => a + b, 0);

/** Rotating text ring around the PZN seal. */
function Seal() {
  const text = "PHARMAZENTRALNUMMER · IFA GMBH · ARZNEIMITTEL-SPEZIALITÄTEN · ";
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <div aria-hidden className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#8E6E2E,#F1E2B5,#C9A55A,#8E6E2E,#E2C47A,#8E6E2E)] p-[2px] shadow-rim-lg">
        <div className="h-full w-full rounded-full bg-petrol-900" />
      </div>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
        <defs>
          <path id="ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
        </defs>
        <text className="fill-gold font-display" fontSize="8.4" letterSpacing="2.6">
          <textPath href="#ring">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[16%] grid place-items-center rounded-full border border-gold/30 bg-gradient-to-b from-petrol-800 to-petrol-950 text-center">
        <div>
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/80">PZN</span>
          <p className="mt-1 font-display text-4xl font-semibold tabular-nums tracking-[0.06em] text-gold sm:text-5xl">{site.pzn}</p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-bright/30 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-emerald-bright">
            Medical Grade
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Quality() {
  const [showMath, setShowMath] = useState(false);
  const valid = isValidPzn(site.pzn);

  return (
    <section id="qualitaet" className="marble relative overflow-hidden py-28 sm:py-36">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <span data-reveal className="eyebrow !text-gold-deep before:!bg-gold-deep/70">
          Medical Grade &amp; Zertifizierung
        </span>
        <SplitHeading
          words={["Apothekenqualität,", { text: "dokumentiert.", className: "font-serif font-medium normal-case italic text-emerald-deep" }]}
          className="mt-6 max-w-5xl font-display text-[2.4rem] font-semibold uppercase leading-[0.95] tracking-tight text-petrol-900 sm:text-7xl"
        />

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-2">
          <div data-reveal className="lg:sticky lg:top-32 lg:self-start">
            <Seal />
          </div>

          <div className="space-y-6">
            <article data-reveal className="rounded-3xl bg-petrol-900 p-8 text-white shadow-[0_40px_80px_-40px_rgba(6,20,26,0.8)] sm:p-10">
              <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">Pharmazentralnummer</span>
              <h3 className="mt-3 font-display text-3xl font-semibold uppercase tracking-wide">
                PZN <span className="text-gold">{site.pzn}</span>
              </h3>
              <p className="mt-4 leading-relaxed text-white/70">
                SPIRULI ist unter der PZN {site.pzn} bei der IFA GmbH (Informationsstelle für Arzneispezialitäten)
                gelistet – und damit in Apotheken in ganz Deutschland eindeutig identifizier- und bestellbar.
              </p>

              <div className="mt-7 rounded-2xl bg-stone-50 p-5 text-petrol-950">
                <PznBarcode pzn={site.pzn} className="h-16 w-full" />
                <p className="mt-2 text-center font-display text-sm font-semibold tracking-[0.3em]">PZN - {site.pzn}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowMath((v) => !v)}
                aria-expanded={showMath}
                className="mt-5 flex w-full items-center justify-between gap-4 text-left text-sm text-white/60 transition hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${valid ? "bg-emerald-bright shadow-[0_0_10px_#6CC04A]" : "bg-red-400"}`} />
                  Prüfziffer {valid ? "verifiziert" : "ungültig"} (PZN-8, Modulo 11)
                </span>
                <span className={`transition-transform ${showMath ? "rotate-45" : ""}`}>+</span>
              </button>
              <motion.div initial={false} animate={{ height: showMath ? "auto" : 0, opacity: showMath ? 1 : 0 }} className="overflow-hidden">
                <div className="mt-4 flex flex-wrap items-center gap-1.5 font-display text-sm tabular-nums">
                  {weighted.map((w, i) => (
                    <span key={i} className="rounded-md bg-white/5 px-2 py-1 text-white/80">
                      {digits[i]}×{i + 1}
                    </span>
                  ))}
                  <span className="px-1 text-white/40">=</span>
                  <span className="text-white">{sum}</span>
                  <span className="px-1 text-white/40">mod 11 =</span>
                  <span className="rounded-md bg-gold px-2 py-1 font-semibold text-petrol-950">{sum % 11}</span>
                </div>
              </motion.div>
            </article>

            <article data-reveal className="rim rounded-3xl bg-stone-50/80 p-8 backdrop-blur sm:p-10">
              <span className="font-display text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-deep">Qualitätsschutz</span>
              <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-wide text-petrol-900">Analysiert &amp; zertifiziert durch SGS Fresenius</h3>
              <p className="mt-3 leading-relaxed text-stone-700">
                Der Qualitätsschutzprozess von SPIRULI wird von SGS Fresenius analysiert und zertifiziert – unabhängige Laboranalytik
                für ein Getränk, dem man vertrauen kann.
              </p>
              <ul className="mt-6 grid grid-cols-3 gap-3 text-center">
                {["Analysiert", "Zertifiziert", "Vegan"].map((l) => (
                  <li key={l} className="rounded-2xl border border-petrol-900/10 bg-white/60 px-2 py-4">
                    <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-petrol-900 text-xs text-gold">✓</span>
                    <span className="mt-2 block font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-petrol-900">{l}</span>
                  </li>
                ))}
              </ul>
            </article>

            <div data-reveal className="flex flex-wrap gap-3">
              <CopyPzn className="!border-petrol-900/20 !text-petrol-900 hover:!border-gold-deep" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
