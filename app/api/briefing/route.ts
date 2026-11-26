import { NextResponse } from "next/server";
import { deliver } from "@/lib/deliver";
import { hello, signature } from "@/lib/mailtext";
import { HOSTING_URL, kindLabels, summarizeBriefing, validateBriefing, type Briefing } from "@/lib/briefing";

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
  const ip = (req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for"))?.split(",")[0]?.trim() ?? "local";
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
  // only files from our own upload (R2, /api/datei/…) on our own host
  const origin = new URL(req.url).origin;
  data.photos = (data.photos ?? []).slice(0, 200).filter((p) => typeof p.url === "string" && p.url.startsWith(`${origin}/api/datei/`));

  data.hosting = data.kind === "website" ? data.hosting === true : undefined;
  data.hostingAt = data.hosting ? new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" }) + " Uhr" : undefined;
  const errors = validateBriefing(data);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const id = `FOAV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const subject = `${kindLabels[data.kind]} ${id}: ${data.name}`;
  const text = `${summarizeBriefing(data)}\n\nReferenz: ${id}`;

  const next: Record<string, string[]> = {
    website: ["1. Falls noch nicht geschehen: Paket im Warenkorb bestellen (foav.de/shop).", "2. Nach der Zahlung beginnen wir. Den Entwurf Ihrer Website bekommen Sie als Link per E-Mail: Basis nach 5 Tagen, Business und Premium nach 7 Tagen.", "3. Sie sagen uns, was wir ändern sollen. Erst nach Ihrer Freigabe geht die Seite online."],
    render: ["1. Falls noch nicht geschehen: Paket im Warenkorb bestellen (foav.de/shop).", "2. Nach der Zahlung beginnen wir. Ihre Renderings bekommen Sie als Download-Link per E-Mail: Bilder nach 48 Stunden, den Rundgang-Film nach 72 Stunden.", "3. Passt etwas nicht, korrigieren wir es mit Ihnen. Erst dann verwenden Sie die Bilder."],
    shots: ["1. Falls noch nicht geschehen: Paket im Warenkorb bestellen (foav.de/shop).", "2. Nach der Zahlung beginnen wir. Ihren Werbefilm bekommen Sie als Download-Link per E-Mail: Starter nach 48 Stunden, Pro und Brand-Paket nach 72 Stunden.", "3. Passt etwas nicht, ändern wir es mit Ihnen. Erst dann verwenden Sie den Film."],
    nfc: ["1. Falls noch nicht geschehen: Platten im Warenkorb bestellen (foav.de/shop).", "2. Innerhalb von 2 Werktagen schicken wir Ihnen eine Design-Vorschau Ihrer Platte zur Freigabe.", "3. Nach Ihrer Freigabe verknüpfen wir jede Platte mit Ihrem Google-Profil, testen sie und schicken sie per Post."],
  };
  const visible = { ...data, photos: [] as typeof data.photos };
  const copy = data.email ? {
    to: data.email,
    subject: `Ihre Angaben sind bei uns (${id})`,
    text: [
      hello(data.name),
      "",
      `danke, Ihre Angaben sind vollständig bei uns angekommen${data.photos.length ? `, dazu ${data.photos.length} ${data.photos.length === 1 ? "Datei" : "Dateien"}` : ""}. Ihre Referenz: ${id}.`,
      "",
      "So geht es weiter:",
      ...(next[data.kind] ?? ["Wir melden uns innerhalb von 24 Stunden bei Ihnen."]),
      "",
      "Fehlt uns noch etwas, melden wir uns kurz. Meist reicht aber, was Sie geschickt haben.",
      "",
      ...(data.hosting ? ["Sie haben der Hosting-Vereinbarung mit Vertrag zur Auftragsverarbeitung zugestimmt. Zum Speichern oder Ausdrucken:", HOSTING_URL, ""] : []),
      "Ihre Angaben zum Nachlesen:",
      "",
      summarizeBriefing(visible),
      signature,
    ].join("\n"),
  } : undefined;
  if (await deliver({ id, kind: data.kind, subject, text, replyTo: data.email || undefined, data: { ...data, website: undefined }, copy })) return NextResponse.json({ ok: true, id });
  return NextResponse.json({ ok: false, error: "Ihre Angaben konnten gerade nicht übermittelt werden. Bitte versuchen Sie es in einer Minute noch einmal oder rufen Sie uns an.", id }, { status: 503 });
}
