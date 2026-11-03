import { NextResponse } from "next/server";

// Shows which services are set up, without revealing any key. Resend is asked read-only
// whether the sending domain is verified. Open /api/status after a deploy to check the setup.
export const dynamic = "force-dynamic";

export async function GET() {
  const out: Record<string, unknown> = {
    resend_key: Boolean(process.env.RESEND_API_KEY),
    stripe_key: Boolean(process.env.STRIPE_SECRET_KEY),
    stripe_webhook_secret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    photo_upload: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    mail_to: process.env.INQUIRY_TO || "info@foav.de",
    mail_from: process.env.INQUIRY_FROM || "FOAV <info@foav.de>",
  };
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` }, cache: "no-store" });
      const j = await res.json().catch(() => ({}));
      out.resend_ok = res.ok;
      out.resend_domains = res.ok ? (j.data ?? []).map((d: { name: string; status: string }) => ({ name: d.name, status: d.status })) : j?.message ?? res.status;
    } catch {
      out.resend_ok = false;
    }
  }
  return NextResponse.json(out, { headers: { "X-Robots-Tag": "noindex" } });
}
