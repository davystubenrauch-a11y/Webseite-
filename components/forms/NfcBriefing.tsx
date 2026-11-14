"use client";

import { useState } from "react";
import { Done, PhotoSlots, Question, Sec, Shell, Submit, useDraft, usePhotos, usePrefill, type DoneInfo, type Section, type Values } from "./Briefing";
import { customUnit, euro, shipping } from "@/lib/shop";

// Order form for NFC plates in the Custom Brand Edition: quantity, colour, Google profile, logo.
// After saving, the plates land in the cart (/shop?custom=N&ref=FOAV-…) and are paid there.

const sections: Section[] = [
  {
    title: "Ihre Platten",
    intro: "Schlichtes FOAV-Design mit Ihrem Logo statt der bunten Google-Platte. Ab 5 Stück günstiger.",
    questions: [
      { id: "anzahl", label: "Anzahl der Platten", type: "number", placeholder: "z. B. 5", half: true, req: true, hint: "1 bis 50 Stück. Ab 5 Stück 27,90 €, ab 10 Stück 24,90 € pro Platte." },
      { id: "farbe", label: "Farbe der Platte", type: "one", req: true, options: ["Schwarz|Logo hell, edel", "Weiß|Logo dunkel, freundlich", "Entscheiden Sie|passend zu Ihrem Logo"] },
      { id: "firma", label: "Name Ihres Unternehmens", type: "text", placeholder: "z. B. Café Sonne", half: true, req: true },
    ],
  },
  {
    title: "Ihr Google-Profil",
    intro: "Jede Platte führt direkt auf Ihre Google-Bewertungsseite. Den Link richten wir ein und testen ihn vor dem Versand.",
    questions: [
      { id: "google_name", label: "Ihr Betrieb, wie er bei Google heißt, mit Ort", type: "text", placeholder: "z. B. Café Sonne, Hauptstraße 5, München", req: true },
      { id: "google_link", label: "Link zu Ihrem Google-Profil (optional)", type: "url", placeholder: "https://maps.app.goo.gl/…", hint: "So finden Sie ihn: Google Maps öffnen, Ihren Betrieb antippen, „Teilen“, Link kopieren. Nur nötig, wenn es den Namen mehrfach gibt. Noch kein Google-Profil? Schreiben Sie es unten in die Wünsche, wir helfen beim Anlegen." },
    ],
  },
  {
    title: "Design",
    questions: [
      { id: "farben", label: "Ihre Markenfarben (optional)", type: "text", placeholder: "z. B. Dunkelgrün und Gold, oder #1F4D3A", half: true },
      { id: "text", label: "Kurzer Text unter dem Logo (optional)", type: "text", placeholder: "z. B. „Wie war's bei uns?“", half: true, hint: "Höchstens 30 Zeichen. Leer lassen, dann steht dort „Tippen für Bewertung“." },
      { id: "ort", label: "Wo kommen die Platten hin? (optional)", type: "many", options: ["Tische", "Theke / Kasse", "Rechnungsmappe", "Eingang", "Zimmer / Ferienwohnung", "Behandlungsraum"] },
      { id: "wunsch", label: "Weitere Wünsche (optional)", type: "textarea", placeholder: "z. B. Logo nur einfarbig, mehrere Standorte mit eigenem Google-Profil" },
    ],
  },
];

