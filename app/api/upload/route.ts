import { NextResponse } from "next/server";
import { bucket } from "@/lib/storage";

// Photo uploads from the questionnaires, stored in Cloudflare R2.
// GET  -> { enabled } so the form knows whether uploads work (otherwise it asks for photos by e-mail).
// PUT  /api/upload?path=<kind>/<ref>/<group>/<name>  body = the file
//      -> { url } (https://<host>/api/datei/<key>, the key carries a random part so it cannot be guessed).

const types = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/svg+xml", "application/pdf"];
const maxBytes = 25 * 1024 * 1024;
const okPath = (p: string) => /^(website|shots|nfc)\/[\w.\-/]+$/.test(p) && !p.includes("..") && p.length < 300;

const hits = new Map<string, number[]>();
/** 300 files per IP per hour is plenty for a questionnaire. */
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 300;
}

export function GET() {
  return NextResponse.json({ enabled: Boolean(bucket()) });
}

export async function PUT(req: Request) {
  const b = bucket();
  if (!b) return NextResponse.json({ error: "Upload nicht konfiguriert." }, { status: 503 });
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "Zu viele Dateien." }, { status: 429 });
  const path = new URL(req.url).searchParams.get("path") ?? "";
  const type = (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const size = Number(req.headers.get("content-length") ?? "0");
  if (!okPath(path)) return NextResponse.json({ error: "Ungültiger Pfad." }, { status: 400 });
  if (!types.includes(type)) return NextResponse.json({ error: "Dateityp nicht erlaubt." }, { status: 415 });
  if (!size || size > maxBytes) return NextResponse.json({ error: "Datei zu groß (max. 25 MB)." }, { status: 413 });
  const data = await req.arrayBuffer();
  if (data.byteLength > maxBytes) return NextResponse.json({ error: "Datei zu groß (max. 25 MB)." }, { status: 413 });
  const key = path.replace(/(\.[\w]+)?$/, (ext) => `-${crypto.randomUUID().slice(0, 12)}${ext}`);
  await b.put(key, data, { httpMetadata: { contentType: type } });
  return NextResponse.json({ url: `${new URL(req.url).origin}/api/datei/${key}` });
}
