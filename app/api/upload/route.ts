import { NextResponse } from "next/server";
import { handleUpload, handleUploadPresigned, type HandleUploadBody, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { issueSignedToken } from "@vercel/blob";

// Lets the briefing forms upload photos straight to Vercel Blob.
// Two ways Vercel connects a Blob store:
//  - older stores: BLOB_READ_WRITE_TOKEN  -> classic client tokens (handleUpload)
//  - newer stores: BLOB_STORE_ID + OIDC   -> presigned upload URLs (handleUploadPresigned)
// GET tells the form whether uploads work and which way; without either it asks for photos by e-mail.

const images = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/svg+xml", "application/pdf"];
const maxBytes = 25 * 1024 * 1024;
const okPath = (p: string) => /^(website|shots|nfc|roomtour)\/[\w.\-/]+$/.test(p) && !p.includes("..");

const uploadMode = (): "token" | "presigned" | null =>
  process.env.BLOB_READ_WRITE_TOKEN ? "token" : process.env.BLOB_STORE_ID ? "presigned" : null;

export function GET() {
  const mode = uploadMode();
  return NextResponse.json({ enabled: Boolean(mode), mode });
}

export async function POST(req: Request) {
  const mode = uploadMode();
  if (!mode) return NextResponse.json({ error: "Upload nicht konfiguriert." }, { status: 503 });
  try {
    if (mode === "token") {
      const body = (await req.json()) as HandleUploadBody;
      const json = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async (pathname) => {
          if (!okPath(pathname)) throw new Error("Ungültiger Pfad.");
          return { allowedContentTypes: images, maximumSizeInBytes: maxBytes, addRandomSuffix: true };
        },
      });
      return NextResponse.json(json);
    }
    const body = (await req.json()) as HandleUploadPresignedBody;
    const json = await handleUploadPresigned({
      body,
      request: req,
      getSignedToken: async (pathname) => {
        if (!okPath(pathname)) throw new Error("Ungültiger Pfad.");
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: images,
          maximumSizeInBytes: maxBytes,
          validUntil: Date.now() + 60 * 60 * 1000,
        });
        return { token, urlOptions: { allowedContentTypes: images, maximumSizeInBytes: maxBytes } };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    console.error("[upload]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
