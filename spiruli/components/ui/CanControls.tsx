"use client";

import { canStore, useCan } from "@/lib/canStore";

/** Pill of toggles that drive the 3D can: spin, face, condensation. */
export default function CanControls() {
  const autoSpin = useCan((s) => s.autoSpin);
  const chilled = useCan((s) => s.chilled);
  const side = useCan((s) => s.face.side);

  const btn = (active: boolean) =>
    `rounded-full px-3.5 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
      active ? "bg-gold text-petrol-950" : "text-white/60 hover:text-white"
    }`;

  return (
    <div className="glass flex items-center gap-1 rounded-full bg-petrol-900/60 p-1" role="toolbar" aria-label="Dose steuern">
      <button type="button" className={btn(autoSpin)} aria-pressed={autoSpin} onClick={() => canStore.set({ autoSpin: !autoSpin })}>
        360°
      </button>
      <button
        type="button"
        className={btn(false)}
        onClick={() => {
          canStore.set({ autoSpin: false });
          canStore.showFace(side === "front" ? "back" : "front");
        }}
      >
        {side === "front" ? "Rückseite" : "Vorderseite"}
      </button>
      <button type="button" className={btn(chilled)} aria-pressed={chilled} onClick={() => canStore.set({ chilled: !chilled })}>
        Eiskalt
      </button>
      <span className="hidden whitespace-nowrap px-3 font-display text-[10px] uppercase tracking-[0.25em] text-white/35 sm:inline">Ziehen zum Drehen</span>
    </div>
  );
}
