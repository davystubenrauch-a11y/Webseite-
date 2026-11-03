import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { euro } from "@/lib/shop";
import { stripe } from "@/lib/stripe";

// Stripe webhook: the only place an order counts as paid. Endpoint in the Stripe Dashboard:
// https://foav.de/api/stripe/webhook with the events checkout.session.completed,
// checkout.session.async_payment_succeeded and checkout.session.async_payment_failed.
// Needs STRIPE_WEBHOOK_SECRET (whsec_…). Notifies FOAV by e-mail (Resend) or INQUIRY_WEBHOOK_URL.

export const runtime = "nodejs";

export async function POST(req: Request) {
  const s = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s || !secret) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = s.webhooks.constructEvent(body, req.headers.get("stripe-signature") ?? "", secret);
  } catch {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  const kind = event.type;
  if (kind !== "checkout.session.completed" && kind !== "checkout.session.async_payment_succeeded" && kind !== "checkout.session.async_payment_failed") {
    return NextResponse.json({ received: true });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const failed = kind === "checkout.session.async_payment_failed";
  // With delayed methods (e.g. SEPA) "completed" arrives unpaid; the order counts once it is paid.
  if (!failed && session.payment_status === "unpaid") return NextResponse.json({ received: true });

  const full = await s.checkout.sessions.retrieve(session.id, { expand: ["line_items", "invoice"] });
  const m = full.metadata ?? {};
  const cd = full.customer_details;
  const addr = (a?: Stripe.Address | null) => (a ? [a.line1, a.line2, `${a.postal_code ?? ""} ${a.city ?? ""}`.trim(), a.country].filter(Boolean).join(", ") : "");
  const ship = full.collected_information?.shipping_details;
  const invoice = typeof full.invoice === "object" && full.invoice ? full.invoice : null;
  const order = m.order || full.client_reference_id || full.id;

  const text = [
    failed ? `ZAHLUNG FEHLGESCHLAGEN: Bestellung ${order}` : `Bezahlt: Bestellung ${order}`,
    "",
    ...(full.line_items?.data ?? []).map((l) => `${l.quantity} × ${l.description} = ${euro(l.amount_total)}`),
    `Summe: ${euro(full.amount_total ?? 0)}`,
    invoice ? `Rechnung: ${invoice.number ?? invoice.id}${invoice.hosted_invoice_url ? ` ${invoice.hosted_invoice_url}` : ""}` : "",
    "",
    `Name: ${cd?.name || m.name || ""}`,
    `E-Mail: ${cd?.email ?? ""}`,
    `Telefon: ${m.phone || cd?.phone || ""}`,
    m.company ? `Firma: ${m.company}` : "",
    cd?.business_name ? `Firma (Stripe): ${cd.business_name}` : "",
    cd?.tax_ids?.length ? `USt-IdNr.: ${cd.tax_ids.map((x) => x.value).join(", ")}` : "",
    `Rechnungsadresse: ${addr(cd?.address)}`,
    ship ? `Lieferadresse: ${ship.name}, ${addr(ship.address)}` : "",
    m.business ? `Betrieb bei Google: ${m.business}` : "",
    m.ref ? `Fragebogen: ${m.ref}` : "",
    m.early_start === "ja" ? "Sofortiger Beginn verlangt, Hinweis zum Erlöschen des Widerrufsrechts bestätigt." : "",
    `Stripe: https://dashboard.stripe.com/${full.livemode ? "" : "test/"}payments/${typeof full.payment_intent === "string" ? full.payment_intent : full.payment_intent?.id ?? ""}`,
  ].filter(Boolean).join("\n");
  const subject = `${failed ? "Zahlung fehlgeschlagen" : "Neue Bestellung"} ${order}: ${euro(full.amount_total ?? 0)}`;

  try {
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `${event.id}` },
        body: JSON.stringify({ from: process.env.INQUIRY_FROM ?? "foav.de <info@foav.de>", to: [process.env.INQUIRY_TO ?? "info@foav.de"], ...(cd?.email ? { reply_to: cd.email } : {}), subject, text }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}`);
    } else if (process.env.INQUIRY_WEBHOOK_URL) {
      const res = await fetch(process.env.INQUIRY_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: order, event: event.id, subject, text }) });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
    } else {
      console.log(`[stripe-webhook] ${subject}\n${text}`);
    }
  } catch (err) {
    console.error("[stripe-webhook] notify failed", err);
    // 500 lets Stripe retry the event later.
    return NextResponse.json({ error: "notify failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
