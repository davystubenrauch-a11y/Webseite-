import { NextResponse } from "next/server";
import { deliver } from "@/lib/deliver";
import { hello, list, signature } from "@/lib/mailtext";
import { serviceLabels, summarize, validate, type Inquiry } from "@/lib/inquiry";

// Receives inquiries from the wizard, validates them again server-side and delivers them.
//
// Delivery: lib/deliver.ts (Resend, webhook or Cloudflare R2). Never falls back to the visitor's mail program.

const hits = new Map<string, number[]>();

/** Very small in-memory rate limit: 5 requests per IP per 10 minutes. */
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = (req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for"))?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Zu viele Anfragen. Bitte später erneut versuchen." }, { status: 429 });

  let data: Inquiry;
  try {
    data = (await req.json()) as Inquiry;
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success so they don't retry.
  if (data.website) return NextResponse.json({ ok: true, id: "FOAV-000000" });

  data.services = (data.services ?? []).filter((s) => s in serviceLabels);
  const errors = validate(data);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const id = `FOAV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const subject = `Anfrage ${id}: ${data.services.map((s) => serviceLabels[s]).join(" + ")}`;
  const text = `${summarize(data)}\n\nReferenz: ${id}`;

  const rendering = /^\[Rendering\]/.test(data.message ?? "");
  const asked = list(data.services.map((s) => (s === "shots" ? (rendering ? "Renderings" : "KI-Werbevideos") : serviceLabels[s])));
  const copy = data.email ? {
    to: data.email,
    subject: `Danke für Ihre Anfrage bei FOAV (${id})`,
    text: [
      hello(data.name),
      "",
      `danke für Ihre Anfrage zu ${asked}. Sie ist bei uns angekommen, und einer von uns beiden meldet sich innerhalb von 24 Stunden bei Ihnen${data.contactPref === "phone" && data.phone ? " telefonisch" : ""}.`,
      "",
      "Sie bekommen von uns eine ehrliche Empfehlung und einen festen Preis, bevor irgendetwas kostet. Kein Abo, keine versteckten Kosten.",
      "",
      "Möchten Sie schon einmal stöbern? Beispiele und alle Preise finden Sie auf foav.de.",
      "",
      `Ihre Referenz: ${id}. Antworten Sie einfach auf diese E-Mail, wenn Ihnen noch etwas einfällt.`,
      signature,
    ].join("\n"),
  } : undefined;
  if (await deliver({ id, kind: "anfrage", subject, text, replyTo: data.email || undefined, data: { ...data, website: undefined }, copy })) return NextResponse.json({ ok: true, id });
  return NextResponse.json({ ok: false, error: "Ihre Angaben konnten gerade nicht übermittelt werden. Bitte versuchen Sie es in einer Minute noch einmal oder rufen Sie uns an.", id }, { status: 503 });
}
