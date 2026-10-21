"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PznBarcode from "@/components/ui/PznBarcode";
import { Stamp } from "@/components/ui/Illustrations";
import { isValidPzn, site } from "@/lib/site";

const digits = site.pzn.split("").map(Number);
const weighted = digits.slice(0, 7).map((d, i) => d * (i + 1));
const sum = weighted.reduce((a, b) => a + b, 0);

export default function Trust() {
  const [showMath, setShowMath] = useState(false);
  const valid = isValidPzn(site.pzn);

  return (
    <section className="bg-cream py-24 sm:py-32">
      <div className="wrap">
        <div data-reveal className="max-w-3xl">
          <span className="kicker">Geprüft &amp; gelistet</span>
          <h2 className="display mt-5 text-5xl sm:text-7xl">
            Vertrauen ist gut.
            <br />
            <span className="text-petrol">Prüfen ist besser.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Pharmacy ticket */}
          <article data-reveal className="sticker relative overflow-hidden bg-cream p-7 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-ink/60">Pharmazentralnummer</p>
                <p className="display mt-2 text-5xl sm:text-6xl">{site.pzn}</p>
              </div>
              <span className="-rotate-6 rounded-lg border-2 border-algae px-3 py-1 font-hand text-2xl font-bold text-algae">in jeder Apotheke</span>
            </div>
            <p className="mt-5 max-w-lg text-lg leading-snug">
              SPIRULI ist bei der IFA GmbH (Informationsstelle für Arzneispezialitäten) gelistet und damit in Apotheken in ganz Deutschland eindeutig
              bestellbar.
            </p>
            <div className="mt-6 border-t-2 border-dashed border-ink/30 pt-6">
              <PznBarcode pzn={site.pzn} className="h-16 w-full text-ink" />
              <p className="mt-2 text-center text-sm font-bold tracking-[0.3em]">PZN - {site.pzn}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowMath((v) => !v)}
              aria-expanded={showMath}
              className="mt-4 flex w-full items-center justify-between text-left text-sm font-semibold text-ink/70 hover:text-ink"
            >
              <span className="inline-flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${valid ? "bg-algae" : "bg-red-500"}`} />
                Prüfziffer {valid ? "verifiziert" : "ungültig"} – so wird gerechnet
              </span>
              <span className={`text-xl transition-transform ${showMath ? "rotate-45" : ""}`}>+</span>
            </button>
            <motion.div initial={false} animate={{ height: showMath ? "auto" : 0, opacity: showMath ? 1 : 0 }} className="overflow-hidden">
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm font-semibold tabular-nums">
                {weighted.map((_, i) => (
                  <span key={i} className="rounded-md bg-cream-200 px-2 py-1">
                    {digits[i]}×{i + 1}
                  </span>
                ))}
                <span className="px-1">= {sum}</span>
                <span className="px-1 text-ink/60">mod 11 =</span>
                <span className="rounded-md bg-lime px-2 py-1 font-extrabold">{sum % 11}</span>
              </div>
            </motion.div>
          </article>

          {/* SGS Fresenius */}
          <article data-reveal className="sticker flex flex-col items-center bg-algae-soft p-7 text-center sm:p-9">
            <Stamp text="ANALYSIERT · ZERTIFIZIERT · GEPRÜFT · " className="w-40">
              <span className="block text-lg font-extrabold leading-tight">
                SGS
                <br />
                Fresenius
              </span>
            </Stamp>
            <h3 className="mt-6 text-3xl font-extrabold">Unabhängig analysiert &amp; zertifiziert</h3>
            <p className="mt-3 text-lg leading-snug">
              Der Qualitätsschutzprozess von SPIRULI wird von SGS Fresenius analysiert und zertifiziert – unabhängige Laboranalytik für ein Getränk, dem
              man vertrauen kann.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
