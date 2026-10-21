"use client";

import { canStore, useCan } from "@/lib/canStore";

/** Toggles that drive the 3D can: spin, face, condensation. */
export default function CanControls() {
  const autoSpin = useCan((s) => s.autoSpin);
  const chilled = useCan((s) => s.chilled);
  const side = useCan((s) => s.face.side);

  const btn = (active: boolean) =>
    `rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${active ? "bg-petrol text-white" : "text-petrol-900/70 hover:text-petrol"}`;

  return (
    <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-card ring-1 ring-sand-300" role="toolbar" aria-label="Dose steuern">
      <button type="button" className={btn(autoSpin)} aria-pressed={autoSpin} onClick={() => canStore.set({ autoSpin: !autoSpin })}>
        360° drehen
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
    </div>
  );
}
