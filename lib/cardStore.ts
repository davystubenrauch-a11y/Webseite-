"use client";

import { useSyncExternalStore } from "react";

export type Finish = "gold" | "champagne" | "platinum";

export type CardState = {
  name: string;
  tagline: string;
  finish: Finish;
  flipped: boolean;
  /** Batch reserved in the customizer, carried into the booking form. */
  order: { qty: number; total: number } | null;
};

const DEFAULT_STATE: CardState = {
  name: "Your Business",
  tagline: "Review us on Google",
  finish: "gold",
  flipped: false,
  order: null,
};

let state = DEFAULT_STATE;
const listeners = new Set<() => void>();

export const cardStore = {
  get: () => state,
  set(patch: Partial<CardState>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useCard<T>(selector: (s: CardState) => T): T {
  return useSyncExternalStore(
    cardStore.subscribe,
    () => selector(state),
    () => selector(DEFAULT_STATE),
  );
}

export const finishes: Record<
  Finish,
  { label: string; rim: string; stops: string[]; swatch: string }
> = {
  gold: {
    label: "Polished Gold",
    rim: "#D4AF37",
    stops: ["#8A6A2E", "#D4AF37", "#F6E7B0", "#C5A059", "#9C7A35"],
    swatch: "linear-gradient(135deg,#8A6A2E,#D4AF37,#F6E7B0,#C5A059)",
  },
  champagne: {
    label: "Champagne",
    rim: "#E2C79A",
    stops: ["#9E8360", "#E2C79A", "#FBF0DA", "#D9BC8C", "#A88C66"],
    swatch: "linear-gradient(135deg,#9E8360,#E2C79A,#FBF0DA,#D9BC8C)",
  },
  platinum: {
    label: "Platinum",
    rim: "#D9DEE6",
    stops: ["#7D8590", "#C9D0DA", "#FFFFFF", "#B9C1CC", "#848C98"],
    swatch: "linear-gradient(135deg,#7D8590,#C9D0DA,#FFFFFF,#B9C1CC)",
  },
};
