"use client";

import { useState } from "react";
import { PRICE_PER_CAN, euro, listPrice, products, trayPrice, useCart, type ProductId } from "@/lib/cart";

/** Shop: pick a 12 or 24 tray, set the quantity, add to cart. */
export default function Shop() {
  const { add, setOpen } = useCart();
  const [pick, setPick] = useState<ProductId>("tray-24");
  const [qty, setQty] = useState(1);
  const product = products.find((p) => p.id === pick)!;

  return (
    <section id="shop" className="relative z-10 overflow-hidden bg-paper py-24 sm:py-32">
      <div className="wrap grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Three cans as the tray picture. */}
        <div data-reveal className="relative mx-auto grid aspect-square w-full max-w-[560px] place-items-center rounded-[2.5rem] bg-mist">
          <div className="absolute inset-[12%] rounded-full bg-fresh/40" />
          <div className="absolute inset-x-0 bottom-[12%] top-[16%] flex items-end justify-center">
            <img src="/can/spiruli.webp" alt="" className="relative -mr-[12%] h-[88%] -rotate-[8deg] drop-shadow-[0_30px_30px_rgba(13,38,33,0.3)]" />
            <img src="/can/spiruli.webp" alt="SPIRULI Dose" className="relative z-10 h-full drop-shadow-[0_40px_40px_rgba(13,38,33,0.35)]" />
            <img src="/can/spiruli.webp" alt="" className="relative -ml-[12%] h-[88%] rotate-[8deg] drop-shadow-[0_30px_30px_rgba(13,38,33,0.3)]" />
          </div>
          <p className="absolute right-6 top-6 grid h-28 w-28 place-items-center rounded-full bg-ink text-center text-mist sm:h-32 sm:w-32">
            <span>
              <span className="block font-display text-3xl font-extrabold">{euro(PRICE_PER_CAN)}</span>
              <span className="text-xs">pro Dose</span>
            </span>
          </p>
        </div>

        <div>
          <p data-reveal className="label text-teal">
            Shop
          </p>
          <h2 data-reveal className="headline mt-4 text-5xl sm:text-7xl">
            Im Tray. <span className="text-teal">Direkt zu dir.</span>
          </h2>
          <p data-reveal className="mt-5 text-lg text-ink/70">
            SPIRULI Holunder-Zitrus-Alge · 200 ml Dose · vegan · Made in Germany
          </p>

          <fieldset data-reveal className="mt-8 grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">Größe wählen</legend>
            {products.map((p) => (
              <label
                key={p.id}
                className={`relative cursor-pointer rounded-3xl border-2 p-6 transition-colors ${pick === p.id ? "border-ink bg-white" : "border-line bg-mist hover:border-ink/40"}`}
              >
                <input type="radio" name="tray" value={p.id} checked={pick === p.id} onChange={() => setPick(p.id)} className="sr-only" />
                {p.discount > 0 && <span className="label absolute right-4 top-4 rounded-full bg-fresh px-2.5 py-1 text-ink">−{p.discount * 100} %</span>}
                <span className="block font-display text-2xl font-extrabold">{p.name}</span>
                <span className="mt-1 block text-sm text-ink/60">
                  {p.cans} Dosen · {p.discount > 0 ? `nur ${euro(trayPrice(p) / p.cans)} je Dose` : p.note}
                </span>
                <span className="mt-5 flex items-baseline gap-3">
                  <span className="font-display text-4xl font-extrabold">{euro(trayPrice(p))}</span>
                  {p.discount > 0 && <span className="text-ink/45 line-through">{euro(listPrice(p))}</span>}
                </span>
                <span className="mt-1 block text-xs text-ink/50">{euro(Math.round(Math.round(trayPrice(p) * 1000) / (p.cans * 2)) / 100)} / l</span>
              </label>
            ))}
          </fieldset>

          <div data-reveal className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-line bg-white">
              <button type="button" aria-label="Weniger" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-xl">
                −
              </button>
              <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button type="button" aria-label="Mehr" onClick={() => setQty((q) => Math.min(20, q + 1))} className="grid h-12 w-12 place-items-center text-xl">
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                add(pick, qty);
                setOpen(true);
              }}
              className="btn flex-1 bg-ink py-4 text-base text-mist hover:bg-teal"
            >
              In den Warenkorb · {euro(trayPrice(product) * qty)}
            </button>
          </div>

          <p className="mt-5 text-sm text-ink/55">
            {euro(PRICE_PER_CAN)} je Dose, im 24er Tray 10 % günstiger. Preise inkl. MwSt., zzgl. Versand.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 border-t border-line pt-6 text-sm sm:grid-cols-3">
            {["Vegan & glutenfrei", "Analysiert von SGS Fresenius", "Auch in der Apotheke"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
