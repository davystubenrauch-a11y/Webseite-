// Products, prices and shipping for the shop at /shop. Prices in cents.

export type ProductId = "nfc-weiss" | "nfc-schwarz" | "roomtour-basis" | "roomtour-premium";

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
  { id: "roomtour-basis", name: "KI-Roomtour Basis", short: "Bis 150 m² oder ein Stockwerk, bis 8 Räume, quer und hochkant, fertig in 48 Stunden nach Ihren Fotos", price: 30000, physical: false, max: 5 },
  { id: "roomtour-premium", name: "KI-Roomtour Premium", short: "Bis 300 m² oder mehrere Etagen, bis 15 Räume, mit Logo-Abspann und Social-Clip, fertig in 72 Stunden", price: 49000, physical: false, max: 5 },
];

export const shipping = { price: 299, freeFrom: 5, label: "Versand innerhalb Deutschlands" };

// TODO: set once it is clear how VAT is handled (small business § 19 UStG or regular VAT).
// Add "inkl. 19 % MwSt." or "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet." once the tax status is confirmed.
export const vatNote = "Alle Preise sind Endpreise.";

export type Cart = Partial<Record<ProductId, number>>;

export function totals(cart: Cart) {
  const lines = products.filter((p) => (cart[p.id] ?? 0) > 0).map((p) => ({ ...p, qty: Math.min(cart[p.id]!, p.max) }));
  const plates = lines.filter((l) => l.physical).reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
  const ship = plates > 0 && plates < shipping.freeFrom ? shipping.price : 0;
  return { lines, plates, subtotal, ship, total: subtotal + ship };
}

export const euro = (cents: number) => (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
