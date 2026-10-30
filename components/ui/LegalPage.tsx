import { site } from "@/lib/site";

// Same look as the main site (public/site): porcelain page, ink text, Sora headings, FOAV wordmark.
const css = `
@font-face { font-family: "Sora"; font-weight: 500 700; font-display: swap; src: url(/site/fonts/sora-latin.woff2) format("woff2"); }
@font-face { font-family: "Figtree"; font-weight: 400 700; font-display: swap; src: url(/site/fonts/figtree-latin.woff2) format("woff2"); }
.lp { min-height: 100vh; background: #f6f4ef; color: #45433e; font: 400 17px/1.65 "Figtree", -apple-system, "Segoe UI", Roboto, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
.lp a { color: #111114; }
.lp-wrap { max-width: 1320px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 48px); }
.lp-head { border-bottom: 1px solid rgba(17,17,20,.12); }
.lp-head .lp-wrap { height: 80px; display: flex; align-items: center; justify-content: space-between; }
.lp-head img { height: 27px; width: auto; display: block; }
.lp-back { display: inline-flex; align-items: center; min-height: 44px; padding: 0 20px; border-radius: 999px; box-shadow: inset 0 0 0 1.5px rgba(17,17,20,.14); font-weight: 600; text-decoration: none; }
.lp-back:hover { box-shadow: inset 0 0 0 1.5px #111114; }
.lp-main { padding: clamp(64px, 9vw, 120px) 0; }
.lp h1 { font: 500 clamp(40px, 5vw, 64px)/1.02 "Sora", sans-serif; letter-spacing: -.045em; color: #111114; }
.lp-body { max-width: 68ch; margin-top: 48px; }
.lp-body h2 { margin-top: 40px; font: 600 1.25rem/1.3 "Sora", sans-serif; letter-spacing: -.02em; color: #111114; }
.lp-body p, .lp-body ul { margin-top: 12px; }
.lp-body .block { display: block; }
.lp-body .note { margin-top: 40px; font-size: .9375rem; color: #66625a; }
.lp-foot { padding: 32px 0 40px; border-top: 1px solid rgba(17,17,20,.12); font-size: .9375rem; color: #66625a; }
.lp-foot .lp-wrap { display: flex; flex-wrap: wrap; gap: 8px 24px; justify-content: space-between; }
.lp-foot nav { display: flex; gap: 22px; } .lp-foot a { color: #66625a; } .lp-foot a:hover { color: #111114; }
.lp :focus-visible { outline: 3px solid #74572c; outline-offset: 3px; border-radius: 6px; }
`;

/** Shared shell for Impressum and Datenschutz. */
export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="lp">
      <style>{css}</style>
      <header className="lp-head">
        <div className="lp-wrap">
          <a href="/" aria-label={`${site.name} – zur Startseite`}>
            <img src="/media/logo-foav.svg" alt={site.name} width={98} height={27} />
          </a>
          <a href="/" className="lp-back">Zur Startseite</a>
        </div>
      </header>
      <main className="lp-main">
        <div className="lp-wrap">
          <h1>{title}</h1>
          <div className="lp-body">{children}</div>
        </div>
      </main>
      <footer className="lp-foot">
        <div className="lp-wrap">
          <span>© {new Date().getFullYear()} {site.name}, {site.city}</span>
          <nav aria-label="Rechtliches">
            <a href="/impressum">Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
