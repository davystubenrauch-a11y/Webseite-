import { bucket } from "@/lib/storage";

// One way for every message the site receives (inquiries, questionnaires, orders without Stripe).
// Tried in order, the first that works wins:
//   1. RESEND_API_KEY        -> e-mail to INQUIRY_TO (default info@foav.de)
//   2. INQUIRY_WEBHOOK_URL   -> JSON POST (Make, Zapier, n8n, Slack …)
//   3. R2 bucket UPLOADS     -> saved as a private JSON file under eingang/ (Cloudflare R2, never served)
// Nothing is ever handed to the visitor's mail program. If none works, the caller gets ok: false
// and the page asks the visitor to try again or call.

export type Delivery = {
  id: string; kind: string; subject: string; text: string; replyTo?: string; data?: unknown;
  /** optional confirmation to the customer (only sent via Resend) */
  copy?: { to: string; subject: string; text: string };
};

/** Structured copy of everything, attached to the e-mail so it can go straight into Claude. */
const attachment = (d: Delivery) => ({ filename: `${d.id}-${d.kind}.json`, content: Buffer.from(JSON.stringify({ id: d.id, kind: d.kind, at: new Date().toISOString(), data: d.data }, null, 2)).toString("base64") });

export async function deliver(d: Delivery): Promise<boolean> {
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": d.id },
        body: JSON.stringify({ from: process.env.INQUIRY_FROM ?? "FOAV <info@foav.de>", to: [process.env.INQUIRY_TO ?? "info@foav.de"], ...(d.replyTo ? { reply_to: d.replyTo } : {}), subject: d.subject, text: d.text, ...(d.data ? { attachments: [attachment(d)] } : {}) }),
      });
      if (res.ok) {
        if (d.copy) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `${d.id}-copy` },
            body: JSON.stringify({ from: process.env.INQUIRY_FROM ?? "FOAV <info@foav.de>", to: [d.copy.to], reply_to: process.env.INQUIRY_TO ?? "info@foav.de", subject: d.copy.subject, text: d.copy.text }),
          }).catch(() => {});
        }
        return true;
      }
      console.error(`[deliver] resend ${res.status}`);
    } catch (e) { console.error("[deliver] resend", e); }
  }
  if (process.env.INQUIRY_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.INQUIRY_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: d.id, kind: d.kind, subject: d.subject, text: d.text, data: d.data }) });
      if (res.ok) return true;
      console.error(`[deliver] webhook ${res.status}`);
    } catch (e) { console.error("[deliver] webhook", e); }
  }
  const b = bucket();
  if (b) {
    const body = JSON.stringify({ id: d.id, kind: d.kind, at: new Date().toISOString(), subject: d.subject, text: d.text, data: d.data }, null, 2);
    try {
      await b.put(`eingang/${new Date().toISOString().slice(0, 10)}/${d.id}-${crypto.randomUUID().slice(0, 8)}.json`, body, { httpMetadata: { contentType: "application/json" } });
      return true;
    } catch (e) { console.error("[deliver] r2", e instanceof Error ? e.message : e); }
  }
  // Last resort so nothing is silently lost: the full text lands in the worker log (Cloudflare → Workers → foav → Logs).
  console.log(`[deliver] NOT DELIVERED ${d.id}\n${d.subject}\n${d.text}`);
  return false;
}
