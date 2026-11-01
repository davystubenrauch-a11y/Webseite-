"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/forms/Briefing";
import { site } from "@/lib/site";
import { euro, products, shipping, totals, vatNote, type Cart, type ProductId } from "@/lib/shop";

// Shop: NFC plates and the basic roomtour, cart with the shipping rule, then Stripe Checkout
// (or, while Stripe is not set up, an order by e-mail).

const css = `
.sh-grid { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: clamp(24px, 4vw, 56px); align-items: start; padding-bottom: 96px; }
.sh-list { display: grid; gap: 16px; }
.sh-item { display: grid; grid-template-columns: 180px 1fr auto; gap: 24px; align-items: center; padding: 18px; border-radius: 26px; background: #fff; box-shadow: 0 0 0 1px var(--line); }
.sh-pic { display: grid; place-items: center; aspect-ratio: 1; border-radius: 18px; background: linear-gradient(180deg, #f5f5f7, #e9e9ee); overflow: hidden; }
.sh-pic img { width: 100%; height: 100%; object-fit: cover; }
.sh-pic .disc-img { width: 74%; height: auto; border-radius: 50%; filter: drop-shadow(0 16px 18px rgba(0,0,0,.22)); transform: perspective(500px) rotateX(28deg); }
.sh-pic .plate { width: 70%; aspect-ratio: 1; border-radius: 50%; box-shadow: 0 18px 30px -14px rgba(0,0,0,.35), inset 0 0 0 1px rgba(0,0,0,.06); display: grid; place-items: center; font: 700 15px/1 "Inter", sans-serif; letter-spacing: -.02em; }
.sh-pic .plate--w { background: radial-gradient(circle at 50% 50%, #fff 55%, transparent 56%), conic-gradient(#ea4335 0 25%, #fbbc05 0 50%, #34a853 0 75%, #4285f4 0); color: #4285f4; }
.sh-pic .plate--b { background: radial-gradient(circle at 50% 50%, #161618 55%, transparent 56%), conic-gradient(#ea4335 0 25%, #fbbc05 0 50%, #34a853 0 75%, #4285f4 0); color: #fff; }
.sh-item h2 { margin: 0; font: 600 22px/1.2 "Inter", sans-serif; letter-spacing: -.025em; color: var(--ink); }
.sh-item p { margin: 6px 0 0; font-size: 15px; color: var(--muted); }
.sh-price { margin-top: 12px !important; font: 600 22px/1 "Inter", sans-serif !important; color: var(--ink) !important; font-variant-numeric: tabular-nums; }
.sh-qty { display: inline-flex; align-items: center; border-radius: 999px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.14); }
.sh-qty button { width: 44px; height: 44px; border: 0; border-radius: 999px; background: none; font: 500 20px/1 "Inter", sans-serif; color: var(--ink); cursor: pointer; }
.sh-qty button:hover:not([disabled]) { background: var(--bg2); } .sh-qty button[disabled] { color: #c7c7cc; cursor: default; }
.sh-qty output { min-width: 34px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--ink); }
.sh-note { margin-top: 18px; padding: 14px 18px; border-radius: 16px; background: var(--bg2); font-size: 15px; }
.sh-cart { position: sticky; top: 84px; padding: 26px; border-radius: 26px; background: #fff; box-shadow: 0 0 0 1px var(--line), 0 30px 60px -40px rgba(0,0,0,.25); }
.sh-cart h2 { margin: 0 0 14px; font: 600 20px/1.2 "Inter", sans-serif; color: var(--ink); }
.sh-row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; font-size: 15px; font-variant-numeric: tabular-nums; }
.sh-row b { color: var(--ink); font-weight: 500; }
.sh-total { margin-top: 8px; padding-top: 14px; border-top: 1px solid var(--line); font-size: 18px; }
.sh-total b { font-weight: 700; }
.sh-hint { margin: 4px 0 0; font-size: 13px; color: var(--muted); }
.sh-free { margin: 10px 0 0; padding: 10px 12px; border-radius: 12px; background: #ecfdf3; color: #067647; font-size: 14px; font-weight: 500; }
.sh-form { display: grid; gap: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--line); }
.sh-form label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: var(--ink); }
.sh-form textarea { min-height: 76px; }
.sh-form .bf-btn { width: 100%; margin-top: 6px; }
.sh-empty { color: var(--muted); font-size: 15px; }
@media (max-width: 960px) { .sh-grid { grid-template-columns: 1fr; } .sh-cart { position: static; } }
@media (max-width: 600px) { .sh-item { grid-template-columns: 96px 1fr; } .sh-item .sh-qty { grid-column: 1 / -1; justify-self: start; } }
`;

