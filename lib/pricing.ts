// Catalogue and price list used by the configurator and the inquiry wizard.
// NOTE: All prices are placeholder guide values. Replace them with your real prices before going live.

export type Theme = "classic" | "navy" | "carbon";
export type Lang = "de" | "en";
export type ServiceId = "nfc" | "web" | "roomtour";

/** Our single NFC product: the round acrylic review disc. */
export const nfcProduct = { label: "NFC Review Disc", detail: "Ø 10 cm Acryl-Platte · selbstklebend", price: 29 };

export const themes: Record<Theme, { label: string; swatch: string }> = {
  classic: { label: "Classic White", swatch: "linear-gradient(135deg,#ffffff,#e8edf3)" },
  navy: { label: "Navy & Gold", swatch: "linear-gradient(135deg,#0f172a,#1e293b 60%,#c5a059)" },
  carbon: { label: "Carbon Black", swatch: "linear-gradient(135deg,#050506,#232428)" },
};

/** Volume discount tiers for NFC products. */
export function nfcDiscount(qty: number) {
  if (qty >= 50) return 0.25;
  if (qty >= 20) return 0.15;
  if (qty >= 10) return 0.1;
  return 0;
}

export function nfcTotal(qty: number) {
  const unit = nfcProduct.price * (1 - nfcDiscount(qty));
  return { unit, total: unit * qty };
}

export type Tier = { id: string; label: string; price: number; features: string[] };

export const webTiers: Tier[] = [
  { id: "launch", label: "Launch", price: 1490, features: ["One-Pager / Landingpage", "Mobile-first Design", "Kontaktformular & SEO-Basis"] },
  { id: "business", label: "Business", price: 2990, features: ["Bis zu 8 Unterseiten", "CMS zur Selbstpflege", "Conversion-Tracking & SEO"] },
  { id: "signature", label: "Signature", price: 5990, features: ["Individuelles 3D/Motion-Design", "Shop oder Buchungssystem", "Performance-Garantie 95+"] },
];

export const tourTiers: Tier[] = [
  { id: "essential", label: "Essential", price: 390, features: ["Bis 100 m²", "360°-Rundgang in 8K", "Einbettung auf Ihrer Website"] },
  { id: "pro", label: "Pro", price: 790, features: ["Bis 300 m²", "KI-Walkthrough-Video in 4K", "Grundriss & Hotspots"] },
  { id: "estate", label: "Estate", price: 1490, features: ["Unbegrenzte Fläche", "KI-Home-Staging", "Drohnen-Außenansicht"] },
];

export const addOns: { id: string; label: string; price: number; suffix?: string; for: ServiceId }[] = [
  { id: "hosting", label: "Hosting & Wartung", price: 49, suffix: "/ Monat", for: "web" },
  { id: "copy", label: "Texte & Fotografie", price: 690, for: "web" },
  { id: "staging", label: "KI-Home-Staging (pro Raum)", price: 59, for: "roomtour" },
  { id: "express", label: "Express-Lieferung 48 h", price: 190, for: "roomtour" },
];

export const euro = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