export default function NfcBriefing() {
  const [v, setV] = useState<Values>({});
  const [done, setDone] = useState<DoneInfo | null>(null);
  const set = (id: string, value: string | string[]) => setV((o) => ({ ...o, [id]: value }));
  const photos = usePhotos("nfc");
  useDraft("nfc", { v }, (d) => { if (d.v) setV((o) => ({ ...d.v, ...o })); });
  usePrefill(sections, set);

  const n = Math.floor(Number(v.anzahl) || 0);
  const ok = n >= 1 && n <= 50;
  const unit = customUnit(n);
  const sum = n * unit + (n > 0 && n < shipping.freeFrom ? shipping.price : 0);
  const pay = () => (ok ? { href: `/shop?custom=${n}`, label: `${n} NFC-${n === 1 ? "Platte" : "Platten"} mit Ihrem Logo für ${euro(n * unit)}` } : null);

  const missing = () => {
    const out = sections.flatMap((s) => s.questions).filter((q) => q.req && !String(v[q.id] ?? "").trim()).map((q) => ({ id: `q-${q.id}`, label: q.label }));
    if (String(v.anzahl ?? "").trim() && !ok) out.push({ id: "q-anzahl", label: "Anzahl zwischen 1 und 50 (mehr auf Anfrage)" });
    if (String(v.text ?? "").length > 30) out.push({ id: "q-text", label: "Text unter dem Logo: höchstens 30 Zeichen" });
    if (photos.enabled && !photos.done.some((x) => x.group === "Logo")) out.push({ id: "up-logo", label: "Logo hochladen" });
    return out;
  };

  const answers = () => [
    ...sections.flatMap((s) => s.questions.map((q) => {
      const raw = v[q.id];
      return { section: s.title, label: q.label, value: Array.isArray(raw) ? raw.join(", ") : raw ?? "" };
    })),
    { section: "Preis", label: "Summe laut Formular", value: ok ? `${n} × ${euro(unit)} = ${euro(n * unit)}${sum > n * unit ? ` + Versand ${euro(shipping.price)}` : ", versandkostenfrei"}` : "" },
  ];

  return (
    <Shell
      title="NFC-Platten mit Ihrem Logo."
      lead="Ein Antippen mit dem Handy öffnet Ihre Google-Bewertungsseite, wie bei der Classic-Platte. Statt des Google-Designs trägt die Platte Ihr Logo. Bevor wir produzieren, bekommen Sie eine Design-Vorschau zur Freigabe."
      steps={[
        ["Logo und Angaben", "Etwa 3 Minuten."],
        ["In den Warenkorb, bezahlen", "Sicher über Stripe."],
        ["Vorschau freigeben", "Innerhalb von 2 Werktagen per E-Mail. Änderungen inklusive."],
        ["Platten erhalten", "Nach Ihrer Freigabe produziert, getestet und per Post verschickt."],
      ]}
      done={done && <Done kind="nfc" {...done} />}
    >
      {sections.map((s, i) => (
        <Sec key={s.title} n={i + 1} title={s.title} intro={s.intro}>
          {s.questions.map((q) => <Question key={q.id} q={q} value={v[q.id]} onChange={(x) => set(q.id, x)} />)}
          {i === 0 && (
            <div className="bf-q" aria-live="polite">
              <div className="bf-quote">
                <span className="bf-price">{ok ? euro(n * unit) : "29,90 €"}</span>
                <span>{ok ? `${n} × ${euro(unit)}${n < shipping.freeFrom ? `, dazu ${euro(shipping.price)} Versand` : ", Versand kostenlos"}.` : "pro Platte, ab 5 Stück 27,90 €, ab 10 Stück 24,90 €."}</span>
              </div>
            </div>
          )}
        </Sec>
      ))}

      <Sec n={sections.length + 1} title="Ihr Logo" intro="Am besten als PNG mit transparentem Hintergrund, SVG oder PDF. Ein Foto vom Schild geht zur Not auch, dann zeichnen wir es nach.">
        {photos.enabled === false ? (
          <p className="bf-q bf-off">Den Upload schalten wir gerade frei. Schicken Sie uns Ihr Logo nach dem Absenden bitte per E-Mail an info@foav.de.</p>
        ) : (
          <div className="bf-q" id="up-logo" tabIndex={-1}>
            <span className="lab">Logo<span className="bf-req">Pflicht</span></span>
            <PhotoSlots group="Logo" photos={photos} accept="image/png,image/svg+xml,image/jpeg,image/webp,.svg,.pdf" />
          </div>
        )}
        <div className="bf-q bf-panel">
          <h3>So läuft es ab</h3>
          <ul className="bf-tips">
            <li>Nach der Zahlung gestalten wir Ihre Platte</li>
            <li>Vorschau per E-Mail innerhalb von 2 Werktagen</li>
            <li>Änderungen bis zur Freigabe inklusive</li>
            <li>Erst nach Ihrer Freigabe wird produziert</li>
            <li>Jede Platte wird vor dem Versand getestet</li>
            <li>Funktioniert mit iPhone und Android, ohne App</li>
          </ul>
        </div>
      </Sec>

      <Submit kind="nfc" n={sections.length + 2} answers={answers} photos={photos} button="Angaben senden" onDone={setDone} pay={pay} missing={missing} />
    </Shell>
  );
}
