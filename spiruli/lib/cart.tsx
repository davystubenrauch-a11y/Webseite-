"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** Price per can; the 24 tray is 10 % off. No deposit is charged. */
export const PRICE_PER_CAN = 2.95;

export const products = [
  { id: "tray-12", name: "12er Tray", cans: 12, discount: 0, note: "Zum Kennenlernen" },
  { id: "tray-24", name: "24er Tray", cans: 24, discount: 0.1, note: "Für den Vorrat" },
] as const;
export type Product = (typeof products)[number];
export type ProductId = (typeof products)[number]["id"];

export const euro = (v: number) => v.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
const cents = (v: number) => Math.round(v * 100) / 100;
/** Price of one tray before and after its discount. */
export const listPrice = (p: Product) => cents(p.cans * PRICE_PER_CAN);
export const trayPrice = (p: Product) => cents(p.cans * PRICE_PER_CAN * (1 - p.discount));

type Cart = {
  items: Partial<Record<ProductId, number>>;
  add: (id: ProductId, qty: number) => void;
  set: (id: ProductId, qty: number) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  cans: number;
  subtotal: number;
};

const Ctx = createContext<Cart | null>(null);
const KEY = "spiruli-cart";

/** Cart kept in this browser only (localStorage); orders go out by e-mail until a payment provider is connected. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Cart["items"]>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // Storage blocked: start with an empty cart.
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // Storage blocked: the cart still works for this visit.
    }
  }, [items]);

  const value = useMemo<Cart>(() => {
    const cans = products.reduce((n, p) => n + (items[p.id] ?? 0) * p.cans, 0);
    return {
      items,
      open,
      setOpen,
      cans,
      subtotal: cents(products.reduce((sum, p) => sum + (items[p.id] ?? 0) * trayPrice(p), 0)),
      add: (id, qty) => setItems((it) => ({ ...it, [id]: Math.min(20, (it[id] ?? 0) + qty) })),
      set: (id, qty) => setItems((it) => ({ ...it, [id]: Math.max(0, Math.min(20, qty)) })),
    };
  }, [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
