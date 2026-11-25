"use client";

import { useState } from "react";
import { Done, PhotoSlots, Question, Sec, Shell, Submit, useDraft, usePhotos, usePrefill, type DoneInfo, type Section, type Values } from "./Briefing";

// Order form for Renderings: package, what should be shown, style, photos of today's state.
// After saving, the package lands in the cart (/shop?render=1|3|film&ref=FOAV-…).

export const renderPackages = {
  "1 Rendering": { key: "1", price: "49 €", what: "1 fotorealistisches Bild", images: 1, time: "48 Stunden", maxUpload: 6 },
  "3 Renderings": { key: "3", price: "119 €", what: "3 fotorealistische Bilder (3 Räume oder 3 Varianten)", images: 3, time: "48 Stunden", maxUpload: 12 },
  "Rundgang-Film": { key: "film", price: "199 €", what: "bis zu 3 Räume virtuell eingerichtet, als Rundgang-Film (15 bis 20 Sekunden) und als Bilder", images: 3, time: "72 Stunden", maxUpload: 12 },
} as const;
type Tier = keyof typeof renderPackages;

const sections: Section[] = [
  {
    title: "Paket und Projekt",
    intro: "Den Preis sehen Sie sofort. Unsicher? Wählen Sie „Noch unsicher“, dann empfehlen wir Ihnen ein Paket.",
    questions: [
      { id: "paket", label: "Paket", type: "one", req: true, options: ["1 Rendering|1 Bild, 49 €", "3 Renderings|3 Bilder, 119 €", "Rundgang-Film|bis 3 Räume als Film, 199 €", "Noch unsicher|wir empfehlen Ihnen eines"] },
      { id: "art", label: "Was möchten Sie zeigen? (optional)", type: "one", options: ["Leere Wohnung einrichten", "Umbau oder Renovierung", "Haus oder Fassade sanieren", "Neubau auf dem Grundstück", "Garten oder Terrasse", "Laden, Café oder Praxis gestalten", "Sonstiges"] },
      { id: "wofuer", label: "Wofür brauchen Sie die Bilder? (optional, mehrere möglich)", type: "many", options: ["Exposé oder Immobilienanzeige", "Vermieter, Bank oder Familie überzeugen", "Planung mit Handwerkern", "Website oder Social Media", "Für mich selbst"] },
      { id: "firma", label: "Unternehmen (optional)", type: "text", placeholder: "z. B. Immobilien Huber", half: true, hint: "Leer lassen, wenn Sie privat bestellen." },
    ],
  },
  {
    title: "Was soll zu sehen sein?",
    intro: "Ein Bild pro Zeile: welcher Raum und was sich ändern soll. Je genauer, desto besser passt das erste Ergebnis.",
    questions: [
      { id: "bilder", label: "Was soll sich ändern? Ein Bild pro Zeile", type: "textarea", req: true, placeholder: "z. B.\nWohnzimmer: gemütlich einrichten, Sofa an die lange Wand\nBad: neue Fliesen in Hellgrau, Dusche statt Wanne\nFassade: weiß verputzt, Fenster anthrazit" },
      { id: "stil", label: "Stil (optional)", type: "one", options: ["Modern und hell", "Warm und gemütlich|Holz, Naturtöne", "Edel und ruhig", "Skandinavisch", "Landhaus", "Entscheiden Sie"] },
      { id: "licht", label: "Licht", type: "one", options: ["Tageslicht", "Abendstimmung|warmes Lampenlicht", "Tag, Abend und Nacht|3 Bilder", "Entscheiden Sie"], half: true },
      { id: "format", label: "Format", type: "one", options: ["Querformat|Exposé, Website", "Hochformat|Instagram, Handy", "Beides"], half: true },
      { id: "bleiben", label: "Was muss genau so bleiben? (optional)", type: "textarea", placeholder: "z. B. Parkettboden, Kachelofen, Treppe", hint: "Wände, Fenster, Türen und Raumgröße lassen wir immer, wie sie sind. Nur was Sie beschreiben, ändert sich." },
      { id: "budget", label: "Gibt es Vorgaben? (optional)", type: "text", placeholder: "z. B. Möbel von IKEA, Fliesen Serie XY, Farbe nach RAL 7016" },
    ],
  },
  {
    title: "Kennzeichnung",
    questions: [
      { id: "hinweis", label: "Hinweis im Bild? (optional)", type: "one", options: ["Ja, „Visualisierung“ bzw. „virtuell eingerichtet“ ins Bild", "Nein, ich kennzeichne selbst"], hint: "In Immobilienanzeigen müssen virtuell eingerichtete Bilder als solche erkennbar sein. Ohne Angabe setzen wir den Hinweis klein ins Bild." },
    ],
  },
];

