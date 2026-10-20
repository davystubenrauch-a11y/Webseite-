"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { LazyRoomScan } from "@/components/three/Lazy";
import { configStore } from "@/lib/configStore";
import { services } from "@/lib/content";
import type { ServiceId } from "@/lib/pricing";

const previews: Record<ServiceId, () => React.ReactElement> = {
  nfc: NfcPreview,
  web: WebPreview,
  roomtour: TourPreview,
};

/** Preselect a service in the inquiry wizard and jump there. */
const inquire = (id: ServiceId) => {
  const current = configStore.get().inquiryServices;
  configStore.set({ inquiryServices: current.includes(id) ? current : [...current, id] });
};

export default function Services() {
  return (
    <section id="leistungen" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          center
          eyebrow="Leistungen"
          title={
            <>
              Drei Disziplinen. <span className="text-gold italic">Ein Anspruch.</span>
            </>
          }
          lead="Vom ersten Eindruck vor Ort bis zum digitalen Rundgang: Unsere Leistungen greifen ineinander und stärken gemeinsam Ihre Reputation."
        />

        <div className="mt-20 space-y-8 lg:space-y-10">
          {services.map((s, i) => {
            const Preview = previews[s.id];
            const flip = i % 2 === 1;
            return (
              <Reveal key={s.id}>
                <article className="glass rim group grid overflow-hidden lg:grid-cols-2">
                  <div className={`relative flex flex-col justify-center p-7 sm:p-12 ${flip ? "lg:order-2" : ""}`}>
                    <span aria-hidden className="pointer-events-none absolute -top-6 right-6 font-serif text-[9rem] font-semibold leading-none text-white/[0.03]">
                      {s.index}
                    </span>
                    <span className="inline-flex items-center gap-3 text-gold">
                      <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10 transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                        <Icon name={s.id} />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.3em]">{s.kicker}</span>
                    </span>
                    <h3 className="mt-6 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">{s.title}</h3>
                    <p className="mt-4 leading-relaxed text-white/65">{s.text}</p>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-9 flex flex-wrap gap-3">
                      <a href="#anfrage" onClick={() => inquire(s.id)} className="btn-gold">
                        Jetzt anfragen
                      </a>
                      <a href="#konfigurator" className="btn-glass">
                        {s.id === "nfc" ? "Live konfigurieren" : "Paket zusammenstellen"}
                      </a>
                    </div>
                  </div>
                  <div className={`relative min-h-[320px] border-white/5 bg-navy-950/40 sm:min-h-[420px] ${flip ? "lg:order-1 lg:border-r" : "lg:border-l"}`}>
                    <Preview />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Looping tap animation: phone meets disc, NFC rings pulse, review lands. */
function NfcPreview() {
  const loop = { duration: 4, repeat: Infinity, ease: [0.45, 0, 0.2, 1] as const };
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden">
      <div aria-hidden className="absolute h-72 w-72 rounded-full bg-google-blue/10 blur-3xl" />
      <div className="relative">
        {/* Mini disc */}
        <div className="relative grid h-52 w-52 place-items-center rounded-full bg-gradient-to-br from-white to-[#e7ebf0] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] sm:h-60 sm:w-60">
          <div className="nfc-ring absolute inset-3 rounded-full" />
          <div className="relative text-center text-[#202124]">
            <p className="text-[9px] font-bold tracking-[0.3em]">TAP HERE</p>
            <Icon name="nfc" className="mx-auto mt-2 h-8 w-8" />
            <p className="mt-2 text-2xl font-medium tracking-tight">
              <span className="text-google-blue">G</span>
              <span className="text-google-red">o</span>
              <span className="text-google-yellow">o</span>
              <span className="text-google-blue">g</span>
              <span className="text-google-green">l</span>
              <span className="text-google-red">e</span>
            </p>
            <p className="text-xs tracking-[0.2em] text-google-yellow">★★★★★</p>
          </div>
        </div>
        {/* Pulses */}
        {[0, 0.4, 0.8].map((d) => (
          <motion.span
            key={d}
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-gold/60"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1, 1.5], opacity: [0, 0.8, 0] }}
            transition={{ ...loop, times: [0, 0.35 + d / 10, 0.75], delay: d }}
          />
        ))}
        {/* Phone */}
        <motion.div
          aria-hidden
          className="absolute -right-16 top-6 h-36 w-[72px] rounded-[18px] border-2 border-white/70 bg-navy-900 p-1.5 shadow-2xl sm:-right-20"
          animate={{ x: [60, 0, 0, 60], y: [30, 0, 0, 30], rotate: [18, 6, 6, 18] }}
          transition={{ ...loop, times: [0, 0.3, 0.7, 1] }}
        >
          <div className="h-full w-full rounded-[12px] bg-gradient-to-b from-navy-700 to-navy-900 p-1.5">
            <div className="h-2 w-8 rounded bg-white/20" />
            <div className="mt-2 h-1.5 w-10 rounded bg-white/10" />
            <motion.div
              className="mt-3 rounded-md bg-white p-1 text-center text-[7px] font-bold text-[#202124]"
              animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.8, 0.8, 1, 1, 0.8] }}
              transition={{ ...loop, times: [0, 0.32, 0.4, 0.75, 0.85] }}
            >
              <span className="text-google-yellow">★★★★★</span>
              <br />
              Gesendet ✓
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Browser mockup that assembles a page and reports a Lighthouse score. */
function WebPreview() {
  const build = (i: number) => ({
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.4 },
    transition: { duration: 0.7, delay: 0.25 + i * 0.18, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10" style={{ perspective: 1400 }}>
      <motion.div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-navy-900 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:[transform:rotateY(-6deg)_rotateX(4deg)]"
      >
        <div className="flex items-center gap-2 border-b border-white/10 bg-navy-800 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-google-red/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-google-yellow/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-google-green/80" />
          <span className="ml-3 flex flex-1 items-center gap-1.5 truncate rounded-md bg-navy-950/70 px-3 py-1 text-[10px] text-white/50">
            <Icon name="lock" className="h-3 w-3 text-google-green" /> ihr-unternehmen.de
          </span>
        </div>
        <div className="space-y-3 p-5">
          <motion.div {...build(0)} className="flex items-center justify-between">
            <span className="h-3 w-16 rounded bg-gold/70" />
            <span className="flex gap-2">
              {[0, 1, 2].map((k) => (
                <span key={k} className="h-2 w-8 rounded bg-white/15" />
              ))}
            </span>
          </motion.div>
          <motion.div {...build(1)} className="relative overflow-hidden rounded-lg bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 p-5">
            <span className="block h-4 w-3/4 rounded bg-white/80" />
            <span className="mt-2 block h-4 w-1/2 rounded bg-gold/80" />
            <span className="mt-4 block h-2 w-2/3 rounded bg-white/20" />
            <span className="mt-4 inline-block h-6 w-24 rounded-full bg-gold" />
            <span aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-google-blue/30 blur-2xl" />
          </motion.div>
          <div className="grid grid-cols-3 gap-3">
            {[2, 3, 4].map((k) => (
              <motion.div key={k} {...build(k)} className="rounded-lg border border-white/5 bg-white/[0.04] p-3">
                <span className="block h-5 w-5 rounded bg-gold/40" />
                <span className="mt-2 block h-1.5 w-full rounded bg-white/15" />
                <span className="mt-1 block h-1.5 w-2/3 rounded bg-white/10" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.div {...build(5)} className="glass absolute bottom-6 right-6 flex items-center gap-3 !rounded-2xl px-4 py-3">
        <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90" aria-hidden>
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <motion.circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="#34A853"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 0.98 }}
            transition={{ duration: 1.6, delay: 1 }}
          />
        </svg>
        <div>
          <p className="text-lg font-bold text-google-green">98</p>
          <p className="text-[10px] uppercase tracking-widest text-white/50">Performance</p>
        </div>
      </motion.div>
    </div>
  );
}

/** Live 3D point-cloud room scan with tour UI overlay. */
function TourPreview() {
  return (
    <div className="absolute inset-0">
      <LazyRoomScan className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-google-red" /> KI-Scan aktiv
        </span>
        <span className="rounded-full border border-white/15 bg-navy-950/60 px-3 py-1 backdrop-blur">8K · 360°</span>
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
        {["Wohnbereich · 34 m²", "Essbereich", "Grundriss ✓"].map((t) => (
          <span key={t} className="rounded-full border border-gold/30 bg-navy-950/70 px-3 py-1.5 text-[11px] text-gold-soft backdrop-blur">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
