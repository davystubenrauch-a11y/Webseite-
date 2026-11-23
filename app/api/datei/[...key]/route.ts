import { bucket } from "@/lib/storage";

// Serves an uploaded questionnaire file from R2. Keys contain a random part, so only people with the
// link (FOAV via the e-mail, the customer in their own form) can open a file. Inbox JSON is never served.
export async function GET(_req: Request, ctx: { params: Promise<{ key: string[] }> }) {
  const key = (await ctx.params).key.join("/");
  if (!/^(website|shots|nfc)\//.test(key) || key.includes("..")) return new Response("Nicht gefunden", { status: 404 });
  const b = bucket();
  const obj = b ? await b.get(key) : null;
  if (!obj) return new Response("Nicht gefunden", { status: 404 });
  const type = obj.httpMetadata?.contentType ?? "application/octet-stream";
  return new Response(obj.body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
      // SVG could carry scripts: never render it inline as a page
      ...(type === "image/svg+xml" ? { "Content-Disposition": "attachment", "Content-Security-Policy": "default-src 'none'" } : {}),
    },
  });
}
