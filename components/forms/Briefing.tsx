"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { site } from "@/lib/site";
import { summarizeBriefing, type Briefing, type BriefingKind, type Photo } from "@/lib/briefing";

// Shared pieces of the two detailed forms (/anfrage/website, /anfrage/roomtour):
// page shell in the style of the main site, question renderer, photo upload, submit.

export type Q = {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "url" | "date" | "one" | "many";
  options?: string[];
  hint?: string;
  placeholder?: string;
  half?: boolean;
};
export type Section = { title: string; intro?: string; questions: Q[] };
export type Values = Record<string, string | string[]>;

export type Upload = Photo & { id: string; preview: string; progress: number; error?: string };

const css = `
@font-face { font-family: "Inter"; font-weight: 100 900; font-display: swap; src: url(/site/fonts/inter-latin.woff2) format("woff2"); }
.bf { --bg:#fbfbfd; --bg2:#f5f5f7; --ink:#1d1d1f; --text:#424245; --muted:#636366; --line:rgba(0,0,0,.1);
  min-height:100vh; background:var(--bg); color:var(--text); font:400 17px/1.55 "Inter",-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  letter-spacing:-.011em; -webkit-font-smoothing:antialiased; }
.bf *, .bf *::before, .bf *::after { box-sizing:border-box; }
.bf a { color:var(--ink); }
.bf-wrap { max-width:1180px; margin:0 auto; padding:0 clamp(16px,4vw,40px); }
.bf-head { position:sticky; top:0; z-index:5; background:rgba(251,251,253,.86); backdrop-filter:saturate(180%) blur(20px); -webkit-backdrop-filter:saturate(180%) blur(20px); border-bottom:1px solid var(--line); }
.bf-head .bf-wrap { height:60px; display:flex; align-items:center; justify-content:space-between; }
.bf-head img { height:24px; width:auto; display:block; }
.bf-back { font-size:15px; text-decoration:none; color:var(--muted)!important; } .bf-back:hover { color:var(--ink)!important; }
.bf-hero { padding:clamp(48px,7vw,88px) 0 clamp(28px,4vw,44px); }
.bf h1 { margin:0; max-width:16ch; font:600 clamp(36px,5.4vw,64px)/1.04 "Inter",sans-serif; letter-spacing:-.04em; color:var(--ink); text-wrap:balance; }
.bf-lead { max-width:56ch; margin:20px 0 0; font-size:19px; color:var(--text); }
.bf-sec { display:grid; grid-template-columns:260px minmax(0,1fr); gap:24px clamp(32px,5vw,72px); padding:clamp(36px,5vw,56px) 0; border-top:1px solid var(--line); }
.bf-sec__h { align-self:start; position:sticky; top:84px; }
.bf-sec__h b { display:block; font:500 15px/1 "Inter",sans-serif; color:var(--muted); font-variant-numeric:tabular-nums; }
.bf-sec h2 { margin:10px 0 0; font:600 26px/1.15 "Inter",sans-serif; letter-spacing:-.03em; color:var(--ink); }
.bf-intro { margin:10px 0 0; color:var(--muted); font-size:15px; max-width:30ch; }
.bf-qs { display:grid; grid-template-columns:1fr 1fr; gap:28px 18px; max-width:720px; }
.bf-q { grid-column:1/-1; min-width:0; } .bf-q.half { grid-column:auto; }
.bf-q > label, .bf-q > .lab { display:block; margin-bottom:8px; font-weight:500; font-size:15px; color:var(--ink); }
.bf-hint { margin:-4px 0 8px; font-size:14px; color:var(--muted); }
.bf input[type=text], .bf input[type=email], .bf input[type=tel], .bf input[type=number], .bf input[type=url], .bf input[type=date], .bf textarea {
  width:100%; min-height:48px; padding:12px 14px; border:0; border-radius:12px; background:var(--bg2); color:var(--ink);
  font:inherit; box-shadow:inset 0 0 0 1px transparent; transition:box-shadow .15s, background .15s; }
.bf textarea { min-height:104px; resize:vertical; }
.bf input:hover, .bf textarea:hover { box-shadow:inset 0 0 0 1px rgba(0,0,0,.14); }
.bf input:focus, .bf textarea:focus { outline:none; background:#fff; box-shadow:inset 0 0 0 1.5px var(--ink); }
.bf ::placeholder { color:#8e8e93; }
.bf-chips { display:flex; flex-wrap:wrap; gap:8px; }
.bf-chip { position:relative; display:inline-flex; }
.bf-chip input { position:absolute; inset:0; opacity:0; margin:0; cursor:pointer; }
.bf-chip span { display:inline-flex; align-items:center; min-height:44px; padding:10px 16px; border-radius:999px; background:#fff; box-shadow:inset 0 0 0 1px rgba(0,0,0,.14); font-size:15px; color:var(--ink); transition:background .15s, color .15s, box-shadow .15s; }
.bf-chip:hover span { box-shadow:inset 0 0 0 1px rgba(0,0,0,.4); }
.bf-chip input:checked + span { background:var(--ink); color:#fff; box-shadow:none; }
.bf-chip input:focus-visible + span { outline:3px solid rgba(0,113,227,.45); outline-offset:2px; }
.bf-step { display:inline-flex; border-radius:999px; box-shadow:inset 0 0 0 1px rgba(0,0,0,.14); }
.bf-step button { width:44px; min-height:44px; border:0; background:none; font:500 18px/1 "Inter",sans-serif; color:var(--ink); cursor:pointer; border-radius:999px; }
.bf-step button:hover:not([disabled]) { background:var(--bg2); } .bf-step button[disabled] { color:#c7c7cc; cursor:default; }
.bf :focus-visible { outline:3px solid rgba(0,113,227,.45); outline-offset:2px; }
.bf-err { margin:8px 0 0; font-size:14px; color:#c4211a; }
.bf-off { padding:14px 16px; border-radius:14px; background:var(--bg2); font-size:15px; }
.bf-consent, .bf-q > label.bf-consent { display:flex; gap:12px; align-items:flex-start; margin-top:4px; font-size:15px; }
.bf-consent input { appearance:none; -webkit-appearance:none; display:grid; place-items:center; width:22px; height:22px; margin:1px 0 0; border-radius:6px; background:#fff; box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.3); flex:none; cursor:pointer; }
.bf-consent input:checked { background:var(--ink); box-shadow:none; }
.bf-consent input:checked::after { content:""; width:10px; height:6px; margin-top:-3px; border-left:2px solid #fff; border-bottom:2px solid #fff; transform:rotate(-45deg); }
.bf-submit { display:flex; flex-wrap:wrap; align-items:center; gap:14px 20px; }
.bf-btn { display:inline-flex; align-items:center; justify-content:center; min-height:48px; padding:0 26px; border:0; border-radius:999px; background:var(--ink); color:#fff; font:500 16px/1 "Inter",sans-serif; cursor:pointer; transition:background .15s; }
.bf-btn:hover { background:#000; } .bf-btn[disabled] { opacity:.5; cursor:default; }
.bf-small { font-size:14px; color:var(--muted); }
.bf-hp { position:absolute; left:-9999px; width:1px; height:1px; overflow:hidden; }
.bf-flow { list-style:none; margin:clamp(36px,5vw,56px) 0 0; padding:0; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:0; border-top:1px solid var(--ink); }
.bf-flow li { padding:16px 20px 0 0; font-size:15px; color:var(--muted); }
.bf-flow b { display:block; margin-bottom:4px; color:var(--ink); font-weight:600; }
.bf-flow i { display:block; margin-bottom:12px; font:500 13px/1 "Inter",sans-serif; font-style:normal; color:var(--muted); font-variant-numeric:tabular-nums; }
.bf-panel { padding:22px 24px; border-radius:16px; background:var(--bg2); }
.bf-panel h3 { margin:0 0 12px; font:600 16px/1.3 "Inter",sans-serif; color:var(--ink); letter-spacing:-.015em; }
.bf-quote { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; margin-top:10px; font-size:15px; color:var(--muted); }
.bf-price { font:600 28px/1 "Inter",sans-serif; letter-spacing:-.03em; color:var(--ink); font-variant-numeric:tabular-nums; }
.bf-call { display:flex; flex-wrap:wrap; gap:4px 18px; font-size:15px; color:var(--muted); } .bf-call a { font-weight:500; text-decoration:none; } .bf-call a:hover { text-decoration:underline; }
.bf-opt small { display:block; margin-top:1px; font-size:13px; color:var(--muted); }
.bf-chip input:checked + span small { color:rgba(255,255,255,.72); }
.bf-chip span.two { flex-direction:column; align-items:flex-start; border-radius:14px; padding:10px 16px; line-height:1.3; }
.bf-shots { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; }
.bf-shot { position:relative; display:flex; flex-direction:column; justify-content:space-between; aspect-ratio:4/3; padding:12px; border-radius:12px; background:var(--bg2); color:var(--muted); font-size:13px; line-height:1.3; overflow:hidden; cursor:pointer; transition:box-shadow .15s, background .15s; }
.bf-shot svg { width:46px; height:36px; color:var(--ink); }
.bf-shot:hover, .bf-shot.over { background:#fff; box-shadow:inset 0 0 0 1.5px var(--ink); }
.bf-shot:focus-within { outline:3px solid rgba(0,113,227,.45); outline-offset:2px; }
.bf-shot input { position:absolute; inset:0; opacity:0; cursor:pointer; }
.bf-shot.add { align-items:center; justify-content:center; background:none; box-shadow:inset 0 0 0 1px rgba(0,0,0,.14); color:var(--ink); font-size:14px; font-weight:500; }
.bf-shot.full { padding:0; cursor:default; }
.bf-shot.full img { width:100%; height:100%; object-fit:cover; display:block; }
.bf-shot.full figcaption { position:absolute; left:8px; bottom:8px; padding:3px 8px; border-radius:6px; background:rgba(255,255,255,.9); color:var(--ink); font-size:12px; }
.bf-shot .bar { position:absolute; left:8px; right:8px; top:8px; height:4px; border-radius:2px; background:rgba(255,255,255,.7); overflow:hidden; }
.bf-shot .bar i { display:block; height:100%; background:var(--ink); }
.bf-shot .x { position:absolute; top:6px; right:6px; width:30px; height:30px; border:0; border-radius:50%; background:rgba(0,0,0,.62); color:#fff; font-size:17px; line-height:30px; cursor:pointer; }
.bf-shot.bad { box-shadow:inset 0 0 0 2px #c4211a; }
.bf-room { padding-top:24px; border-top:1px solid var(--line); }
.bf-room > .lab { display:flex; justify-content:space-between; gap:12px; margin-bottom:12px; font-weight:500; font-size:15px; color:var(--ink); }
.bf-room > .lab span { color:var(--muted); font-weight:400; font-variant-numeric:tabular-nums; }
.bf-tips { margin:0; padding:0; list-style:none; display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; font-size:15px; }
.bf-tips li { position:relative; padding-left:22px; }
.bf-tips li::before { content:""; position:absolute; left:2px; top:.5em; width:10px; height:6px; border-left:2px solid var(--ink); border-bottom:2px solid var(--ink); transform:rotate(-45deg); }
.bf-done { max-width:640px; padding:clamp(56px,9vw,120px) 0 120px; }
.bf-done .bf-btn { margin-top:28px; text-decoration:none; color:#fff; }
.bf-done code { font:500 15px "Inter",sans-serif; padding:2px 8px; border-radius:6px; background:var(--bg2); color:var(--ink); }
.bf-foot { border-top:1px solid var(--line); padding:24px 0 40px; font-size:14px; color:var(--muted); }
.bf-foot .bf-wrap { display:flex; flex-wrap:wrap; gap:8px 22px; justify-content:space-between; }
.bf-foot nav { display:flex; gap:20px; } .bf-foot a { color:var(--muted); }
@media (max-width:900px) {
  .bf-sec { grid-template-columns:1fr; }
  .bf-sec__h { position:static; }
  .bf-intro { max-width:none; }
  .bf-flow { grid-template-columns:1fr 1fr; row-gap:20px; }
}
@media (max-width:560px) { .bf-qs, .bf-tips { grid-template-columns:1fr; } .bf-q.half { grid-column:1/-1; } .bf-shots { grid-template-columns:1fr 1fr; } }
@media (prefers-reduced-motion:reduce) { .bf * { transition:none!important; } }
`;

