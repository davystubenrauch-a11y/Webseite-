"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Icon from "@/components/ui/Icon";
import { configStore, useConfig } from "@/lib/configStore";
import { euro, nfcDiscount, nfcProduct, nfcTotal, themes, tourTiers, webTiers, type ServiceId, type Theme, type Tier } from "@/lib/pricing";
import Panel from "./Panel";

const tabs: { id: ServiceId; label: string }[] = [
  { id: "web", label: "Website" },
  { id: "roomtour", label: "Roomtour" },
  { id: "nfc", label: "NFC-Platte" },
];

const fmtEuro = (n: number) => euro(Math.round(n));

const addService = (id: ServiceId) => {
  const cur = configStore.get().inquiryServices;
  if (!cur.includes(id)) configStore.set({ inquiryServices: [...cur, id] });
};

/** Fixed prices in three tabs; the NFC tab is a small quantity calculator. */
export default function PricingPanel() {
  const [tab, setTab] = useState<ServiceId>("web");
  return (
    <Panel id="preise" title="Faire Festpreise." lead="Alle Preise zzgl. MwSt. Das genaue Angebot erhalten Sie nach einem kurzen Gespräch.">
      <div role="tablist" aria-label="Leistung wählen" className="flex w-fit gap-1 rounded-full border border-line bg-white/70 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === t.id ? "text-paper" : "text-ink-muted hover:text-ink"}`}
          >
            {tab === t.id && <motion.span layoutId="price-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.35 }} />}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mt-8">
          {tab === "web" && <Tiers tiers={webTiers} service="web" storeKey="webTier" />}
          {tab === "roomtour" && <Tiers tiers={tourTiers} service="roomtour" storeKey="tourTier" />}
          {tab === "nfc" && <NfcCalc />}
        </motion.div>
      </AnimatePresence>
    </Panel>
  );
}

function Tiers({ tiers, service, storeKey }: { tiers: Tier[]; service: ServiceId; storeKey: "webTier" | "tourTier" }) {
  const choose = (id: string) => {
    configStore.set({ [storeKey]: id });
    addService(service);
  };
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[1.75rem] border border-line bg-white/70">
      {tiers.map((t, i) => (
        <div key={t.id} className={`grid gap-6 p-7 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8 ${i === 1 ? "bg-sage-pale" : ""}`}>
          <div>
            <div className="flex items-center gap-3">
              <p className="font-heading text-xl font-extrabold text-ink">{t.label}</p>
              {i === 1 && <span className="rounded-full bg-sage px-2.5 py-0.5 text-[11px] font-semibold text-paper">Empfehlung</span>}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink-muted">
                  <Icon name="check" className="h-3.5 w-3.5 text-sage" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-5 sm:flex-col sm:items-end sm:gap-3">
            <p className="font-heading text-3xl font-extrabold tracking-tight text-ink">
              {i > 0 && <span className="mr-1.5 text-base font-semibold text-ink-muted">ab</span>}
              {euro(t.price)}
            </p>
            <a href="#anfrage" onClick={() => choose(t.id)} className={i === 1 ? "btn-primary !py-2.5" : "btn-secondary !py-2.5"}>
              Anfragen
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function NfcCalc() {
  const { theme, qty, business } = useConfig((s) => s);
  const { unit, total } = nfcTotal(qty);
  const discount = nfcDiscount(qty);
  return (
    <div className="rounded-[1.75rem] border border-line bg-white/70 p-7 sm:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-heading text-xl font-extrabold text-ink">{nfcProduct.label}</p>
          <p className="mt-1 text-sm text-ink-muted">{nfcProduct.detail}</p>
        </div>
        <div className="flex gap-2">
          {(Object.keys(themes) as Theme[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => configStore.set({ theme: k })}
              aria-pressed={theme === k}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${theme === k ? "border-ink text-ink" : "border-line text-ink-muted hover:border-ink/40"}`}
            >
              <span className="h-3.5 w-3.5 rounded-full ring-1 ring-line" style={{ background: themes[k].swatch }} />
              {themes[k].label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.15em] text-ink-faint">Firmenname (optional)</span>
          <input value={business} maxLength={32} onChange={(e) => configStore.set({ business: e.target.value })} placeholder="z. B. Café Isarblick" className="input" />
        </label>
        <label className="block">
          <span className="mb-3 flex justify-between text-xs font-bold uppercase tracking-[0.15em] text-ink-faint">
            Menge <span className="normal-case tracking-normal text-ink">{qty} Stück</span>
          </span>
          <input
            type="range"
            min={1}
            max={100}
            value={qty}
            onChange={(e) => configStore.set({ qty: Number(e.target.value) })}
            className="range mt-4"
            style={{ ["--fill" as string]: `${((qty - 1) / 99) * 100}%` }}
            aria-label="Stückzahl"
          />
        </label>
      </div>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-8">
        <div>
          <p className="text-sm text-ink-muted">
            {euro(unit)} pro Stück {discount > 0 && <span className="font-semibold text-sage">· −{discount * 100} %</span>}
          </p>
          <p className="font-heading text-4xl font-extrabold text-ink">
            <AnimatedNumber value={total} format={fmtEuro} />
          </p>
        </div>
        <a href="#anfrage" onClick={() => addService("nfc")} className="btn-primary">
          Anfragen
        </a>
      </div>
    </div>
  );
}
