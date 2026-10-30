import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// Issues short-lived tokens so the briefing forms can upload photos straight to Vercel Blob.
// Needs BLOB_READ_WRITE_TOKEN (set automatically when a Blob store is connected in Vercel).
// GET tells the form whether uploads are available; without a token it asks for photos by e-mail.

const images = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/svg+xml", "application/pdf"];

export function GET() {
  return NextResponse.json({ enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
}

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Upload nicht konfiguriert." }, { status: 503 });
  try {
    const body = (await req.json()) as HandleUploadBody;
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^(website|roomtour)\//.test(pathname)) throw new Error("Ungültiger Pfad.");
        return { allowedContentTypes: images, maximumSizeInBytes: 25 * 1024 * 1024, addRandomSuffix: true };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
