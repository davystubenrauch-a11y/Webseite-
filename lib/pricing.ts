// Catalogue and price list used by the configurator and the inquiry wizard.
// NOTE: All prices are placeholder guide values. Replace them with your real prices before going live.

export type Theme = "white" | "black";
export type Lang = "de" | "en";
export type ServiceId = "nfc" | "web" | "roomtour";

/** Our single NFC product: the round acrylic review disc. */
export const nfcProduct = { label: "NFC Review Disc", detail: "Ø 10 cm Acryl-Platte · selbstklebend", price: 29 };

export const themes: Record<Theme, { label: string; swatch: string }> = {
  white: { label: "Weiß", swatch: "linear-gradient(135deg,#ffffff,#e8edf3)" },
  black: { label: "Schwarz", swatch: "linear-gradient(135deg,#050506,#232428)" },
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
  { id: "basis", label: "Basis", price: 300, features: ["One-Pager mit Ihren Inhalten", "Für Handy & Desktop optimiert", "Kontaktformular, Impressum & Datenschutz"] },
  { id: "business", label: "Business", price: 690, features: ["Bis zu 5 Unterseiten", "Google-Maps & Bewertungen eingebunden", "Grundlegende SEO-Einrichtung"] },
  { id: "premium", label: "Premium", price: 1290, features: ["Bis zu 10 Unterseiten", "Individuelles Design & Animationen", "Inhalte selbst bearbeitbar"] },
];

export const tourTiers: Tier[] = [
  { id: "basis", label: "Basis", price: 300, features: ["Bis 80 m²", "360°-Rundgang", "Link & Einbettung für Website und Portale"] },
  { id: "plus", label: "Plus", price: 490, features: ["Bis 200 m²", "Walkthrough-Video", "Grundriss & Info-Punkte"] },
  { id: "premium", label: "Premium", price: 790, features: ["Ab 200 m² / Gewerbe & Hotel", "KI-Home-Staging", "Video für Social Media"] },
];

export const addOns: { id: string; label: string; price: number; suffix?: string; for: ServiceId }[] = [
  { id: "hosting", label: "Hosting & Wartung", price: 19, suffix: "/ Monat", for: "web" },
  { id: "copy", label: "Texte schreiben lassen", price: 150, for: "web" },
  { id: "staging", label: "KI-Home-Staging (pro Raum)", price: 29, for: "roomtour" },
  { id: "express", label: "Express-Lieferung 48 h", price: 79, for: "roomtour" },
];

export const euro = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
