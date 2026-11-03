import { NextResponse } from "next/server";
import { deliver } from "@/lib/deliver";
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
  data.answers = (data.answers ?? []).slice(0, 160).map((a) => ({ section: String(a.section), label: String(a.label), value: String(a.value).slice(0, 4000) }));
  data.photos = (data.photos ?? []).slice(0, 200).filter((p) => /^https:\/\/[a-z0-9.-]+\.blob\.vercel-storage\.com\//.test(p.url));

  const errors = validateBriefing(data);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const id = `FOAV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const subject = `${kindLabels[data.kind]} ${id}: ${data.name}`;
  const text = `${summarizeBriefing(data)}\n\nReferenz: ${id}`;

  const copy = data.email ? {
    to: data.email,
    subject: `Ihre Angaben bei foav.de (${id})`,
    text: `Hallo ${data.name},\n\ndanke, Ihre Angaben sind bei uns angekommen. Ihre Referenz: ${id}.\n\nSo geht es weiter: Sobald die Zahlung da ist, beginnen wir. Den Entwurf bzw. das Video bekommen Sie per E-Mail als Link. Fehlt etwas, melden wir uns, aber in der Regel reicht, was Sie uns geschickt haben.\n\nIhre Angaben im Überblick:\n\n${summarizeBriefing(data)}\n\nFragen? Antworten Sie einfach auf diese E-Mail oder rufen Sie an: 0155 66456417 (Florian) oder 0176 56612709 (Davy).\n\nfoav.de, München`,
  } : undefined;
  if (await deliver({ id, kind: data.kind, subject, text, replyTo: data.email || undefined, data: { ...data, website: undefined }, copy })) return NextResponse.json({ ok: true, id });
  return NextResponse.json({ ok: false, error: "Ihre Angaben konnten gerade nicht übermittelt werden. Bitte versuchen Sie es in einer Minute noch einmal oder rufen Sie uns an.", id }, { status: 503 });
}
