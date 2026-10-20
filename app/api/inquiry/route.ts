import { NextResponse } from "next/server";
import { serviceLabels, summarize, validate, type Inquiry } from "@/lib/inquiry";

// Receives inquiries from the wizard, validates them again server-side and delivers them.
//
// Delivery (first one configured wins):
//   RESEND_API_KEY (+ INQUIRY_TO, INQUIRY_FROM)  -> e-mail via resend.com
//   INQUIRY_WEBHOOK_URL                          -> JSON POST (Make, Zapier, n8n, Slack, Formspree, …)
// Without either, the route answers 503 and the client falls back to a pre-filled e-mail.

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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Zu viele Anfragen. Bitte später erneut versuchen." }, { status: 429 });

  let data: Inquiry;
  try {
    data = (await req.json()) as Inquiry;
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success so they don't retry.
  if (data.website) return NextResponse.json({ ok: true, id: "FD-000000" });

  data.services = (data.services ?? []).filter((s) => s in serviceLabels);
  const errors = validate(data);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const id = `FD-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const subject = `Anfrage ${id}: ${data.services.map((s) => serviceLabels[s]).join(" + ")}`;
  const text = `${summarize(data)}\n\nReferenz: ${id}`;

  try {
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.INQUIRY_FROM ?? "F&D Solutions <onboarding@resend.dev>",
          to: [process.env.INQUIRY_TO ?? "fd.solutions@web.de"],
          reply_to: data.email,
          subject,
          text,
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}`);
      return NextResponse.json({ ok: true, id });
    }

    if (process.env.INQUIRY_WEBHOOK_URL) {
      const res = await fetch(process.env.INQUIRY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, subject, text, ...data, website: undefined }),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
      return NextResponse.json({ ok: true, id });
    }
  } catch (err) {
    console.error("[inquiry] delivery failed", err);
    return NextResponse.json({ ok: false, error: "Zustellung fehlgeschlagen.", fallback: true, id }, { status: 502 });
  }

  return NextResponse.json({ ok: false, error: "Versand nicht konfiguriert.", fallback: true, id }, { status: 503 });
}
