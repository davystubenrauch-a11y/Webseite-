// Shared inquiry schema + validation, used by the wizard (client) and the API route (server).

/** Services a visitor can ask about on foav.de ("roomtour" only for older forms still open in a browser). */
export type ServiceId = "nfc" | "web" | "shots" | "roomtour";

export type Inquiry = {
  services: ServiceId[];
  nfc: { theme: string; qty: number; business: string };
  web: { tier: string; url: string };
  shots?: { tier: string };
  roomtour?: { tier: string; property: string; area: string };
  addOns: string[];
  budget: string;
  timeline: string;
  message: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  contactPref: "email" | "phone";
  consent: boolean;
  /** Honeypot: must stay empty. */
  website: string;
};

export type Errors = Partial<Record<string, string>>;

export const serviceLabels: Record<ServiceId, string> = {
  nfc: "NFC-Platten",
  web: "Website",
  shots: "KI-Shots (Fotos und Werbeclips)",
  roomtour: "Roomtour",
};

export const propertyTypes = ["Immobilie / Wohnung", "Hotel", "Ferienwohnung", "Gewerbe / Büro", "Gastronomie", "Sonstiges"];
export const budgets = ["bis 500 €", "500 – 1.000 €", "1.000 – 2.500 €", "über 2.500 €", "Noch offen"];
export const timelines = ["So schnell wie möglich", "In 1–3 Monaten", "In 3–6 Monaten", "Flexibel"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()0-9\s/-]{6,24}$/;

/** Validates one wizard step (or everything when step is undefined). */
export function validate(d: Inquiry, step?: number): Errors {
  const e: Errors = {};
  const all = step === undefined;

  if (all || step === 0) {
    if (!d.services.length) e.services = "Bitte wählen Sie mindestens eine Leistung.";
  }
  if (all || step === 1) {
    // the short contact form on foav.de has no quantity field: only check a quantity that was actually sent
    if (d.services.includes("nfc") && d.nfc?.qty && (!Number.isFinite(d.nfc.qty) || d.nfc.qty < 1 || d.nfc.qty > 10000))
      e["nfc.qty"] = "Bitte geben Sie eine Stückzahl zwischen 1 und 10.000 an.";
    if (d.services.includes("web") && !d.web.tier) e["web.tier"] = "Bitte wählen Sie ein Website-Paket.";
    if (d.services.includes("web") && d.web.url && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(d.web.url.trim()))
      e["web.url"] = "Bitte geben Sie eine gültige Adresse ein (z. B. www.beispiel.de).";
    if (d.message.length > 2000) e.message = "Maximal 2.000 Zeichen.";
  }
  if (all || step === 2) {
    if (d.name.trim().length < 2) e.name = "Bitte geben Sie Ihren Namen an.";
    // One way to reach the customer is enough: e-mail or phone.
    if (!d.email.trim() && !d.phone.trim()) e.email = "Bitte geben Sie eine Telefonnummer oder E-Mail an.";
    else if (d.email.trim() && !EMAIL.test(d.email.trim())) e.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (d.phone.trim() && !PHONE.test(d.phone.trim())) e.phone = "Bitte geben Sie eine gültige Telefonnummer an.";
    if (d.contactPref === "phone" && !d.phone.trim()) e.phone = "Für einen Rückruf benötigen wir Ihre Telefonnummer.";
    if (!d.consent) e.consent = "Bitte stimmen Sie der Datenverarbeitung zu.";
  }
  return e;
}

/** Plain-text summary used for the e-mail body (API and mailto fallback). */
export function summarize(d: Inquiry) {
  const lines = [
    `Neue Anfrage über die Website`,
    ``,
    `Leistungen: ${d.services.map((s) => serviceLabels[s]).join(", ")}`,
  ];
  if (d.services.includes("nfc"))
    lines.push(`NFC: ${d.nfc?.qty || "Menge offen"} × Platte (Ø 10 cm) · ${d.nfc?.theme || "Farbe offen"}${d.nfc?.business ? ` · Betrieb "${d.nfc!.business}"` : ""}`);
  if (d.services.includes("web")) lines.push(`Website: Paket ${d.web.tier}${d.web.url ? ` · bestehende Seite ${d.web.url}` : ""}`);
  if (d.services.includes("shots")) lines.push(`KI-Shots: ${d.shots?.tier || "Paket offen"}`);
  if (d.services.includes("roomtour") && d.roomtour) lines.push(`Roomtour: ${d.roomtour.tier || "Paket offen"} · ${d.roomtour.property}${d.roomtour.area ? ` · ${d.roomtour.area} m²` : ""}`);
  if (d.addOns.length) lines.push(`Extras: ${d.addOns.join(", ")}`);
  lines.push(
    `Budget: ${d.budget || "–"} · Zeitrahmen: ${d.timeline || "–"}`,
    ``,
    `Name: ${d.name}`,
    `Firma: ${d.company || "–"}`,
    `E-Mail: ${d.email}`,
    `Telefon: ${d.phone || "–"}`,
    `Bevorzugter Kontakt: ${d.contactPref === "phone" ? "Telefon" : "E-Mail"}`,
    ``,
    `Nachricht:`,
    d.message || "–",
  );
  return lines.join("\n");
}
