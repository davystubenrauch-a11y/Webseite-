"use client";

import { canStore, useCan } from "@/lib/canStore";

/** Toggles that drive the 3D can: spin, face, condensation. */
export default function CanControls() {
  const autoSpin = useCan((s) => s.autoSpin);
  const chilled = useCan((s) => s.chilled);
  const side = useCan((s) => s.face.side);

  const btn = (active: boolean) =>
    `rounded-full px-3.5 py-2 text-sm font-bold transition-colors ${active ? "bg-ink text-lime" : "text-ink hover:bg-lime"}`;

  return (
    <div className="flex items-center gap-1 rounded-full border-2 border-ink bg-cream p-1 shadow-[3px_3px_0_0_#12343F]" role="toolbar" aria-label="Dose steuern">
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
        Eiskalt ❄
      </button>
    </div>
  );
}
