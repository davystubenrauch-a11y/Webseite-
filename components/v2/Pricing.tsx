"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Icon from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/Reveal";
import { LazyNfcStage } from "@/components/three/Lazy";
import { configStore, useConfig } from "@/lib/configStore";
import { euro, nfcDiscount, nfcProduct, nfcTotal, themes, tourTiers, webTiers, type ServiceId, type Theme, type Tier } from "@/lib/pricing";

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

/** Tabbed price tables; the NFC tab doubles as a small configurator with live 3D preview. */
export default function Pricing() {
  const [tab, setTab] = useState<ServiceId>("web");
  return (
    <section id="preise" className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead center eyebrow="Preise" title="Faire Festpreise. Von Anfang an." lead="Alle Preise zzgl. MwSt. Das genaue Angebot bekommen Sie nach einem kurzen Gespräch." />

        <div role="tablist" aria-label="Leistung wählen" className="mx-auto mt-10 flex w-fit rounded-full bg-slate-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === t.id ? "text-white" : "text-slate-600 hover:text-slate-900"}`}
            >
              {tab === t.id && <motion.span layoutId="price-tab" className="absolute inset-0 rounded-full bg-brand" />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-10"
          >
            {tab === "web" && <TierGrid tiers={webTiers} service="web" storeKey="webTier" />}
            {tab === "roomtour" && <TierGrid tiers={tourTiers} service="roomtour" storeKey="tourTier" />}
            {tab === "nfc" && <NfcPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function TierGrid({ tiers, service, storeKey }: { tiers: Tier[]; service: ServiceId; storeKey: "webTier" | "tourTier" }) {
  const choose = (id: string) => {
    configStore.set({ [storeKey]: id });
    addService(service);
  };
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {tiers.map((t, i) => {
        const featured = i === 1;
        return (
          <div
            key={t.id}
            className={`relative flex flex-col rounded-3xl p-7 ${featured ? "bg-slate-900 text-white shadow-2xl md:-translate-y-3" : "card"}`}
          >
            {featured && <span className="absolute -top-3 left-7 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">Beliebt</span>}
            <p className={`text-sm font-semibold ${featured ? "text-blue-200" : "text-brand"}`}>{t.label}</p>
            <p className="mt-3 font-heading text-4xl font-extrabold tracking-tight">
              {i === 0 ? "" : "ab "}
              {euro(t.price)}
            </p>
            <p className={`text-sm ${featured ? "text-slate-400" : "text-slate-500"}`}>einmalig</p>
            <ul className="mt-6 flex-1 space-y-3">
              {t.features.map((f) => (
                <li key={f} className={`flex gap-3 text-sm ${featured ? "text-slate-200" : "text-slate-700"}`}>
                  <Icon name="check" className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? "text-emerald-400" : "text-emerald-600"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#anfrage"
              onClick={() => choose(t.id)}
              className={featured ? "btn-primary mt-8 !bg-white !text-slate-900 hover:!bg-blue-50" : "btn-secondary mt-8"}
            >
              {t.label} anfragen
            </a>
          </div>
        );
      })}
    </div>
  );
}

function NfcPanel() {
  const { theme, qty, business } = useConfig((s) => s);
  const { unit, total } = nfcTotal(qty);
  const discount = nfcDiscount(qty);
  return (
    <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white md:grid-cols-2">
      <div className="relative min-h-[340px] bg-gradient-to-br from-emerald-100 via-sky-50 to-white">
        <LazyNfcStage className="absolute inset-0" particles={0} cameraZ={8} spin={0.3} />
      </div>
      <div className="flex flex-col gap-6 p-7 sm:p-10">
        <div>
          <p className="text-sm font-semibold text-emerald-700">{nfcProduct.label}</p>
          <p className="mt-1 text-sm text-slate-500">{nfcProduct.detail}</p>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Farbe</p>
          <div className="flex gap-2">
            {(Object.keys(themes) as Theme[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => configStore.set({ theme: k })}
                aria-pressed={theme === k}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  theme === k ? "border-brand bg-brand/10 text-brand" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="h-4 w-4 rounded-full border border-slate-300" style={{ background: themes[k].swatch }} />
                {themes[k].label}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Firmenname (optional)</span>
          <input value={business} maxLength={32} onChange={(e) => configStore.set({ business: e.target.value })} placeholder="z. B. Café Isarblick" className="input" />
        </label>
        <label className="block">
          <span className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Menge <span className="normal-case tracking-normal text-slate-700">{qty} Stück</span>
          </span>
          <input
            type="range"
            min={1}
            max={100}
            value={qty}
            onChange={(e) => configStore.set({ qty: Number(e.target.value) })}
            className="range"
            style={{ ["--fill" as string]: `${((qty - 1) / 99) * 100}%` }}
          />
        </label>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-slate-200 pt-6">
          <div>
            <p className="text-sm text-slate-500">
              {euro(unit)} / Stück {discount > 0 && <span className="font-semibold text-emerald-600">−{discount * 100} %</span>}
            </p>
            <p className="font-heading text-4xl font-extrabold text-slate-900">
              <AnimatedNumber value={total} format={fmtEuro} />
            </p>
          </div>
          <a href="#anfrage" onClick={() => addService("nfc")} className="btn-primary">
            Anfragen
          </a>
        </div>
      </div>
    </div>
  );
}
