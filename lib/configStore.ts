"use client";

import { useSyncExternalStore } from "react";
import type { Lang, ServiceId, Shape, Theme } from "./pricing";

/**
 * Tiny global store shared by the 3D product, the configurator and the inquiry
 * wizard: whatever the visitor builds in the configurator is carried into the inquiry.
 */
export type ConfigState = {
  shape: Shape;
  theme: Theme;
  lang: Lang;
  business: string;
  qty: number;
  /** Exploded view that reveals the embedded NFC chip. */
  exploded: boolean;
  webTier: string | null;
  tourTier: string | null;
  addOns: string[];
  /** Service preselected in the inquiry wizard. */
  inquiryServices: ServiceId[];
};

const DEFAULT_STATE: ConfigState = {
  shape: "disc",
  theme: "classic",
  lang: "en",
  business: "",
  qty: 10,
  exploded: false,
  webTier: null,
  tourTier: null,
  addOns: [],
  inquiryServices: [],
};

let state = DEFAULT_STATE;
const listeners = new Set<() => void>();

export const configStore = {
  get: () => state,
  set(patch: Partial<ConfigState>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useConfig<T>(selector: (s: ConfigState) => T): T {
  return useSyncExternalStore(
    configStore.subscribe,
    () => selector(state),
    () => selector(DEFAULT_STATE),
  );
}