const tips = [
  "Aus einer Ecke in den Raum hinein, möglichst viel vom Raum sichtbar",
  "Handy auf Brusthöhe und gerade halten, normales Objektiv (1×), kein 0,5×",
  "Tageslicht, Licht an, kein Blitz",
  "Pro Raum 1 bis 2 Fotos aus verschiedenen Ecken",
  "Haus oder Fassade: von der Straße, ganzes Gebäude im Bild",
  "Neubau: Grundstück vom Rand aus, ganze Fläche im Bild; Plan, Skizze oder Beispielhaus als Foto dazu",
  "Kein Filter, nicht per WhatsApp verschickt",
];

const tierOf = (v: Values): Tier | null => {
  const p = String(v.paket ?? "").split("|")[0];
  return p in renderPackages ? (p as Tier) : null;
};

export default function RenderBriefing() {
  const [v, setV] = useState<Values>({});
  const [done, setDone] = useState<DoneInfo | null>(null);
  const set = (id: string, value: string | string[]) => setV((o) => ({ ...o, [id]: value }));
  const photos = usePhotos("render");
  useDraft("render", { v }, (d) => { if (d.v) setV((o) => ({ ...d.v, ...o })); });
  usePrefill(sections, set);

  const tier = tierOf(v);
  const pk = tier ? renderPackages[tier] : null;
  const shots = photos.done.filter((x) => x.group === "Fotos").length;
  const lines = String(v.bilder ?? "").split("\n").filter((x) => x.trim()).length;

  const pay = () => (tier ? { href: `/shop?render=${renderPackages[tier].key}`, label: `${tier} für ${renderPackages[tier].price}` } : null);

  const missing = () => {
    const out = sections.flatMap((s) => s.questions).filter((q) => q.req && !(Array.isArray(v[q.id]) ? (v[q.id] as string[]).length : String(v[q.id] ?? "").trim())).map((q) => ({ id: `q-${q.id}`, label: q.label }));
    if (pk && lines > pk.images) out.push({ id: "q-bilder", label: `${tier} enthält ${pk.images === 1 ? "1 Bild" : `bis zu ${pk.images} ${tier === "Rundgang-Film" ? "Räume" : "Bilder"}`}, Sie haben ${lines} Zeilen. Bitte größeres Paket wählen oder kürzen` });
    if (photos.enabled) {
      if (shots < 1) out.push({ id: "up-fotos", label: "Mindestens 1 Foto vom heutigen Zustand" });
      if (pk && shots > pk.maxUpload) out.push({ id: "up-fotos", label: `Höchstens ${pk.maxUpload} Fotos für ${tier} (jetzt ${shots})` });
    }
    return out;
  };

  const answers = () => [
    ...sections.flatMap((s) => s.questions.map((q) => {
      const raw = v[q.id];
      return { section: s.title, label: q.label, value: Array.isArray(raw) ? raw.join("; ") : raw ?? "" };
    })),
    { section: "Fotos", label: "Hochgeladen", value: `${shots} ${shots === 1 ? "Foto" : "Fotos"}, ${photos.done.length - shots} weitere ${photos.done.length - shots === 1 ? "Datei" : "Dateien"}` },
  ];

  return (
    <Shell
      title="Renderings: sehen, wie es fertig aussieht."
      lead="Sie fotografieren den heutigen Zustand mit dem Handy und beschreiben, was sich ändern soll. Wir machen daraus ein fotorealistisches Bild: die leere Wohnung eingerichtet, das Bad nach dem Umbau, das Haus nach der Sanierung. Pflicht sind nur 3 Dinge: Paket, ein Foto und ein Satz, was sich ändern soll. Alles andere ist freiwillig. Ihre Angaben bleiben in diesem Browser gespeichert, falls Sie zwischendurch aufhören."
      steps={[
        ["Paket und Foto", "Ein normales Handyfoto pro Raum reicht."],
        ["Bestellen und bezahlen", "Im Warenkorb bestellen. Bezahlt wird sicher online, die Rechnung kommt per E-Mail."],
        ["Bilder erhalten", "Bilder in 48 Stunden, Rundgang-Film in 72 Stunden, als Download-Link."],
        ["Korrektur", "Passt etwas nicht, korrigieren wir es mit Ihnen."],
      ]}
      done={done && <Done kind="render" {...done} />}
    >
      {sections.map((s, i) => (
        <Sec key={s.title} n={i + 1} title={s.title} intro={s.intro}>
          {s.questions.map((q) => <Question key={q.id} q={q} value={v[q.id]} onChange={(x) => set(q.id, x)} />)}
          {i === 0 && (
            <div className="bf-q" aria-live="polite">
              <div className="bf-quote">
                <span className="bf-price">{pk ? pk.price : "ab 49 €"}</span>
                <span>{pk ? `${pk.what}, mit Korrekturrunde, fertig in ${pk.time}.` : "1 Rendering 49 €, 3 Renderings 119 €, Rundgang-Film 199 €. Festpreis, ohne Abo."}</span>
              </div>
            </div>
          )}
        </Sec>
      ))}

      <Sec n={sections.length + 1} title="Ihre Fotos" intro="Ein Foto pro Raum oder Ansicht reicht. Gern zusätzlich Grundriss, Skizze oder Bilder, die Ihnen gefallen.">
        <div className="bf-q bf-panel">
          <h3>So werden die Fotos gut</h3>
          <ul className="bf-tips">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        {photos.enabled === false ? (
          <p className="bf-q bf-off">Den Upload schalten wir gerade frei. Schicken Sie uns die Fotos nach dem Absenden bitte per E-Mail an info@foav.de.</p>
        ) : (
          <>
            <div className="bf-q" id="up-fotos" tabIndex={-1}>
              <span className="lab">Fotos vom heutigen Zustand<span className="bf-req">Pflicht</span></span>
              <p className="bf-hint">{shots} hochgeladen{pk ? `, bis ${pk.maxUpload} möglich` : ""}. JPG, PNG oder HEIC direkt vom Handy, bis 25 MB pro Foto.</p>
              <PhotoSlots group="Fotos" photos={photos} />
            </div>
            <div className="bf-q">
              <span className="lab">Grundriss, Skizze oder Beispielbilder (optional)</span>
              <p className="bf-hint">z. B. ein Möbelstück, eine Fliese oder ein Raum, der Ihnen gefällt.</p>
              <PhotoSlots group="Unterlagen" photos={photos} accept="image/*,.pdf" />
            </div>
          </>
        )}
      </Sec>

      <Sec n={sections.length + 2} title="Zusammenfassung" intro="Prüfen Sie kurz, ob alles stimmt. Bezahlt wird erst im nächsten Schritt.">
        <div className="bf-q bf-panel" aria-live="polite">
          <h3>{tier ?? "Paket noch offen"}</h3>
          <ul className="bf-tips">
            <li>{pk ? pk.what : "Wir empfehlen Ihnen ein Paket"}</li>
            <li>Bilder beschrieben: {lines || "noch keine"}</li>
            <li>Stil: {String(v.stil ?? "noch nicht gewählt").split("|")[0]}</li>
            <li>Fotos: {shots} hochgeladen</li>
            <li>Korrektur: {tier === "3 Renderings" ? "1 Korrekturrunde je Bild" : "1 Korrekturrunde inklusive"}</li>
            <li>Lieferung: {pk ? `${pk.time} nach Zahlung, per Download-Link` : "nach Absprache"}</li>
          </ul>
          <p className="bf-small" style={{ marginTop: 12 }}>{pk ? `Preis: ${pk.price} (Endpreis, gemäß § 19 UStG ohne Umsatzsteuer). Kein Abo. Renderings sind Visualisierungen und ersetzen keine Bauplanung.` : "Ohne Paket melden wir uns innerhalb von 24 Stunden mit einer Empfehlung."}</p>
        </div>
      </Sec>

      <Submit kind="render" n={sections.length + 3} answers={answers} photos={photos} button="Angaben senden" onDone={setDone} pay={pay} missing={missing} />
    </Shell>
  );
}