export function Shell({ title, lead, steps, done, children }: { title: string; lead: string; steps: [string, string][]; done?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bf">
      <style>{css}</style>
      <header className="bf-head">
        <div className="bf-wrap">
          <a href="/" aria-label={`${site.name} – zur Startseite`}>
            <img src="/media/logo-foav.svg" alt={site.name} width={87} height={24} />
          </a>
          <a href="/" className="bf-back">Zur Startseite</a>
        </div>
      </header>
      <main className="bf-wrap">
        {done ?? (
          <>
            <div className="bf-hero">
              <h1>{title}</h1>
              <p className="bf-lead">{lead}</p>
              <ol className="bf-flow" aria-label="So geht es weiter">
                {steps.map(([t, d], i) => (
                  <li key={t}><i>{i + 1}</i><b>{t}</b>{d}</li>
                ))}
              </ol>
            </div>
            <div className="bf-form">{children}</div>
          </>
        )}
      </main>
      <footer className="bf-foot">
        <div className="bf-wrap">
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

/** Renders one question. */
export function Question({ q, value, onChange }: { q: Q; value: string | string[] | undefined; onChange: (v: string | string[]) => void }) {
  const id = `q-${q.id}`;
  if (q.type === "one" || q.type === "many") {
    const list = Array.isArray(value) ? value : value ? [value] : [];
    return (
      <fieldset className={`bf-q${q.half ? " half" : ""}`} style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="lab" style={{ padding: 0, marginBottom: 8, fontWeight: 500, fontSize: 15, color: "var(--ink)" }}>{q.label}</legend>
        {q.hint && <p className="bf-hint">{q.hint}</p>}
        <div className="bf-chips">
          {q.options!.map((o) => (
            <label className="bf-chip" key={o}>
              <input
                type={q.type === "one" ? "radio" : "checkbox"}
                name={id}
                checked={list.includes(o)}
                onChange={() =>
                  q.type === "one" ? onChange(o) : onChange(list.includes(o) ? list.filter((x) => x !== o) : [...list, o])
                }
              />
              {o.includes("|") ? (
                <span className="two bf-opt">{o.split("|")[0]}<small>{o.split("|")[1]}</small></span>
              ) : (
                <span>{o}</span>
              )}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }
  const common = { id, value: (value as string) ?? "", placeholder: q.placeholder, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value) };
  return (
    <div className={`bf-q${q.half ? " half" : ""}`}>
      <label htmlFor={id}>{q.label}</label>
      {q.hint && <p className="bf-hint">{q.hint}</p>}
      {q.type === "textarea" ? <textarea {...common} /> : <input type={q.type} inputMode={q.type === "number" ? "numeric" : undefined} min={q.type === "number" ? 0 : undefined} {...common} />}
    </div>
  );
}

export function Sec({ n, title, intro, children }: { n: number; title: string; intro?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bf-sec" aria-labelledby={`sec-${n}`}>
      <div className="bf-sec__h">
        <b>{n}</b>
        <h2 id={`sec-${n}`}>{title}</h2>
        {intro && <p className="bf-intro">{intro}</p>}
      </div>
      <div className="bf-qs">{children}</div>
    </section>
  );
}

/** Pre-fills answers from the query string, e.g. /anfrage/website?paket=Business. */
export function usePrefill(sections: Section[], set: (id: string, v: string | string[]) => void) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const s of sections)
      for (const q of s.questions) {
        const raw = params.get(q.id);
        if (!raw) continue;
        const match = q.options?.find((o) => o.toLowerCase().startsWith(raw.toLowerCase()));
        set(q.id, q.options ? (q.type === "many" ? [match ?? raw] : match ?? raw) : raw);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Whether the server can accept photo uploads (BLOB_READ_WRITE_TOKEN set). */
function useUploadsEnabled() {
  const [on, setOn] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/upload").then((r) => r.json()).then((j) => setOn(Boolean(j.enabled))).catch(() => setOn(false));
  }, []);
  return on;
}

const slug = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w.]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "datei";

/** Photo uploads for one group (room, "Logo", …). Files go straight to Vercel Blob. */
export function usePhotos(kind: BriefingKind) {
  const ref = useRef(Math.random().toString(36).slice(2, 10));
  const enabled = useUploadsEnabled();
  const [items, setItems] = useState<Upload[]>([]);
  const patch = (id: string, p: Partial<Upload>) => setItems((list) => list.map((x) => (x.id === id ? { ...x, ...p } : x)));

  function add(group: string, files: FileList | File[]) {
    for (const file of Array.from(files)) {
      const id = Math.random().toString(36).slice(2);
      const item: Upload = { id, group, name: file.name, url: "", preview: URL.createObjectURL(file), progress: 0 };
      if (file.size > 25 * 1024 * 1024) item.error = "Größer als 25 MB";
      setItems((list) => [...list, item]);
      if (item.error) continue;
      upload(`${kind}/${ref.current}/${slug(group)}/${slug(file.name)}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        multipart: file.size > 8 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => patch(id, { progress: percentage }),
      })
        .then((b) => patch(id, { url: b.url, progress: 100 }))
        .catch(() => patch(id, { error: "Upload fehlgeschlagen" }));
    }
  }
  const remove = (id: string) => setItems((list) => list.filter((x) => x.id !== id));
  const busy = items.some((x) => !x.url && !x.error);
  const done: Photo[] = items.filter((x) => x.url).map(({ group, name, url }) => ({ group, name, url }));
  return { enabled, items, add, remove, busy, done };
}

/** One requested photo: what to shoot, plus camera position (x, y in 0..1, top wall = window) and view angle. */
export type Shot = { label: string; x: number; y: number; a: number };

/** Tiny floor plan: room outline, window on top, camera dot with its view cone. */
function Plan({ x, y, a }: Omit<Shot, "label">) {
  const cx = 3 + x * 40, cy = 3 + y * 30, r = (d: number) => (d * Math.PI) / 180, len = 15;
  const p1 = [cx + len * Math.cos(r(a - 26)), cy + len * Math.sin(r(a - 26))];
  const p2 = [cx + len * Math.cos(r(a + 26)), cy + len * Math.sin(r(a + 26))];
  return (
    <svg viewBox="0 0 46 36" aria-hidden="true">
      <rect x="1" y="1" width="44" height="34" rx="2" fill="none" stroke="currentColor" strokeOpacity=".3" />
      <line x1="15" y1="1" x2="31" y2="1" stroke="currentColor" strokeWidth="3" strokeOpacity=".45" />
      <path d={`M${cx} ${cy}L${p1[0]} ${p1[1]}L${p2[0]} ${p2[1]}Z`} fill="currentColor" fillOpacity=".16" />
      <circle cx={cx} cy={cy} r="2.6" fill="currentColor" />
    </svg>
  );
}

/** Read-only slot, used when uploads are off: still shows which photo we need. */
export function ShotHint(s: Shot) {
  return (
    <div className="bf-shot" style={{ cursor: "default" }}>
      <Plan {...s} />
      <span>{s.label}</span>
    </div>
  );
}

/** Photo tiles for one group. With shots, every requested angle gets its own empty slot that fills in order. */
export function PhotoSlots({ group, photos, shots = [], accept = "image/*" }: { group: string; photos: ReturnType<typeof usePhotos>; shots?: Shot[]; accept?: string }) {
  const [over, setOver] = useState(false);
  const mine = photos.items.filter((x) => x.group === group);
  const pick = (label: string) => (
    <input type="file" accept={accept} multiple aria-label={label} disabled={photos.enabled === null}
      onChange={(e) => { if (e.target.files) photos.add(group, e.target.files); e.target.value = ""; }} />
  );
  return (
    <div
      className="bf-shots"
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); photos.add(group, e.dataTransfer.files); }}
    >
      {mine.map((x, i) => (
        <figure key={x.id} className={`bf-shot full${x.error ? " bad" : ""}`} title={x.error ?? x.name} style={{ margin: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={x.preview} alt="" />
          {!x.url && !x.error && <span className="bar"><i style={{ width: `${x.progress}%` }} /></span>}
          <figcaption>{x.error ?? shots[i]?.label ?? "Zusätzlich"}</figcaption>
          <button type="button" className="x" aria-label={`${x.name} entfernen`} onClick={() => photos.remove(x.id)}>×</button>
        </figure>
      ))}
      {shots.slice(mine.length).map((s) => (
        <label key={s.label} className={`bf-shot${over ? " over" : ""}`}>
          <Plan {...s} />
          <span>{s.label}</span>
          {pick(`${group}: ${s.label}`)}
        </label>
      ))}
      <label className="bf-shot add">
        {mine.length || shots.length ? "+ Weitere Fotos" : "+ Dateien auswählen"}
        {pick(`Weitere Fotos für ${group}`)}
      </label>
    </div>
  );
}

/** Contact block, consent and submit, shared by both forms. */
export function Submit({
  kind, n, answers, photos, button, onDone,
}: { kind: BriefingKind; n: number; answers: () => Briefing["answers"]; photos: ReturnType<typeof usePhotos>; button: string; onDone: (r: DoneInfo) => void }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone2, setPhone2] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending">("idle");
  const isMail = contact.includes("@");

  const data = useMemo<Briefing>(() => ({
    kind, answers: [], photos: [], name: name.trim(),
    email: isMail ? contact.trim() : "", phone: isMail ? phone2.trim() : contact.trim(), consent, website: hp,
  }), [kind, name, contact, phone2, consent, hp, isMail]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body: Briefing = { ...data, answers: answers(), photos: photos.done };
    const errs: Record<string, string> = {};
    if (!body.name) errs.name = "Bitte geben Sie Ihren Namen an.";
    if (!body.email && !body.phone) errs.contact = "Bitte geben Sie eine Telefonnummer oder E-Mail an.";
    if (!consent) errs.consent = "Bitte stimmen Sie der Datenschutzerklärung zu.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(errs.name ? "c-name" : errs.contact ? "c-contact" : "c-consent")?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/briefing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) { onDone({ id: j.id, mail: false, photos: body.photos.length }); window.scrollTo({ top: 0 }); return; }
      if (res.status === 422 && j.errors) { setErrors(j.errors); setState("idle"); return; }
      if (j.fallback) {
        const text = summarizeBriefing(body).slice(0, 1800);
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`${kind === "website" ? "Website-Fragebogen" : "Roomtour-Auftrag"}: ${body.name}`)}&body=${encodeURIComponent(text)}`;
        onDone({ id: "", mail: true, photos: body.photos.length }); window.scrollTo({ top: 0 }); return;
      }
      throw new Error(j.error);
    } catch {
      setErrors({ form: "Das hat nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an." });
      setState("idle");
    }
  }

  return (
    <form onSubmit={send} noValidate>
      <section className="bf-sec" aria-labelledby={`sec-${n}`}>
        <div className="bf-sec__h">
          <b>{n}</b>
          <h2 id={`sec-${n}`}>Ihre Kontaktdaten</h2>
          <p className="bf-intro">Wir melden uns innerhalb von 24 Stunden mit Ihrem Festpreis.</p>
        </div>
        <div className="bf-qs">
          <div className="bf-q half">
            <label htmlFor="c-name">Ihr Name</label>
            <input id="c-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} />
            {errors.name && <p className="bf-err" id="e-name">{errors.name}</p>}
          </div>
          <div className="bf-q half">
            <label htmlFor="c-contact">Telefon oder E-Mail</label>
            <input id="c-contact" type="text" autoComplete="email" inputMode="email" value={contact} onChange={(e) => setContact(e.target.value)} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "e-contact" : undefined} />
            {errors.contact && <p className="bf-err" id="e-contact">{errors.contact}</p>}
          </div>
          {isMail && (
            <div className="bf-q half">
              <label htmlFor="c-phone">Telefon (optional)</label>
              <input id="c-phone" type="tel" autoComplete="tel" value={phone2} onChange={(e) => setPhone2(e.target.value)} />
            </div>
          )}
          <div className="bf-hp" aria-hidden="true">
            <label>Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label>
          </div>
          <div className="bf-q">
            <label className="bf-consent" style={{ fontWeight: 400, color: "var(--text)" }}>
              <input id="c-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!errors.consent} />
              <span>Ich bin einverstanden, dass FOAV meine Angaben und Fotos zur Bearbeitung des Auftrags speichert.</span>
            </label>
            <p className="bf-small" style={{ margin: "8px 0 0 34px" }}><a href="/datenschutz" target="_blank">Datenschutzerklärung lesen</a></p>
            {errors.consent && <p className="bf-err">{errors.consent}</p>}
          </div>
          <div className="bf-q">
            <div className="bf-submit">
              <button className="bf-btn" type="submit" disabled={state === "sending" || photos.busy}>
                {state === "sending" ? "Wird gesendet …" : photos.busy ? "Fotos werden hochgeladen …" : button}
              </button>
              <span className="bf-small">Unverbindlich. Sie zahlen erst, wenn Sie den Festpreis bestätigen.</span>
            </div>
            {errors.form && <p className="bf-err" role="alert">{errors.form}</p>}
            <p className="bf-call" style={{ marginTop: 28 }}>
              Lieber telefonieren?
              {site.founders.map((f) => (
                <a key={f.phone} href={`tel:${f.phone.replace(/\s+/g, "")}`}>{f.name.split(" ")[0]} {f.phone}</a>
              ))}
            </p>
          </div>
        </div>
      </section>
    </form>
  );
}

export type DoneInfo = { id: string; mail: boolean; photos: number };

/** Thank-you screen that replaces the whole form after sending. */
export function Done({ kind, id, mail, photos }: DoneInfo & { kind: BriefingKind }) {
  return (
    <div className="bf-done" role="status">
      <h1>{mail ? "Fast geschafft." : "Danke, ist angekommen."}</h1>
      {mail ? (
        <p className="bf-lead">Ihr E-Mail-Programm hat sich mit allen Angaben geöffnet. Bitte dort noch auf Senden tippen{kind === "roomtour" ? " und die Fotos an die E-Mail anhängen" : ""}.</p>
      ) : (
        <p className="bf-lead">
          Wir melden uns innerhalb von 24 Stunden mit Ihrem Festpreis und dem Zahlungslink.
          {photos > 0 && ` ${photos} ${photos === 1 ? "Foto ist" : "Fotos sind"} dabei.`} {id && <>Ihre Referenz: <code>{id}</code></>}
        </p>
      )}
      <a className="bf-btn" href="/">Zur Startseite</a>
    </div>
  );
}
