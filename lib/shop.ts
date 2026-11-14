// Products, prices and shipping for the shop at /shop. Prices in cents.

export type ProductId = "nfc-weiss" | "nfc-schwarz" | "nfc-custom" | "shots-starter" | "shots-pro" | "shots-brand" | "web-basis" | "web-business" | "web-premium";

export type Product = {
  id: ProductId;
  name: string;
  short: string;
  price: number;
  physical: boolean;
  max: number;
};

export const products: Product[] = [
  { id: "nfc-weiss", name: "NFC-Platte Weiß", short: "Ø 10 cm, Acryl, mit Ihrem Google-Profil verknüpft", price: 1490, physical: true, max: 50 },
  { id: "nfc-schwarz", name: "NFC-Platte Schwarz", short: "Ø 10 cm, Acryl, mit Ihrem Google-Profil verknüpft", price: 1490, physical: true, max: 50 },
  { id: "nfc-custom", name: "NFC-Platte Custom Brand Edition", short: "Ø 10 cm, schlichtes FOAV-Design mit Ihrem Logo, Design-Vorschau vor der Produktion, mit Ihrem Google-Profil verknüpft", price: 2990, physical: true, max: 50 },
  { id: "shots-starter", name: "KI-Shots Starter", short: "5 Studio-Fotos von 1 Produkt oder Motiv, 1 Werbeclip (5 Sekunden, Hochformat), fertig in 48 Stunden", price: 19900, physical: false, max: 3 },
  { id: "shots-pro", name: "KI-Shots Pro", short: "12 Studio-Fotos von bis zu 3 Produkten, 3 Werbeclips (5 bis 10 Sekunden) in 9:16 und 16:9, Text-Einblendungen, fertig in 72 Stunden", price: 44900, physical: false, max: 3 },
  { id: "shots-brand", name: "KI-Shots Brand-Paket", short: "25 Studio-Fotos von bis zu 6 Produkten, 6 Werbeclips plus 1 Spot (15 Sekunden) mit Musik, Logo und Untertiteln, alle Formate, fertig in 72 Stunden", price: 89900, physical: false, max: 2 },
  { id: "web-basis", name: "Website Basis", short: "3 Seiten mit Ihren Texten, Kontaktformular, Anruf- und WhatsApp-Knopf, Hosting inklusive, online in 5 Tagen nach Zahlung und Ihren Angaben", price: 39900, physical: false, max: 1 },
  { id: "web-business", name: "Website Business", short: "Bis 6 Seiten, alle Texte von uns, Terminbuchung oder Anfrageformular, Google-Bewertungen live, Hosting inklusive, online in 7 Tagen", price: 79900, physical: false, max: 1 },
  { id: "web-premium", name: "Website Premium", short: "Bis 10 Seiten auf Deutsch und Englisch, Scroll- und 3D-Animationen, inkl. 5 NFC-Platten für Google-Bewertungen, Hosting inklusive, online in 7 Tagen", price: 149900, physical: false, max: 1 },
];

/** Services start right after payment; consumers must agree to that before ordering (§ 356 Abs. 4 BGB). */
export const isService = (id: ProductId) => !products.find((p) => p.id === id)?.physical;

export const shipping = { price: 299, freeFrom: 5, label: "Versand innerhalb Deutschlands" };

// FOAV GbR is a small business (Kleinunternehmer): no VAT is charged. Also printed on every Stripe invoice.
export const vatNote = "Alle Preise sind Endpreise. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.";

export type Cart = Partial<Record<ProductId, number>>;

/** Volume prices on NFC plates. Classic: 14,90 € each, from 5 plates 13,90 €, from 10 plates 12,90 € (white and black counted together).
 *  Custom Brand Edition: 29,90 € each, from 5 plates 27,90 €, from 10 plates 24,90 €. Free shipping from 5 plates of any kind. */
export const plateTiers = [
  { from: 10, unit: 1290 },
  { from: 5, unit: 1390 },
];
export const customTiers = [
  { from: 10, unit: 2490 },
  { from: 5, unit: 2790 },
];
export const plateUnit = (plates: number) => plateTiers.find((t) => plates >= t.from)?.unit ?? 1490;
export const customUnit = (plates: number) => customTiers.find((t) => plates >= t.from)?.unit ?? 2990;

export function totals(cart: Cart) {
  const raw = products.filter((p) => (cart[p.id] ?? 0) > 0).map((p) => ({ ...p, list: p.price, qty: Math.min(cart[p.id]!, p.max) }));
  const classic = raw.filter((l) => l.physical && l.id !== "nfc-custom").reduce((n, l) => n + l.qty, 0);
  const custom = raw.find((l) => l.id === "nfc-custom")?.qty ?? 0;
  const plates = classic + custom;
  const unitFor = (l: (typeof raw)[number]) => (l.id === "nfc-custom" ? customUnit(custom) : plateUnit(classic));
  // Volume unit price on the plate lines, so Stripe and the invoice show the real price per plate.
  const lines = raw.map((l) => (l.physical && unitFor(l) < l.list ? { ...l, price: unitFor(l), name: `${l.name} (Mengenpreis ${euro(unitFor(l))})` } : l));
  const off = lines.some((l) => l.physical && l.price < l.list);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
  const saved = lines.reduce((n, l) => n + l.qty * (l.list - l.price), 0);
  const ship = plates > 0 && plates < shipping.freeFrom ? shipping.price : 0;
  return { lines, plates, classic, custom, off, saved, subtotal, ship, total: subtotal + ship };
}

export const euro = (cents: number) => (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
