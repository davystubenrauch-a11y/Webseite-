"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Icon from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/Reveal";
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

/** Transparent fixed prices in three tabs; the NFC tab is a small calculator. */
export default function Pricing() {
  const [tab, setTab] = useState<ServiceId>("web");
  return (
    <section id="preise" className="section border-t border-line bg-white/40">
      <div className="container-site">
        <div className="grid-12 items-end gap-y-10">
          <SectionHead
            className="col-span-4 sm:col-span-8 lg:col-span-7"
            eyebrow="Preise"
            title={
              <>
                Faire Festpreise. <em className="italic text-sage">Von Anfang an.</em>
              </>
            }
            lead="Alle Preise zzgl. MwSt. Das genaue Angebot erhalten Sie nach einem kurzen Gespräch."
          />
          <div role="tablist" aria-label="Leistung wählen" className="col-span-4 flex w-fit gap-1 rounded-full border border-line bg-paper p-1 sm:col-span-8 lg:col-span-5 lg:justify-self-end">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`relative rounded-full px-5 py-2.5 text-sm transition ${tab === t.id ? "text-paper" : "text-ink-muted hover:text-ink"}`}
              >
                {tab === t.id && <motion.span layoutId="price-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.4 }} />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mt-16 lg:mt-20"
          >
            {tab === "web" && <Tiers tiers={webTiers} service="web" storeKey="webTier" />}
            {tab === "roomtour" && <Tiers tiers={tourTiers} service="roomtour" storeKey="tourTier" />}
            {tab === "nfc" && <NfcCalc />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Tiers({ tiers, service, storeKey }: { tiers: Tier[]; service: ServiceId; storeKey: "webTier" | "tourTier" }) {
  const choose = (id: string) => {
    configStore.set({ [storeKey]: id });
    addService(service);
  };
  return (
    <div className="grid gap-5 md:grid-cols-3 lg:gap-8">
      {tiers.map((t, i) => {
        const featured = i === 1;
        return (
          <div key={t.id} className={`card card-hover flex flex-col p-8 lg:p-10 ${featured ? "!border-sage/40 !bg-sage-pale" : "bg-white/80"}`}>
            <div className="flex items-center justify-between">
              <p className="font-heading text-2xl text-ink">{t.label}</p>
              {featured && <span className="rounded-full border border-sage/30 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-sage">Empfehlung</span>}
            </div>
            <p className="mt-8 font-heading text-5xl font-normal tracking-tight text-ink">
              {i > 0 && <span className="mr-2 text-lg text-ink-muted">ab</span>}
              {euro(t.price)}
            </p>
            <p className="mt-1 text-sm text-ink-faint">einmalig, zzgl. MwSt.</p>
            <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-8">
              {t.features.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] text-ink-soft">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  {f}
                </li>
              ))}
            </ul>
            <a href="#anfrage" onClick={() => choose(t.id)} className={`mt-10 ${featured ? "btn-primary" : "btn-secondary"}`}>
              {t.label} anfragen
            </a>
          </div>
        );
      })}
    </div>
  );
}

/** Static CSS preview of the disc, so the calculator needs no second WebGL canvas. */
function DiscPreview({ theme, name }: { theme: Theme; name: string }) {
  const dark = theme === "black";
  return (
    <div className={`relative grid h-56 w-56 place-items-center rounded-full shadow-lift sm:h-64 sm:w-64 ${dark ? "bg-gradient-to-br from-[#2a2a2e] to-[#0b0b0c]" : "bg-gradient-to-br from-white to-[#ece9e4]"}`}>
      <div className="nfc-ring absolute inset-4 rounded-full" />
      <div className={`text-center ${dark ? "text-[#f1f3f4]" : "text-[#202124]"}`}>
        <p className="text-[9px] font-semibold tracking-[0.3em]">TAP HERE</p>
        <p className="mt-2 text-3xl font-medium tracking-tight">
          <span className="text-google-blue">G</span>
          <span className="text-google-red">o</span>
          <span className="text-google-yellow">o</span>
          <span className="text-google-blue">g</span>
          <span className="text-google-green">l</span>
          <span className="text-google-red">e</span>
        </p>
        <p className="text-xs tracking-[0.2em] text-google-yellow">★★★★★</p>
        <p className="mt-1 text-[10px]">Review Us On</p>
        {name && <p className={`mt-1 max-w-[9rem] truncate font-heading text-xs italic ${dark ? "text-[#bdc1c6]" : "text-[#5f6368]"}`}>{name}</p>}
      </div>
    </div>
  );
}

function NfcCalc() {
  const { theme, qty, business } = useConfig((s) => s);
  const { unit, total } = nfcTotal(qty);
  const discount = nfcDiscount(qty);
  return (
    <div className="card grid overflow-hidden bg-white/80 md:grid-cols-2">
      <div className="grid place-items-center bg-sand/70 px-8 py-16">
        <DiscPreview theme={theme} name={business} />
      </div>
      <div className="flex flex-col gap-8 p-8 lg:p-12">
        <div>
          <p className="font-heading text-2xl text-ink">{nfcProduct.label}</p>
          <p className="mt-1 text-sm text-ink-muted">{nfcProduct.detail}</p>
        </div>
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-ink-faint">Farbe</p>
          <div className="flex gap-2">
            {(Object.keys(themes) as Theme[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => configStore.set({ theme: k })}
                aria-pressed={theme === k}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${theme === k ? "border-ink text-ink" : "border-line text-ink-muted hover:border-ink/40"}`}
              >
                <span className="h-3.5 w-3.5 rounded-full ring-1 ring-line" style={{ background: themes[k].swatch }} />
                {themes[k].label}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-ink-faint">Firmenname (optional)</span>
          <input value={business} maxLength={32} onChange={(e) => configStore.set({ business: e.target.value })} placeholder="z. B. Café Isarblick" className="input" />
        </label>
        <label className="block">
          <span className="mb-3 flex justify-between text-[11px] uppercase tracking-[0.22em] text-ink-faint">
            Menge <span className="normal-case tracking-normal text-ink-soft">{qty} Stück</span>
          </span>
          <input
            type="range"
            min={1}
            max={100}
            value={qty}
            onChange={(e) => configStore.set({ qty: Number(e.target.value) })}
            className="range"
            style={{ ["--fill" as string]: `${((qty - 1) / 99) * 100}%` }}
            aria-label="Stückzahl"
          />
        </label>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line pt-8">
          <div>
            <p className="text-sm text-ink-muted">
              {euro(unit)} pro Stück {discount > 0 && <span className="text-sage">· −{discount * 100} %</span>}
            </p>
            <p className="font-heading text-4xl text-ink">
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