function Pic({ id }: { id: ProductId }) {
  if (id === "roomtour-basis") return <div className="sh-pic"><img src="/media/tour-md-2.jpg" alt="" /></div>;
  return <div className="sh-pic"><img className="disc-img" src={`/media/disc-${id === "nfc-weiss" ? "weiss" : "schwarz"}.svg`} alt="" /></div>;
}

export default function Shop() {
  const [cart, setCart] = useState<Cart>({});
  const [f, setF] = useState({ name: "", email: "", phone: "", business: "", address: "", consent: false, website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "mail" | "sent">("idle");

  // preselect from the link, e.g. /shop?weiss=10 or /shop?roomtour=1
  useEffect(() => {
    const q = new URLSearchParams(location.search), c: Cart = {};
    const w = +(q.get("weiss") ?? 0), b = +(q.get("schwarz") ?? 0), r = +(q.get("roomtour") ?? 0);
    if (w) c["nfc-weiss"] = w; if (b) c["nfc-schwarz"] = b; if (r) c["roomtour-basis"] = r;
    if (!w && !b && !r) c["nfc-weiss"] = 0;
    setCart(c);
  }, []);

  const t = totals(cart);
  const setQty = (id: ProductId, q: number) => setCart((c) => ({ ...c, [id]: Math.max(0, Math.min(q, products.find((p) => p.id === id)!.max)) }));
  const up = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((o) => ({ ...o, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function order(e: React.FormEvent) {
    e.preventDefault();
    setState("sending"); setErrors({});
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cart, ...f }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.url) { location.href = j.url; return; }
      if (res.ok && j.ok) { setState("sent"); scrollTo({ top: 0 }); return; }
      if (res.status === 422 && j.errors) { setErrors(j.errors); setState("idle"); return; }
      if (j.fallback && j.text) {
        location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Bestellung ${j.id}`)}&body=${encodeURIComponent(j.text)}`;
        setState("mail"); scrollTo({ top: 0 }); return;
      }
      throw new Error();
    } catch {
      setErrors({ form: "Das hat nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an." });
      setState("idle");
    }
  }

  const done = state === "sent" || state === "mail" ? (
    <div className="bf-done" role="status">
      <h1>{state === "mail" ? "Fast geschafft." : "Danke für Ihre Bestellung."}</h1>
      <p className="bf-lead">
        {state === "mail"
          ? "Ihr E-Mail-Programm hat sich mit der fertigen Bestellung geöffnet. Bitte dort noch auf Senden tippen. Wir schicken Ihnen dann den Zahlungslink."
          : "Wir schicken Ihnen innerhalb eines Tages den Zahlungslink. Nach der Zahlung geht Ihre Bestellung auf den Weg."}
      </p>
      <a className="bf-btn" href="/">Zur Startseite</a>
    </div>
  ) : undefined;

  return (
    <Shell
      title="Direkt bestellen."
      lead="NFC-Platten und die KI-Roomtour Basis können Sie hier sofort kaufen. Websites starten wir mit einem kurzen Fragebogen."
      steps={[
        ["Auswählen", "Anzahl wählen, der Preis steht sofort fest."],
        ["Bezahlen", "Sicher per Karte, Apple Pay oder Google Pay."],
        ["Einrichten", "Wir verknüpfen Ihre Platten mit Ihrem Google-Profil."],
        ["Erhalten", "Platten per Post, Roomtour 48 Stunden nach Ihren Fotos."],
      ]}
      done={done}
    >
      <style>{css}</style>
      <div className="sh-grid">
        <div>
          <div className="sh-list">
            {products.map((p) => (
              <article className="sh-item" key={p.id}>
                <Pic id={p.id} />
                <div>
                  <h2>{p.name}</h2>
                  <p>{p.short}</p>
                  <p className="sh-price">{euro(p.price)}</p>
                </div>
                <div className="sh-qty" role="group" aria-label={`Anzahl ${p.name}`}>
                  <button type="button" aria-label="Weniger" disabled={!cart[p.id]} onClick={() => setQty(p.id, (cart[p.id] ?? 0) - 1)}>−</button>
                  <output aria-live="polite">{cart[p.id] ?? 0}</output>
                  <button type="button" aria-label="Mehr" disabled={(cart[p.id] ?? 0) >= p.max} onClick={() => setQty(p.id, (cart[p.id] ?? 0) + 1)}>+</button>
                </div>
              </article>
            ))}
          </div>
          <p className="sh-note">Ab {shipping.freeFrom} Platten ist der Versand kostenlos, darunter kostet er {euro(shipping.price)}. Für Restaurants empfehlen wir 5 bis 10 Platten, zum Beispiel eine pro Tisch. Eine Website? <a href="/anfrage/website">Zum Fragebogen</a>.</p>
        </div>

        <aside className="sh-cart" aria-label="Warenkorb">
          <h2>Ihre Bestellung</h2>
          {t.lines.length === 0 ? <p className="sh-empty">Noch nichts ausgewählt.</p> : (
            <>
              {t.lines.map((l) => <div className="sh-row" key={l.id}><span>{l.qty} × {l.name}</span><b>{euro(l.qty * l.price)}</b></div>)}
              {t.plates > 0 && <div className="sh-row"><span>Versand</span><b>{t.ship ? euro(t.ship) : "kostenlos"}</b></div>}
              <div className="sh-row sh-total"><span>Summe</span><b>{euro(t.total)}</b></div>
              <p className="sh-hint">{vatNote}</p>
              {t.plates > 0 && t.plates < shipping.freeFrom && <p className="sh-free">Noch {shipping.freeFrom - t.plates} {shipping.freeFrom - t.plates === 1 ? "Platte" : "Platten"}, dann ist der Versand kostenlos.</p>}
            </>
          )}
          <form className="sh-form" onSubmit={order} noValidate>
            <div><label htmlFor="o-name">Name</label><input id="o-name" type="text" autoComplete="name" value={f.name} onChange={up("name")} />{errors.name && <p className="bf-err">{errors.name}</p>}</div>
            <div><label htmlFor="o-email">E-Mail</label><input id="o-email" type="email" autoComplete="email" value={f.email} onChange={up("email")} />{errors.email && <p className="bf-err">{errors.email}</p>}</div>
            <div><label htmlFor="o-phone">Telefon (optional)</label><input id="o-phone" type="tel" autoComplete="tel" value={f.phone} onChange={up("phone")} /></div>
            {t.plates > 0 && (
              <>
                <div><label htmlFor="o-biz">Ihr Betrieb, wie er bei Google heißt</label><input id="o-biz" type="text" value={f.business} onChange={up("business")} placeholder="z. B. Café Sonne, München" />{errors.business && <p className="bf-err">{errors.business}</p>}</div>
                <div><label htmlFor="o-addr">Lieferadresse</label><textarea id="o-addr" autoComplete="street-address" value={f.address} onChange={up("address")} />{errors.address && <p className="bf-err">{errors.address}</p>}</div>
              </>
            )}
            <input className="bf-hp" tabIndex={-1} aria-hidden="true" value={f.website} onChange={up("website")} />
            <label className="bf-consent" style={{ fontWeight: 400 }}>
              <input type="checkbox" checked={f.consent} onChange={up("consent")} />
              <span>Ich habe die <a href="/agb" target="_blank">AGB</a> und die <a href="/widerruf" target="_blank">Widerrufsbelehrung</a> gelesen. Meine Angaben werden laut <a href="/datenschutz" target="_blank">Datenschutzerklärung</a> verarbeitet.</span>
            </label>
            {errors.consent && <p className="bf-err">{errors.consent}</p>}
            {errors.cart && <p className="bf-err">{errors.cart}</p>}
            <button className="bf-btn" type="submit" disabled={state === "sending" || !t.lines.length}>{state === "sending" ? "Wird vorbereitet …" : `Zahlungspflichtig bestellen für ${euro(t.total)}`}</button>
            {errors.form && <p className="bf-err" role="alert">{errors.form}</p>}
          </form>
        </aside>
      </div>
    </Shell>
  );
}
