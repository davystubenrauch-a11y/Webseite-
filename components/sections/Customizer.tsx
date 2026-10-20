"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LazyCardCanvas from "@/components/three/LazyCardCanvas";
import { cardStore, finishes, useCard, type Finish } from "@/lib/cardStore";
import { Arrow } from "./Hero";

const taglines = ["Review us on Google", "Loved your stay?", "Tap for 5 stars", "Share your experience"];

const tiers = [
  { qty: 1, price: 39 },
  { qty: 5, price: 34 },
  { qty: 10, price: 29 },
  { qty: 25, price: 24 },
];

export default function Customizer() {
  const { name, tagline, finish, flipped } = useCard((s) => s);
  const [tier, setTier] = useState(1);
  const [added, setAdded] = useState(false);
  const t = tiers[tier];

  const addToOrder = () => {
    cardStore.set({ order: { qty: t.qty, total: t.qty * t.price } });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 900);
  };

  return (
    <section id="customizer" className="relative overflow-x-clip py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="eyebrow" data-reveal>
            02 — Live Card Studio
          </span>
          <h2 className="section-title mt-5" data-reveal>
            Make it <span className="text-gold italic">unmistakably</span> yours.
          </h2>
          <p className="mt-5 text-white/60" data-reveal>
            Type your company name and watch it engrave onto the card in real time. Choose a metal finish, flip to
            inspect the reverse, and reserve your batch in seconds.
          </p>
          <div data-scrub-line className="mt-8 h-px w-full bg-gradient-to-r from-gold via-gold/40 to-transparent" />
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="glass rim relative h-[420px] overflow-hidden sm:h-[560px]" data-reveal>
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.18),transparent_60%)]" />
            <LazyCardCanvas className="absolute inset-0" followFlip spin={0.25} particles={260} cameraZ={7} />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-navy-900/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live preview
            </div>
            <button
              onClick={() => cardStore.set({ flipped: !flipped })}
              className="btn-glass absolute bottom-5 right-5 !px-5 !py-2.5"
            >
              <FlipIcon /> {flipped ? "Show front" : "Flip card"}
            </button>
          </div>

          <div className="glass rim p-6 sm:p-8" data-reveal>
            <label htmlFor="company" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
              Company name
            </label>
            <div className="relative mt-3">
              <input
                id="company"
                value={name}
                maxLength={28}
                onChange={(e) => cardStore.set({ name: e.target.value, flipped: false })}
                placeholder="Your Business"
                className="w-full rounded-2xl border border-white/10 bg-navy-900/60 px-5 py-4 font-serif text-2xl text-white outline-none transition placeholder:text-white/25 focus:border-gold/60 focus:shadow-rim"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs tabular-nums text-white/30">{name.length}/28</span>
            </div>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">Headline</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {taglines.map((tl) => (
                <button
                  key={tl}
                  onClick={() => cardStore.set({ tagline: tl, flipped: false })}
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    tagline === tl ? "border-gold bg-gold/15 text-white" : "border-white/10 text-white/60 hover:border-white/30"
                  }`}
                >
                  {tl}
                </button>
              ))}
            </div>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">Metal finish</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {(Object.keys(finishes) as Finish[]).map((f) => (
                <button
                  key={f}
                  onClick={() => cardStore.set({ finish: f })}
                  className={`group rounded-2xl border p-3 text-left transition ${
                    finish === f ? "border-gold/70 bg-white/[0.06] shadow-rim" : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <span className="block h-8 w-8 rounded-full ring-1 ring-white/20" style={{ background: finishes[f].swatch }} />
                  <span className="mt-2 block text-xs text-white/80">{finishes[f].label}</span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">Quantity</p>
            <div className="mt-3 grid grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-navy-900/50 p-1.5">
              {tiers.map((x, i) => (
                <button
                  key={x.qty}
                  onClick={() => setTier(i)}
                  className={`relative rounded-xl py-2.5 text-sm font-semibold transition ${tier === i ? "text-navy-900" : "text-white/60 hover:text-white"}`}
                >
                  {tier === i && (
                    <motion.span layoutId="tier" className="absolute inset-0 rounded-xl bg-gold-metal" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{x.qty}×</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
              <div>
                <p className="text-xs text-white/50">
                  €{t.price} / card · free design proof
                </p>
                <p className="mt-1 font-serif text-4xl font-semibold text-white">€{(t.qty * t.price).toLocaleString("en-US")}</p>
              </div>
              <button onClick={addToOrder} className="btn-gold">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={added ? "y" : "n"}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    {added ? "Added ✓" : (
                      <>
                        Reserve batch <Arrow />
                      </>
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
