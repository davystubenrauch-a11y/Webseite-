// Entry point of foav.de on Cloudflare Workers.
// The marketing pages are plain HTML in public/site (built by design/build.py). On Vercel, next.config.mjs
// rewrote "/" etc. to them; OpenNext cannot rewrite to static files, so this wrapper serves them straight
// from the assets and hands everything else (forms, shop, API, legal pages) to Next.js.
import { default as nextHandler } from "./.open-next/worker.js";

type Env = { ASSETS: { fetch(req: Request | URL | string): Promise<Response> } };

// keep in sync with rewrites in next.config.mjs
const pages: Record<string, string> = {
  "/": "/site/index.html",
  "/websites": "/site/websites.html",
  "/ki-shots": "/site/ki-shots.html",
  "/renderings": "/site/renderings.html",
  "/nfc-platten": "/site/nfc-platten.html",
  "/links": "/site/links.html",
  "/demo/spiruli": "/demo/spiruli/index.html",
  "/demo/spiruli/": "/demo/spiruli/index.html",
};

export default {
  async fetch(request: Request, env: Env, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);
    // foav.de → www.foav.de (as before on Vercel)
    if (url.hostname === "foav.de") {
      url.hostname = "www.foav.de";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    // Videos: Safari (iPhone and Mac) only plays media that answers byte-range requests with 206.
    // Static assets answer every range request with the whole file, so the worker slices it here.
    if ((request.method === "GET" || request.method === "HEAD") && url.pathname.startsWith("/videos/")) {
      return serveVideo(request, env, url);
    }
    if (request.method === "GET" || request.method === "HEAD") {
      const slug = /^\/entwurf\/([\w-]+)\/?$/.exec(url.pathname)?.[1];
      const file = pages[url.pathname] ?? (slug ? `/entwurf/${slug}/index.html` : undefined);
      if (file) {
        const res = await env.ASSETS.fetch(new Request(new URL(file, url), request));
        if (res.ok) {
          const out = new Response(res.body, res);
          out.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
          if (slug) out.headers.set("X-Robots-Tag", "noindex, nofollow");
          return out;
        }
      }
    }
    return nextHandler.fetch(request, env, ctx);
  },
};

async function serveVideo(request: Request, env: Env, url: URL): Promise<Response> {
  const res = await env.ASSETS.fetch(new Request(new URL(url.pathname, url)));
  if (!res.ok) return res;
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  const headers = new Headers({
    "Content-Type": res.headers.get("Content-Type") ?? "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
  });
  const etag = res.headers.get("ETag");
  if (etag) headers.set("ETag", etag);
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("Range") ?? "");
  if (!range || (range[1] === "" && range[2] === "")) {
    headers.set("Content-Length", String(size));
    return new Response(request.method === "HEAD" ? null : buf, { status: 200, headers });
  }
  let start: number, end: number;
  if (range[1] === "") { start = Math.max(0, size - Number(range[2])); end = size - 1; } // suffix: last N bytes
  else { start = Number(range[1]); end = range[2] === "" ? size - 1 : Math.min(Number(range[2]), size - 1); }
  if (start >= size || start > end) {
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(request.method === "HEAD" ? null : buf.slice(start, end + 1), { status: 206, headers });
}

// Durable Objects used by OpenNext (unused by foav.de, but the generated worker declares them)
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";
