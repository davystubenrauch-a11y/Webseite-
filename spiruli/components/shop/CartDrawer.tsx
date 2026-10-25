"use client";

import { useEffect } from "react";
import { euro, products, trayPrice, useCart } from "@/lib/cart";
import { site } from "@/lib/site";

/** Slide-in cart. Until a payment provider is connected, the order is sent as an e-mail. */
export default function CartDrawer() {
  const { items, set, open, setOpen, cans, subtotal } = useCart();
  const lines = products.filter((p) => (items[p.id] ?? 0) > 0);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [setOpen]);

  const order = [
    "Hallo SPIRULI-Team,",
    "",
    "ich möchte bestellen:",
    ...lines.map((p) => `- ${items[p.id]} × ${p.name} (${p.cans} Dosen) = ${euro(trayPrice(p) * (items[p.id] ?? 0))}`),
    "",
    `Summe: ${euro(subtotal)} · zzgl. Versand`,
    "",
    "Name:",
    "Lieferadresse:",
  ].join("\n");

  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-ink/40 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-label="Warenkorb"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line p-6">
          <p className="font-display text-2xl font-extrabold">Warenkorb</p>
          <button type="button" onClick={() => setOpen(false)} className="text-sm font-medium underline underline-offset-4">
            Schließen
          </button>
        </div>

        <div data-lenis-prevent className="flex-1 overflow-y-auto p-6">
          {lines.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="text-ink/60">Noch leer.</p>
                <a href="#shop" onClick={() => setOpen(false)} className="btn mt-4 bg-ink text-mist hover:bg-teal">
                  Zum Shop
                </a>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((p) => (
                <li key={p.id} className="flex gap-4 rounded-2xl bg-mist p-4">
                  <img src="/can/spiruli.webp" alt="" className="h-20" />
                  <div className="flex-1">
                    <p className="font-semibold">SPIRULI · {p.name}</p>
                    <p className="text-sm text-ink/60">
                      {p.cans} Dosen à 200 ml{p.discount > 0 ? ` · −${p.discount * 100} %` : ""}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-line bg-white text-sm">
                        <button type="button" aria-label="Weniger" onClick={() => set(p.id, (items[p.id] ?? 0) - 1)} className="h-9 w-9">
                          −
                        </button>
                        <span className="w-6 text-center tabular-nums">{items[p.id]}</span>
                        <button type="button" aria-label="Mehr" onClick={() => set(p.id, (items[p.id] ?? 0) + 1)} className="h-9 w-9">
                          +
                        </button>
                      </div>
                      <p className="font-semibold tabular-nums">{euro(trayPrice(p) * (items[p.id] ?? 0))}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-line p-6">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Waren ({cans} Dosen)</dt>
                <dd className="tabular-nums">{euro(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink/60">
                <dt>Versand</dt>
                <dd>wird mitgeteilt</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                <dt>Summe</dt>
                <dd className="tabular-nums">{euro(subtotal)}</dd>
              </div>
            </dl>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("Bestellung SPIRULI")}&body=${encodeURIComponent(order)}`}
              className="btn mt-5 w-full bg-ink py-4 text-base text-mist hover:bg-teal"
            >
              Bestellung abschicken
            </a>
            <p className="mt-3 text-center text-xs text-ink/50">Preise inkl. MwSt. Die Bestellung wird per E-Mail gesendet; du erhältst eine Bestätigung mit Zahlungsinfos.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
