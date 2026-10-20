"use client";

import { useSyncExternalStore } from "react";

export type CanState = {
  /** Cold-from-the-fridge condensation on the lacquer. */
  chilled: boolean;
  /** Idle 360° turntable spin. */
  autoSpin: boolean;
  /** Snap request: show the front (0) or the back (π). Bumped to retrigger. */
  face: { side: "front" | "back"; n: number };
};

let state: CanState = { chilled: false, autoSpin: true, face: { side: "front", n: 0 } };
const listeners = new Set<() => void>();

export const canStore = {
  get: () => state,
  set(patch: Partial<CanState>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  showFace(side: "front" | "back") {
    canStore.set({ face: { side, n: state.face.n + 1 } });
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useCan<T>(selector: (s: CanState) => T): T {
  return useSyncExternalStore(
    canStore.subscribe,
    () => selector(state),
    () => selector(state),
  );
}
