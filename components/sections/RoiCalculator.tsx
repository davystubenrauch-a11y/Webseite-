"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { computeRoi, ROI_ASSUMPTIONS } from "@/lib/roi";

const euro = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;
const int = (n: number) => Math.round(n).toLocaleString("en-US");
const oneDec = (n: number) => n.toFixed(1);
const pct = (n: number) => `+${(n * 100).toFixed(1)}%`;
const times = (n: number) => `${n.toFixed(1)}×`;

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
};

function Slider({ label, value, min, max, step, onChange, display }: SliderProps) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">{label}</span>
        <span className="font-serif text-2xl font-semibold tabular-nums text-white">{display}</span>
      </div>
      <input
        type="range"
        className="gold-range mt-4"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--fill" as string]: `${fill}%` }}
      />
    </div>
  );
}

export default function RoiCalculator() {
  const [clients, setClients] = useState(400);
  const [ticket, setTicket] = useState(85);
  const [rating, setRating] = useState(4.1);
  const [existing, setExisting] = useState(120);

  const roi = useMemo(() => computeRoi({ clients, ticket, rating, existing }), [clients, ticket, rating, existing]);
  const maxBar = roi.months[11].with;

  return (
    <section id="roi" className="relative overflow-x-clip py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-royal/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <span className="eyebrow" data-reveal>
              03 — Review ROI Calculator
            </span>
            <h2 className="section-title mt-5" data-reveal>
              See what <span className="text-gold italic">five stars</span> are worth.
            </h2>
          </div>
          <p className="text-white/60 lg:pb-2" data-reveal>
            Slide your monthly client volume and ticket size. We model how many more reviews a tap card captures and
            what a higher rating does to revenue over the next 12 months.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass rim space-y-9 p-6 sm:p-8" data-reveal>
            <Slider label="Monthly clients" value={clients} min={20} max={3000} step={10} onChange={setClients} display={int(clients)} />
            <Slider label="Avg. spend per client" value={ticket} min={10} max={1500} step={5} onChange={setTicket} display={euro(ticket)} />
            <Slider label="Current Google rating" value={rating} min={3} max={4.8} step={0.1} onChange={setRating} display={`${rating.toFixed(1)}★`} />
            <Slider label="Existing reviews" value={existing} min={0} max={1500} step={10} onChange={setExisting} display={int(existing)} />
            <p className="border-t border-white/10 pt-5 text-[11px] leading-relaxed text-white/40">
              Estimates only. Assumes {ROI_ASSUMPTIONS.baselineRate * 100}% of clients review unprompted vs.{" "}
              {ROI_ASSUMPTIONS.cardRate * 100}% when handed a tap card, card reviews averaging {ROI_ASSUMPTIONS.newReviewStars}★, and ~
              {ROI_ASSUMPTIONS.revenuePerStar * 100}% revenue per additional star (Harvard Business School, Luca 2011).
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" data-reveal-stagger>
              <Metric label="New reviews / yr" value={roi.newReviews} format={int} />
              <Metric label="vs. today" value={roi.multiplier} format={times} />
              <Metric label="Projected rating" value={roi.projectedRating} format={oneDec} suffix="★" />
              <Metric label="Revenue lift" value={roi.liftPct} format={pct} />
            </div>

            <div className="glass rim relative overflow-hidden p-6 sm:p-8" data-reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">Projected extra revenue · 12 months</p>
                  <AnimatedNumber value={roi.revenueLift} format={euro} className="mt-2 block font-serif text-5xl font-semibold text-gold sm:text-6xl" />
                </div>
                <div className="flex gap-4 text-xs text-white/60">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    Without card
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                    With f&amp;d card
                  </span>
                </div>
              </div>

              <div className="mt-8 flex h-56 items-end gap-1.5 sm:gap-2.5" role="img" aria-label="Cumulative reviews over 12 months, with and without the card">
                {roi.months.map((m) => (
                  <div key={m.month} className="flex h-full flex-1 flex-col justify-end">
                    <div className="relative flex h-full items-end justify-center gap-[3px]">
                      <motion.div
                        className="w-1/2 rounded-t-md bg-white/15"
                        animate={{ height: `${(m.without / maxBar) * 100}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      />
                      <motion.div
                        className="w-1/2 rounded-t-md bg-gradient-to-t from-gold/40 via-gold to-gold-soft shadow-[0_0_20px_-4px_rgba(212,175,55,0.8)]"
                        animate={{ height: `${(m.with / maxBar) * 100}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20, delay: m.month * 0.02 }}
                      />
                    </div>
                    <span className="mt-2 text-center text-[10px] tabular-nums text-white/35">M{m.month}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-white/40">Cumulative Google reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, format, suffix }: { label: string; value: number; format: (n: number) => string; suffix?: string }) {
  return (
    <div className="glass rim p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">{label}</p>
      <p className="mt-3 font-serif text-3xl font-semibold tabular-nums text-white">
        <AnimatedNumber value={value} format={format} />
        {suffix && <span className="text-gold">{suffix}</span>}
      </p>
    </div>
  );
}
