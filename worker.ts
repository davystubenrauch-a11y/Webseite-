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

// Durable Objects used by OpenNext (unused by foav.de, but the generated worker declares them)
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";
