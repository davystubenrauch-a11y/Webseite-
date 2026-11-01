import { NextResponse } from "next/server";
import { euro, products, shipping, totals, type Cart } from "@/lib/shop";

// Creates a Stripe Checkout session for the shop (STRIPE_SECRET_KEY). Without a key the order is
// sent like an inquiry (Resend, then webhook); without those the client opens a pre-filled e-mail.

type Order = { cart: Cart; name: string; email: string; phone?: string; business?: string; address?: string; consent: boolean; website?: string };

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
  if (t.plates && !o.address?.trim()) errors.address = "Bitte geben Sie die Lieferadresse an.";
  if (t.plates && !o.business?.trim()) errors.business = "Bitte nennen Sie Ihren Betrieb, wie er bei Google heißt.";
  if (!o.consent) errors.consent = "Bitte bestätigen Sie AGB und Widerrufsbelehrung.";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const id = `FOAV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const origin = new URL(req.url).origin;

  if (process.env.STRIPE_SECRET_KEY) {
    const f = new URLSearchParams();
    f.set("mode", "payment");
    f.set("success_url", `${origin}/shop/danke?id=${id}`);
    f.set("cancel_url", `${origin}/shop`);
    f.set("customer_email", o.email.trim());
    f.set("locale", "de");
    f.set("client_reference_id", id);
    let n = 0;
    const add = (name: string, cents: number, qty: number) => {
      f.set(`line_items[${n}][price_data][currency]`, "eur");
      f.set(`line_items[${n}][price_data][product_data][name]`, name);
      f.set(`line_items[${n}][price_data][unit_amount]`, String(cents));
      f.set(`line_items[${n}][quantity]`, String(qty));
      n++;
    };
    t.lines.forEach((l) => add(l.name, l.price, l.qty));
    if (t.ship) add(shipping.label, t.ship, 1);
    for (const [k, v] of Object.entries({ order: id, name: o.name, phone: o.phone ?? "", business: o.business ?? "", address: o.address ?? "" })) f.set(`metadata[${k}]`, v.slice(0, 480));
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: f,
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok && j.url) return NextResponse.json({ ok: true, url: j.url, id });
    console.error("[checkout] stripe failed", res.status, j?.error?.message);
    return NextResponse.json({ ok: false, error: "Die Zahlung konnte nicht gestartet werden.", fallback: true, id }, { status: 502 });
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
    o.business ? `Betrieb bei Google: ${o.business}` : "",
    o.address ? `Lieferadresse: ${o.address}` : "",
  ].filter(Boolean).join("\n");
  try {
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.INQUIRY_FROM ?? "foav.de <onboarding@resend.dev>", to: [process.env.INQUIRY_TO ?? "fd.solutions@web.de"], reply_to: o.email, subject: `Bestellung ${id}: ${euro(t.total)}`, text }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}`);
      return NextResponse.json({ ok: true, id, manual: true });
    }
    if (process.env.INQUIRY_WEBHOOK_URL) {
      const res = await fetch(process.env.INQUIRY_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, text, order: o }) });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
      return NextResponse.json({ ok: true, id, manual: true });
    }
  } catch (err) {
    console.error("[checkout] delivery failed", err);
  }
  return NextResponse.json({ ok: false, fallback: true, id, text }, { status: 503 });
}
