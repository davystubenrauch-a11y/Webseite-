// Products, prices and shipping for the shop at /shop. Prices in cents.

export type ProductId = "nfc-weiss" | "nfc-schwarz" | "roomtour-basis" | "roomtour-premium" | "roomtour-exklusiv" | "web-basis" | "web-business" | "web-premium";

export type Product = {
  id: ProductId;
  name: string;
  short: string;
  price: number;
  physical: boolean;
  max: number;
};

export const products: Product[] = [
  { id: "nfc-weiss", name: "NFC-Platte Weiß", short: "Ø 10 cm, Acryl, mit Ihrem Google-Profil verknüpft", price: 1500, physical: true, max: 50 },
  { id: "nfc-schwarz", name: "NFC-Platte Schwarz", short: "Ø 10 cm, Acryl, mit Ihrem Google-Profil verknüpft", price: 1500, physical: true, max: 50 },
  { id: "roomtour-basis", name: "KI-Roomtour Basis", short: "Bis 150 m² oder eine Etage, bis 8 Räume, Video 60 bis 90 Sekunden quer und hochkant, fertig in 48 Stunden", price: 30000, physical: false, max: 5 },
  { id: "web-basis", name: "Website Basis", short: "3 Seiten mit Ihren Texten, Kontaktformular, Anruf- und WhatsApp-Knopf, Hosting inklusive, online in 5 Tagen nach Zahlung und Ihren Angaben", price: 30000, physical: false, max: 1 },
  { id: "web-business", name: "Website Business", short: "Bis 6 Seiten, alle Texte von uns, Terminbuchung oder Anfrageformular, Google-Bewertungen live, Hosting inklusive, online in 7 Tagen", price: 69000, physical: false, max: 1 },
  { id: "web-premium", name: "Website Premium", short: "Bis 10 Seiten auf Deutsch und Englisch, Scroll- und 3D-Animationen, inkl. 5 NFC-Platten für Google-Bewertungen, Hosting inklusive, online in 7 Tagen", price: 129000, physical: false, max: 1 },
  { id: "roomtour-premium", name: "KI-Roomtour Premium", short: "Bis 300 m² oder mehrere Etagen, bis 15 Räume inkl. Außenbereich, Logo und Ihre Farben, 3 Kurzclips für Social Media, fertig in 72 Stunden", price: 60000, physical: false, max: 5 },
  { id: "roomtour-exklusiv", name: "KI-Roomtour Exklusiv", short: "Bis 600 m², bis 30 Räume, Hauptfilm bis 3 Minuten in 4K, Kurzfassung 30 Sekunden, 6 Kurzclips, Deutsch und Englisch, fertig in 5 Werktagen", price: 140000, physical: false, max: 3 },
];

/** Services start right after payment; consumers must agree to that before ordering (§ 356 Abs. 4 BGB). */
export const isService = (id: ProductId) => !products.find((p) => p.id === id)?.physical;

export const shipping = { price: 299, freeFrom: 5, label: "Versand innerhalb Deutschlands" };

// FOAV GbR is a small business (Kleinunternehmer): no VAT is charged. Also printed on every Stripe invoice.
export const vatNote = "Alle Preise sind Endpreise. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.";

export type Cart = Partial<Record<ProductId, number>>;

/** Volume discount on NFC plates, counted over all colours: from 5 plates 10 %, from 10 plates 15 %. */
export const plateTiers = [
  { from: 10, off: 15 },
  { from: 5, off: 10 },
];
export const plateDiscount = (plates: number) => plateTiers.find((t) => plates >= t.from)?.off ?? 0;
export const plateUnit = (plates: number) => Math.round(1500 * (100 - plateDiscount(plates)) / 100);

export function totals(cart: Cart) {
  const raw = products.filter((p) => (cart[p.id] ?? 0) > 0).map((p) => ({ ...p, list: p.price, qty: Math.min(cart[p.id]!, p.max) }));
  const plates = raw.filter((l) => l.physical).reduce((n, l) => n + l.qty, 0);
  const off = plateDiscount(plates);
  // Discounted unit price on the plate lines, so Stripe and the invoice show the real price per plate.
  const lines = raw.map((l) => (l.physical && off ? { ...l, price: plateUnit(plates), name: `${l.name} (${off} % Mengenrabatt)` } : l));
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
  const saved = lines.reduce((n, l) => n + l.qty * (l.list - l.price), 0);
  const ship = plates > 0 && plates < shipping.freeFrom ? shipping.price : 0;
  return { lines, plates, off, saved, subtotal, ship, total: subtotal + ship };
}

export const euro = (cents: number) => (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
