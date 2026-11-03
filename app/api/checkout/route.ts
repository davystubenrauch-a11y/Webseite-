import { NextResponse } from "next/server";
import { euro, isService, products, shipping, totals, vatNote, type Cart } from "@/lib/shop";
import { stripe } from "@/lib/stripe";
import { deliver } from "@/lib/deliver";

// Creates a Stripe Checkout session for the shop (STRIPE_SECRET_KEY) with a post-purchase invoice.
// Fulfilment runs in /api/stripe/webhook, not on the thank-you page. Without a key the order is
// delivered like an inquiry (lib/deliver.ts) and we send a payment link.

type Order = { cart: Cart; ref?: string; name: string; email: string; phone?: string; company?: string; business?: string; address?: string; consent: boolean; early?: boolean; website?: string };

export async function POST(req: Request) {
  let o: Order;
  try {
    o = (await req.json()) as Order;
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Bestellung." }, { status: 400 });
  }
  if (o.website) return NextResponse.json({ ok: true });
  const cart: Cart = {};
  for (const p of products) {
    const q = Math.floor(Number(o.cart?.[p.id] ?? 0));
    if (q > 0) cart[p.id] = Math.min(q, p.max);
  }
  const t = totals(cart);
  const errors: Record<string, string> = {};
  if (!t.lines.length) errors.cart = "Ihr Warenkorb ist leer.";
  if (!o.name?.trim()) errors.name = "Bitte geben Sie Ihren Namen an.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(o.email?.trim() ?? "")) errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
  if (!stripe() && !o.address?.trim()) errors.address = t.plates ? "Bitte geben Sie die Rechnungs- und Lieferadresse an." : "Bitte geben Sie die Rechnungsadresse an.";
  if (t.plates && !o.business?.trim()) errors.business = "Bitte nennen Sie Ihren Betrieb, wie er bei Google heißt.";
  if (!o.consent) errors.consent = "Bitte bestätigen Sie AGB und Widerrufsbelehrung.";
  if (t.lines.some((l) => isService(l.id)) && !o.early) errors.early = "Bitte bestätigen Sie, dass wir sofort beginnen dürfen. Sonst können wir erst nach Ablauf der Widerrufsfrist starten.";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const id = `FOAV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const origin = new URL(req.url).origin;
  const tag = Array.from({ length: 8 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join("");

  const s = stripe();
  if (s) {
    const plates = t.plates > 0;
    const meta = { order: id, ref: String(o.ref ?? "").slice(0, 70), name: o.name, company: o.company ?? "", phone: o.phone ?? "", business: o.business ?? "", note_address: o.address ?? "", early_start: o.early ? "ja" : "nein" };
    for (const k of Object.keys(meta) as (keyof typeof meta)[]) meta[k] = meta[k].slice(0, 480);
    const line = (name: string, cents: number, qty: number) => ({ quantity: qty, price_data: { currency: "eur", unit_amount: cents, product_data: { name } } });
    try {
      const session = await s.checkout.sessions.create(
        {
          mode: "payment",
          locale: "de",
          success_url: `${origin}/shop/danke?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/shop`,
          customer_email: o.email.trim(),
          customer_creation: "always",
          client_reference_id: id,
          integration_identifier: `foav-shop-${tag}`,
          line_items: [...t.lines.map((l) => line(l.name, l.price, l.qty)), ...(t.ship ? [line(shipping.label, t.ship, 1)] : [])],
          // Invoicing: Stripe issues the invoice (PDF, numbered) after payment and e-mails it.
          billing_address_collection: "required",
          tax_id_collection: { enabled: true },
          ...(plates ? { shipping_address_collection: { allowed_countries: ["DE", "AT", "CH"] } } : {}),
          phone_number_collection: { enabled: !o.phone },
          invoice_creation: {
            enabled: true,
            invoice_data: {
              description: o.ref ? `Bestellung ${id}, Fragebogen ${o.ref}` : `Bestellung ${id}`,
              footer: process.env.INVOICE_FOOTER || vatNote,
              metadata: { order: id },
            },
          },
          payment_intent_data: { description: `foav.de ${id}`, metadata: { order: id } },
          metadata: meta,
        },
        { idempotencyKey: `checkout-${id}-${tag}` },
      );
      if (session.url) return NextResponse.json({ ok: true, url: session.url, id });
    } catch (err) {
      console.error("[checkout] stripe failed", err instanceof Error ? err.message : err);
    }
    return NextResponse.json({ ok: false, error: "Die Zahlung konnte gerade nicht gestartet werden. Bitte versuchen Sie es in einer Minute noch einmal oder rufen Sie uns an.", id }, { status: 502 });
  }

  const text = [
    `Bestellung ${id}`,
    "",
    ...t.lines.map((l) => `${l.qty} × ${l.name} à ${euro(l.price)} = ${euro(l.qty * l.price)}`),
    `Versand: ${euro(t.ship)}`,
    `Summe: ${euro(t.total)}`,
    "",
    `Name: ${o.name}`,
    `E-Mail: ${o.email}`,
    o.phone ? `Telefon: ${o.phone}` : "",
    o.ref ? `Fragebogen: ${o.ref}` : "",
    o.company ? `Firma: ${o.company}` : "",
    o.business ? `Betrieb bei Google: ${o.business}` : "",
    o.address ? `Adresse: ${o.address}` : "",
    o.early ? "Sofortiger Beginn verlangt, Hinweis zum Erlöschen des Widerrufsrechts bestätigt." : "",
  ].filter(Boolean).join("\n");
  if (await deliver({ id, kind: "bestellung", subject: `Bestellung ${id}: ${euro(t.total)}`, text, replyTo: o.email, data: { ...o, website: undefined } })) return NextResponse.json({ ok: true, id, manual: true });
  return NextResponse.json({ ok: false, error: "Die Bestellung konnte gerade nicht übermittelt werden. Bitte versuchen Sie es in einer Minute noch einmal oder rufen Sie uns an.", id }, { status: 503 });
}
