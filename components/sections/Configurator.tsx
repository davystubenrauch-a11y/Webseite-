"use client";

import { AnimatePresence, motion } from "framer-motion";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { LazyNfcStage } from "@/components/three/Lazy";
import { configStore, useConfig } from "@/lib/configStore";
import {
  addOns,
  euro,
  nfcDiscount,
  nfcProduct,
  nfcTotal,
  themes,
  tourTiers,
  webTiers,
  type ServiceId,
  type Theme,
  type Tier,
} from "@/lib/pricing";

const set = configStore.set;
const fmtEuro = (n: number) => euro(Math.round(n));

export default function Configurator() {
  return (
    <section id="konfigurator" className="relative py-16 sm:py-24">
      <div aria-hidden className="absolute inset-x-0 top-1/3 -z-10 h-[600px] bg-gradient-to-b from-transparent via-brand/[0.03] to-transparent" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          center
          eyebrow="Konfigurator"
          title={
            <>
              Stellen Sie Ihr <span className="text-brand">Paket</span> zusammen.
            </>
          }
          lead="Gestalten Sie Ihre NFC-Platte und wählen Sie bei Bedarf Website und Roomtour dazu. Ihre Auswahl übernehmen wir automatisch in die Anfrage."
        />
        <NfcStudio />
        <PackageBuilder />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ NFC studio */

function NfcStudio() {
  const { theme, lang, business, qty, exploded } = useConfig((s) => s);
  const { unit, total } = nfcTotal(qty);
  const discount = nfcDiscount(qty);

  return (
    <Reveal className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      {/* Stage */}
      <div className="card card-hover relative min-h-[420px] overflow-hidden sm:min-h-[560px]">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-blue-100 via-sky-50 to-emerald-50" />
        <LazyNfcStage className="absolute inset-0" particles={0} cameraZ={8} spin={0.3} />
        <div className="pointer-events-none absolute left-5 top-5 flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Live-Vorschau</span>
          <span className="font-heading text-xl text-slate-900">{nfcProduct.label}</span>
          <span className="text-xs text-slate-500">{nfcProduct.detail}</span>
        </div>
        <button
          type="button"
          onClick={() => set({ exploded: !exploded })}
          aria-pressed={exploded}
          className={`absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold backdrop-blur transition ${
            exploded ? "border-brand bg-brand/10 text-brand-dark" : "border-slate-200 bg-white text-slate-700 hover:border-brand/50"
          }`}
        >
          <Icon name="nfc" className="h-4 w-4" />
          {exploded ? "Chip ausblenden" : "NFC-Chip zeigen"}
        </button>
        <AnimatePresence>
          {exploded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="card absolute bottom-5 right-5 max-w-[240px] !rounded-2xl p-4 text-xs leading-relaxed text-slate-700"
            >
              <p className="font-semibold text-brand-dark">NTAG 215 · 13,56 MHz</p>
              Kupfer-Antenne und Chip sind zwischen zwei Acrylschichten versiegelt: wasserfest, kratzfest, ohne Batterie.
            </motion.div>
          )}
        </AnimatePresence>
        <span className="pointer-events-none absolute right-5 top-5 text-[10px] uppercase tracking-[0.3em] text-slate-400">Ziehen zum Drehen</span>
      </div>

      {/* Controls */}
      <div className="card flex flex-col gap-7 p-6 sm:p-8">
        <div className="flex items-center gap-4 rounded-2xl border border-brand/20 bg-brand/[0.05] p-4">
          <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-white to-[#e7ebf0]">
            <span className="nfc-ring absolute inset-1 rounded-full" />
            <Icon name="nfc" className="h-5 w-5 text-[#202124]" />
          </span>
          <span>
            <span className="block font-semibold text-slate-900">{nfcProduct.label}</span>
            <span className="block text-xs text-slate-500">{nfcProduct.detail} · NTAG 215 · ab {euro(nfcProduct.price)}</span>
          </span>
        </div>

        <Field label="Farbe">
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(themes) as Theme[]).map((k) => (
              <Choice key={k} active={theme === k} onClick={() => set({ theme: k })}>
                <span className="mx-auto block h-8 w-8 rounded-full border border-slate-300" style={{ background: themes[k].swatch }} />
                <span className="mt-2 block text-xs font-semibold">{themes[k].label}</span>
              </Choice>
            ))}
          </div>
        </Field>

        <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
          <Field label="Firmenname (optional)">
            <input
              value={business}
              maxLength={32}
              onChange={(e) => set({ business: e.target.value })}
              placeholder="z. B. Café Isarblick"
              className="input"
            />
          </Field>
          <Field label="Sprache">
            <div className="flex rounded-full border border-slate-200 bg-slate-100 p-1">
              {(["en", "de"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set({ lang: l })}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase transition ${lang === l ? "bg-brand text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <Field label={`Menge: ${qty} Stück`}>
          <input
            type="range"
            min={1}
            max={100}
            value={qty}
            onChange={(e) => set({ qty: Number(e.target.value) })}
            className="range"
            style={{ ["--fill" as string]: `${((qty - 1) / 99) * 100}%` }}
            aria-label="Stückzahl"
          />
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>1</span>
            <span>10 · −10 %</span>
            <span>20 · −15 %</span>
            <span>50+ · −25 %</span>
          </div>
        </Field>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-slate-200 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {euro(unit)} / Stück {discount > 0 && <span className="ml-1 text-google-green">−{discount * 100} %</span>}
            </p>
            <p className="mt-1 font-heading text-4xl font-semibold text-slate-900">
              <AnimatedNumber value={total} format={fmtEuro} />
            </p>
            <p className="text-[11px] text-slate-400">zzgl. MwSt. · unverbindlicher Richtwert</p>
          </div>
          <a href="#anfrage" onClick={() => addService("nfc")} className="btn-primary">
            In Anfrage übernehmen
          </a>
        </div>
      </div>
    </Reveal>
  );
}

function addService(id: ServiceId) {
  const cur = configStore.get().inquiryServices;
  if (!cur.includes(id)) set({ inquiryServices: [...cur, id] });
}

/* ------------------------------------------------------------- package builder */

function PackageBuilder() {
  const { webTier, tourTier, addOns: picked, qty, inquiryServices } = useConfig((s) => s);
  const web = webTiers.find((t) => t.id === webTier);
  const tour = tourTiers.find((t) => t.id === tourTier);
  const extras = addOns.filter((a) => picked.includes(a.id) && ((a.for === "web" && web) || (a.for === "roomtour" && tour)));
  const nfc = inquiryServices.includes("nfc") ? nfcTotal(qty).total : 0;
  const oneOff = (web?.price ?? 0) + (tour?.price ?? 0) + nfc + extras.filter((e) => !e.suffix).reduce((s, e) => s + e.price, 0);
  const monthly = extras.filter((e) => e.suffix).reduce((s, e) => s + e.price, 0);

  const toggleAddOn = (id: string) => set({ addOns: picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id] });
  const pick = (key: "webTier" | "tourTier", service: ServiceId, id: string) => {
    const deselect = configStore.get()[key] === id;
    set({ [key]: deselect ? null : id });
    const cur = configStore.get().inquiryServices;
    set({ inquiryServices: deselect ? cur.filter((s) => s !== service) : cur.includes(service) ? cur : [...cur, service] });
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_0.85fr]">
      <TierColumn title="Website" icon="web" tiers={webTiers} selected={webTier} onPick={(id) => pick("webTier", "web", id)}>
        {web && <AddOnList service="web" picked={picked} onToggle={toggleAddOn} />}
      </TierColumn>
      <TierColumn title="Roomtour" icon="roomtour" tiers={tourTiers} selected={tourTier} onPick={(id) => pick("tourTier", "roomtour", id)}>
        {tour && <AddOnList service="roomtour" picked={picked} onToggle={toggleAddOn} />}
      </TierColumn>

      <Reveal delay={0.2} className="lg:sticky lg:top-28 lg:self-start">
        <div className="card card-hover p-6 sm:p-8">
          <p className="eyebrow">Ihr Paket</p>
          <ul className="mt-6 space-y-3 text-sm">
            {nfc > 0 && <Line label={`${qty} × ${nfcProduct.label}`} value={euro(Math.round(nfc))} />}
            {web && <Line label={`Website · ${web.label}`} value={euro(web.price)} />}
            {tour && <Line label={`Roomtour · ${tour.label}`} value={euro(tour.price)} />}
            {extras.map((e) => (
              <Line key={e.id} label={e.label} value={`${euro(e.price)}${e.suffix ? ` ${e.suffix}` : ""}`} />
            ))}
            {!nfc && !web && !tour && <li className="text-slate-500">Wählen Sie links ein Paket oder übernehmen Sie Ihr NFC-Produkt.</li>}
          </ul>
          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Einmalig, ab</p>
            <p className="font-heading text-4xl font-semibold text-brand-dark">
              <AnimatedNumber value={oneOff} format={fmtEuro} />
            </p>
            {monthly > 0 && <p className="mt-1 text-sm text-slate-600">+ {euro(monthly)} / Monat</p>}
            <p className="mt-1 text-[11px] text-slate-400">zzgl. MwSt. · finales Angebot nach Beratung</p>
          </div>
          <a href="#anfrage" className="btn-primary mt-6 w-full">
            Paket anfragen
          </a>
        </div>
      </Reveal>
    </div>
  );
}

function TierColumn({
  title,
  icon,
  tiers,
  selected,
  onPick,
  children,
}: {
  title: string;
  icon: string;
  tiers: Tier[];
  selected: string | null;
  onPick: (id: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <Reveal className="card p-6 sm:p-8">
      <h3 className="flex items-center gap-3 font-heading text-2xl font-semibold text-slate-900">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
          <Icon name={icon} />
        </span>
        {title}
      </h3>
      <div className="mt-6 space-y-3">
        {tiers.map((t) => {
          const active = selected === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onPick(t.id)}
              aria-pressed={active}
              className={`group w-full rounded-2xl border p-4 text-left transition duration-300 ${
                active ? "border-brand bg-brand/10 shadow-ring" : "border-slate-200 bg-white hover:border-brand/40 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{t.label}</span>
                <span className={`text-sm font-semibold ${active ? "text-brand-dark" : "text-slate-600"}`}>ab {euro(t.price)}</span>
              </span>
              <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {t.features.map((f) => (
                  <span key={f} className="text-xs text-slate-500">
                    · {f}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
      {children}
    </Reveal>
  );
}

function AddOnList({ service, picked, onToggle }: { service: ServiceId; picked: string[]; onToggle: (id: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-5 space-y-2 overflow-hidden">
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Extras</p>
      {addOns
        .filter((a) => a.for === service)
        .map((a) => (
          <label key={a.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm transition hover:border-brand/40">
            <span className="flex items-center gap-3">
              <input type="checkbox" checked={picked.includes(a.id)} onChange={() => onToggle(a.id)} className="checkbox" />
              {a.label}
            </span>
            <span className="whitespace-nowrap text-slate-500">
              {euro(a.price)} {a.suffix}
            </span>
          </label>
        ))}
    </motion.div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex justify-between gap-4">
      <span className="text-slate-600">{label}</span>
      <span className="whitespace-nowrap font-semibold text-slate-900">{value}</span>
    </li>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">{label}</p>
      {children}
    </div>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl border px-2 py-3 text-center transition duration-300 ${
        active ? "border-brand bg-brand/10 text-slate-900 shadow-ring" : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-brand/40"
      }`}
    >
      {children}
    </button>
  );
}
