import type { ServiceId } from "./pricing";

// Per-service accent colours (full class strings so Tailwind picks them up).
export const accents: Record<ServiceId, { chip: string; kicker: string; check: string; panel: string }> = {
  nfc: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-600",
    kicker: "text-emerald-700",
    check: "text-emerald-600",
    panel: "bg-gradient-to-br from-emerald-50 via-white to-sky-50",
  },
  web: {
    chip: "border-blue-200 bg-blue-50 text-blue-600",
    kicker: "text-blue-700",
    check: "text-blue-600",
    panel: "bg-gradient-to-br from-blue-50 via-white to-indigo-50",
  },
  roomtour: {
    chip: "border-amber-200 bg-amber-50 text-amber-600",
    kicker: "text-amber-700",
    check: "text-amber-600",
    panel: "bg-slate-900",
  },
};

/** Icon chips for the three values in the About section. */
export const pillarChips = [
  "border-blue-200 bg-blue-50 text-blue-600",
  "border-emerald-200 bg-emerald-50 text-emerald-600",
  "border-amber-200 bg-amber-50 text-amber-600",
];
