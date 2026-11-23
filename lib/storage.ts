import { getCloudflareContext } from "@opennextjs/cloudflare";

// File storage on Cloudflare R2 (bucket "foav-uploads", binding UPLOADS in wrangler.jsonc).
// Used for photo uploads from the questionnaires and as last-resort inbox for messages.
// Outside Cloudflare (local `next dev` without bindings) there is no bucket: uploads are switched off
// and the forms ask for photos by e-mail instead.

type R2Like = {
  put(key: string, value: ReadableStream | ArrayBuffer | string, opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string }; size: number } | null>;
};

export function bucket(): R2Like | null {
  try {
    const env = getCloudflareContext().env as unknown as { UPLOADS?: R2Like };
    return env.UPLOADS ?? null;
  } catch {
    return null;
  }
}
