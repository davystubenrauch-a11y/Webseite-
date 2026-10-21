"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PznBarcode from "@/components/ui/PznBarcode";
import Icon from "@/components/ui/Icon";
import { isValidPzn, site } from "@/lib/site";

const digits = site.pzn.split("").map(Number);
const weighted = digits.slice(0, 7).map((d, i) => d * (i + 1));
const sum = weighted.reduce((a, b) => a + b, 0);

export default function Quality() {
  const [showMath, setShowMath] = useState(false);
  const valid = isValidPzn(site.pzn);

  return (
    <section id="qualitaet" className="py-20 sm:py-28">
      <div className="container-page">
        <div data-reveal className="max-w-2xl">
          <span className="eyebrow">Medical Grade &amp; Zertifizierung</span>
          <h2 className="h-section mt-4">Apothekenqualität, unabhängig geprüft.</h2>
        </div>

        <div data-reveal-stagger className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="card p-7 sm:p-9">
            <div className="flex items-start gap-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-petrol text-white">
                <Icon name="pharmacy" className="h-7 w-7" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Pharmazentralnummer</p>
                <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-petrol-900">PZN {site.pzn}</h3>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-muted">
              SPIRULI ist unter der PZN {site.pzn} bei der IFA GmbH (Informationsstelle für Arzneispezialitäten) gelistet – und damit in Apotheken
              in ganz Deutschland eindeutig identifizier- und bestellbar.
            </p>

            <div className="mt-6 rounded-xl border border-sand-300 bg-white p-5 text-petrol-900">
              <PznBarcode pzn={site.pzn} className="h-16 w-full" />
              <p className="mt-2 text-center text-sm font-bold tracking-[0.2em]">PZN - {site.pzn}</p>
            </div>

            <button
              type="button"
              onClick={() => setShowMath((v) => !v)}
              aria-expanded={showMath}
              className="mt-4 flex w-full items-center justify-between gap-4 text-left text-sm text-muted transition hover:text-petrol"
            >
              <span className="inline-flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${valid ? "bg-leaf" : "bg-red-500"}`} />
                Prüfziffer {valid ? "verifiziert" : "ungültig"} (PZN-8, Modulo 11)
              </span>
              <span className={`text-lg transition-transform ${showMath ? "rotate-45" : ""}`}>+</span>
            </button>
            <motion.div initial={false} animate={{ height: showMath ? "auto" : 0, opacity: showMath ? 1 : 0 }} className="overflow-hidden">
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm tabular-nums">
                {weighted.map((w, i) => (
                  <span key={i} className="rounded-md bg-sand px-2 py-1 text-petrol-900">
                    {digits[i]}×{i + 1}
                  </span>
                ))}
                <span className="px-1 text-muted">=</span>
                <span className="font-semibold">{sum}</span>
                <span className="px-1 text-muted">mod 11 =</span>
                <span className="rounded-md bg-leaf px-2 py-1 font-bold text-white">{sum % 11}</span>
              </div>
            </motion.div>
          </article>

          <article className="card flex flex-col p-7 sm:p-9">
            <div className="flex items-start gap-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-leaf text-white">
                <Icon name="shield" className="h-7 w-7" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Qualitätsschutz</p>
                <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-petrol-900">Analysiert &amp; zertifiziert durch SGS Fresenius</h3>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-muted">
              Der Qualitätsschutzprozess von SPIRULI wird von SGS Fresenius analysiert und zertifiziert – unabhängige Laboranalytik für ein Getränk,
              dem man vertrauen kann.
            </p>
            <ul className="mt-auto grid grid-cols-3 gap-3 pt-8 text-center">
              {["Analysiert", "Zertifiziert", "Vegan"].map((l) => (
                <li key={l} className="rounded-xl bg-sand px-2 py-5">
                  <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-white text-leaf-dark shadow-card">
                    <Icon name="check" className="h-5 w-5" />
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-petrol-900">{l}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
