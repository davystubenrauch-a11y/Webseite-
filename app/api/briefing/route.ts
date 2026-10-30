import { NextResponse } from "next/server";
import { kindLabels, summarizeBriefing, validateBriefing, type Briefing } from "@/lib/briefing";

// Receives the website questionnaire and the roomtour order (answers + photo links)
// and delivers them like /api/inquiry: Resend first, then a webhook, else 503 so the
// form can open a pre-filled e-mail instead.

const hits = new Map<string, number[]>();

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

  let data: Briefing;
  try {
    data = (await req.json()) as Briefing;
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (data.website) return NextResponse.json({ ok: true, id: "FOAV-000000" });
  if (!(data.kind in kindLabels)) return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  data.answers = (data.answers ?? []).slice(0, 80).map((a) => ({ section: String(a.section), label: String(a.label), value: String(a.value).slice(0, 4000) }));
  data.photos = (data.photos ?? []).slice(0, 200).filter((p) => /^https:\/\/[a-z0-9.-]+\.blob\.vercel-storage\.com\//.test(p.url));

  const errors = validateBriefing(data);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const id = `FOAV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const subject = `${kindLabels[data.kind]} ${id}: ${data.name}`;
  const text = `${summarizeBriefing(data)}\n\nReferenz: ${id}`;

  try {
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.INQUIRY_FROM ?? "FOAV <onboarding@resend.dev>",
          to: [process.env.INQUIRY_TO ?? "fd.solutions@web.de"],
          reply_to: data.email || undefined,
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
    console.error("[briefing] delivery failed", err);
    return NextResponse.json({ ok: false, error: "Zustellung fehlgeschlagen.", fallback: true, id }, { status: 502 });
  }
  return NextResponse.json({ ok: false, error: "Versand nicht konfiguriert.", fallback: true, id }, { status: 503 });
}
