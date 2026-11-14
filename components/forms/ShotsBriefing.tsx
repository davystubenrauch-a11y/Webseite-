"use client";

import { useState } from "react";
import { Done, PhotoSlots, Question, Sec, Shell, Submit, useDraft, usePhotos, usePrefill, type DoneInfo, type Section, type Values } from "./Briefing";

// Order form for KI-Shots: package, where the pictures are used, product photos, style, branding.
// After saving, the package lands in the cart (/shop?shots=…&ref=FOAV-…) and is paid there.

export const shotPackages = {
  Starter: { price: "199 €", photos: 5, clips: "1 Werbeclip (5 Sekunden, Hochformat)", products: 1, time: "48 Stunden", maxUpload: 10 },
  Pro: { price: "449 €", photos: 12, clips: "3 Werbeclips (5 bis 10 Sekunden) in 9:16 und 16:9", products: 3, time: "72 Stunden", maxUpload: 10 },
  "Brand-Paket": { price: "899 €", photos: 25, clips: "6 Werbeclips plus 1 Spot (15 Sekunden) mit Musik, Logo und Untertiteln, alle Formate", products: 6, time: "72 Stunden", maxUpload: 20 },
} as const;
type Tier = keyof typeof shotPackages;

const sections: Section[] = [
  {
    title: "Paket und Unternehmen",
    intro: "Den Preis sehen Sie sofort. Unsicher? Wählen Sie „Noch unsicher“, dann empfehlen wir Ihnen ein Paket.",
    questions: [
      { id: "paket", label: "Paket", type: "one", req: true, options: ["Starter|5 Fotos + 1 Clip, 199 €", "Pro|12 Fotos + 3 Clips, 449 €", "Brand-Paket|25 Fotos + 6 Clips + Spot, 899 €", "Noch unsicher|wir empfehlen Ihnen eines"] },
      { id: "firma", label: "Name Ihres Unternehmens", type: "text", placeholder: "z. B. Café Sonne, SPIRULI, Goldschmiede Huber", half: true, req: true },
      { id: "branche", label: "Branche", type: "one", req: true, options: ["Restaurant / Café", "Getränke / Lebensmittel", "Laden / Onlineshop", "Kosmetik / Beauty", "Mode / Schmuck", "Handwerk / Manufaktur", "Räume / Immobilien", "Dienstleistung", "Sonstiges"] },
      { id: "link", label: "Ihre Website oder Instagram (optional)", type: "url", placeholder: "https://…", half: true, hint: "Dort sehen wir Ihren Stil und Ihre Farben." },
    ],
  },
  {
    title: "Was sollen wir in Szene setzen?",
    intro: "Ein Produkt, ein Gericht oder ein Raum ist ein Motiv. Wie viele Motive Ihr Paket enthält, steht beim Paket.",
    questions: [
      { id: "motive", label: "Ihre Motive, eins pro Zeile", type: "textarea", req: true, placeholder: "z. B.\nSPIRULI Dose Holunder\nSPIRULI Dose Orange\nFrühstücksteller „Sonne“" },
      { id: "anzahl", label: "Anzahl der Motive", type: "number", placeholder: "z. B. 2", half: true, req: true },
      { id: "exakt", label: "Was muss genau so bleiben?", type: "textarea", req: true, placeholder: "z. B. Logo und Schrift auf der Dose, Farbe des Deckels, Form der Flasche, Anordnung auf dem Teller", hint: "KI darf Licht und Umgebung neu erfinden, aber nie Ihr Produkt. Alles, was ein Kunde im Laden vergleichen würde, gehört hierher." },
      { id: "nicht", label: "Was darf nicht zu sehen sein? (optional)", type: "text", placeholder: "z. B. Alkohol, Personen, andere Marken, Plastik" },
    ],
  },
  {
    title: "Wo zeigen Sie die Bilder?",
    intro: "Jede Plattform schneidet anders zu. Wenn wir das vorher wissen, sitzt Ihr Produkt in jedem Format richtig und nichts Wichtiges wird abgeschnitten.",
    questions: [
      { id: "plattformen", label: "Einsatzbereich (mehrere möglich)", type: "many", req: true, options: ["Instagram Reels / TikTok|Hochformat 9:16, Clips", "Instagram-Beitrag|4:5, Fotos", "Website-Header|Querformat 16:9", "Google-Unternehmensprofil|Fotos und kurzes Video", "Onlineshop / Speisekarte|ruhiger Hintergrund, 1:1", "Werbeanzeigen|Meta, Google, alle Formate"] },
      { id: "hauptformat", label: "Wichtigstes Format für die Clips", type: "one", options: ["Hochformat 9:16 (Handy, Social Media)", "Querformat 16:9 (Website, YouTube)", "Beides gleich wichtig"], hint: "Starter enthält einen Clip im Hochformat. Pro und Brand-Paket liefern beide Formate." },
    ],
  },
  {
    title: "Stil, Stimmung und Umgebung",
    questions: [
      { id: "stil", label: "Bildwelt", type: "one", req: true, options: ["Clean Studio|minimalistisch, heller Hintergrund", "Warm & Gastronomie|Holz, Tageslicht, appetitlich", "Luxus & dunkler Schiefer|dramatisches Licht, edel", "Natürliches Tageslicht|draußen, Architektur, echt", "Entscheiden Sie|wir wählen passend zu Ihrer Marke"] },
      { id: "stil_wunsch", label: "Eigene Wünsche zur Umgebung (optional)", type: "textarea", placeholder: "z. B. auf Marmor mit frischen Zitronen, Bergpanorama im Hintergrund, Kondenswasser auf der Flasche" },
      { id: "beispiel", label: "Beispiel, das Ihnen gefällt (optional)", type: "url", placeholder: "Link zu einem Bild, Video oder Instagram-Account", hint: "Hilft uns mehr als jede Beschreibung." },
      { id: "kamera", label: "Bewegung in den Clips", type: "one", options: ["Ruhig und edel", "Dynamisch und schnell", "Entscheiden Sie"], half: true },
      { id: "ton", label: "Ton in den Clips", type: "one", options: ["Ohne Ton (für eigene Musik)", "Mit lizenzfreier Musik"], half: true, hint: "Im Brand-Paket ist der Spot immer mit Musik." },
    ],
  },
  {
    title: "Branding und Extras",
    questions: [
      { id: "farben", label: "Ihre Markenfarben (optional)", type: "text", placeholder: "z. B. Petrol und Gold, oder #0F4C4A", half: true },
      { id: "overlays", label: "Text-Einblendungen in den Clips", type: "one", req: true, options: ["Ja, kurze Texte oder Untertitel", "Nein, ohne Text"], half: true, hint: "Text-Einblendungen gibt es ab Pro. Bei Starter liefern wir den Clip ohne Text." },
      { id: "texte", label: "Texte für die Einblendungen (optional)", type: "textarea", placeholder: "z. B. „Neu: Holunder“ · „Natürliche Energie“ · „Jetzt im Laden“", hint: "Genau so, wie es im Bild stehen soll. Leer lassen, dann schlagen wir Texte vor." },
      { id: "ki_hinweis", label: "Kennzeichnung „Mit KI erstellt“", type: "one", req: true, options: ["Ja, dezent im Bild (empfohlen)", "Nein, ich kennzeichne selbst beim Posten"], hint: "Realistische KI-Bilder und -Videos müssen erkennbar sein (EU-KI-Verordnung). Instagram und TikTok bieten dafür auch ein eigenes Label." },
    ],
  },
];

const tips = [
  "Das ganze Produkt ist zu sehen, nichts abgeschnitten",
  "Scharf: Handy kurz ruhig halten, auf das Produkt tippen",
  "Tageslicht am Fenster, kein Blitz",
  "Logo und Schrift gut lesbar, gerade von vorn",
  "Zusätzlich ein Foto schräg und eins von der Seite",
  "Ruhiger Hintergrund reicht, eine weiße Wand ist ideal",
  "Kein Filter, kein Porträtmodus, nicht per WhatsApp verschickt",
  "Kein Studio, keine Spezialausrüstung nötig, jedes Handy reicht",
];

const tierOf = (v: Values): Tier | null => {
  const p = String(v.paket ?? "").split("|")[0];
  return p in shotPackages ? (p as Tier) : null;
};

export default function ShotsBriefing() {
  const [v, setV] = useState<Values>({});
  const [done, setDone] = useState<DoneInfo | null>(null);
  const set = (id: string, value: string | string[]) => setV((o) => ({ ...o, [id]: value }));
  const photos = usePhotos("shots");
  useDraft("shots", { v }, (d) => { if (d.v) setV((o) => ({ ...d.v, ...o })); });
  usePrefill(sections, set);

  const tier = tierOf(v);
  const pk = tier ? shotPackages[tier] : null;
  const product = photos.done.filter((x) => x.group === "Produktfotos").length;
  const wantsText = String(v.overlays ?? "").startsWith("Ja");

  const pay = () => (tier ? { href: `/shop?shots=${tier === "Brand-Paket" ? "Brand" : tier}`, label: `KI-Shots ${tier} für ${shotPackages[tier].price}` } : null);

  // Everything we need to start without asking back.
  const missing = () => {
    const out = sections.flatMap((s) => s.questions).filter((q) => q.req && !(Array.isArray(v[q.id]) ? (v[q.id] as string[]).length : String(v[q.id] ?? "").trim())).map((q) => ({ id: `q-${q.id}`, label: q.label }));
    const n = Number(v.anzahl) || 0;
    if (pk && n > pk.products) out.push({ id: "q-anzahl", label: `${tier} enthält bis ${pk.products} ${pk.products === 1 ? "Motiv" : "Motive"}, Sie haben ${n}. Bitte größeres Paket wählen` });
    if (photos.enabled) {
      if (product < 3) out.push({ id: "up-fotos", label: `Produktfotos (${product} von mind. 3)` });
      if (pk && product > pk.maxUpload) out.push({ id: "up-fotos", label: `Höchstens ${pk.maxUpload} Fotos für ${tier} (jetzt ${product})` });
      if ((tier === "Brand-Paket" || (wantsText && tier !== "Starter")) && !photos.done.some((x) => x.group === "Logo")) out.push({ id: "up-logo", label: "Logo (für Einblendungen und Spot)" });
    }
    return out;
  };

  const answers = () => [
    ...sections.flatMap((s) => s.questions.map((q) => {
      const raw = v[q.id];
      return { section: s.title, label: q.label, value: Array.isArray(raw) ? raw.join(", ") : raw ?? "" };
    })),
    { section: "Fotos", label: "Hochgeladen", value: `${product} Produktfotos, ${photos.done.length - product} weitere Dateien` },
  ];

  return (
    <Shell
      title="KI-Shots: aus Handyfotos werden Werbebilder."
      lead="Sie fotografieren Ihr Produkt mit dem Handy, wir machen daraus Studio-Fotos und kurze Werbeclips für Instagram, TikTok, Ihre Website und Google. Sechs kurze Schritte, etwa 10 Minuten. Ihre Angaben bleiben in diesem Browser gespeichert, falls Sie zwischendurch aufhören."
      steps={[
        ["Paket und Fotos", "3 bis 10 normale Handyfotos reichen."],
        ["In den Warenkorb, bezahlen", "Direkt im Anschluss, sicher über Stripe."],
        ["Ergebnis erhalten", "Starter in 48 Stunden, Pro und Brand-Paket in 72 Stunden, als Download-Link."],
        ["Gemeinsam anpassen", "Passt etwas nicht, ändern wir es mit Ihnen."],
      ]}
      done={done && <Done kind="shots" {...done} />}
    >
      {sections.map((s, i) => (
        <Sec key={s.title} n={i + 1} title={s.title} intro={s.intro}>
          {s.questions.map((q) => <Question key={q.id} q={q} value={v[q.id]} onChange={(x) => set(q.id, x)} />)}
          {i === 0 && (
            <div className="bf-q" aria-live="polite">
              <div className="bf-quote">
                <span className="bf-price">{pk ? pk.price : "ab 199 €"}</span>
                <span>{pk ? `${pk.photos} Studio-Fotos, ${pk.clips}, bis ${pk.products} ${pk.products === 1 ? "Motiv" : "Motive"}, fertig in ${pk.time}.` : "Starter 199 €, Pro 449 €, Brand-Paket 899 €. Festpreis, ohne Abo."}</span>
              </div>
            </div>
          )}
        </Sec>
      ))}

      <Sec n={sections.length + 1} title="Ihre Fotos" intro="3 bis 10 normale Handyfotos, bei mehreren Motiven von jedem mindestens zwei. Studio oder Profikamera brauchen Sie nicht.">
        <div className="bf-q bf-panel">
          <h3>So wird das Ausgangsfoto gut</h3>
          <ul className="bf-tips">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        {photos.enabled === false ? (
          <p className="bf-q bf-off">Den Upload schalten wir gerade frei. Schicken Sie uns die Fotos und Ihr Logo nach dem Absenden bitte per E-Mail an info@foav.de, gern mit dem Produktnamen im Dateinamen.</p>
        ) : (
          <>
            <div className="bf-q" id="up-fotos" tabIndex={-1}>
              <span className="lab">Produktfotos<span className="bf-req">Pflicht</span></span>
              <p className="bf-hint">{product} hochgeladen{pk ? `, bis ${pk.maxUpload} möglich` : ""}. JPG, PNG oder HEIC direkt vom Handy, bis 25 MB pro Foto.</p>
              <PhotoSlots group="Produktfotos" photos={photos} />
            </div>
            <div className="bf-q" id="up-logo" tabIndex={-1}>
              <span className="lab">Logo {tier === "Brand-Paket" || (wantsText && tier !== "Starter") ? <span className="bf-req">Pflicht</span> : "(optional)"}</span>
              <p className="bf-hint">Am besten als PNG mit transparentem Hintergrund, SVG oder PDF. Für Einblendungen, Abspann und den Spot im Brand-Paket.</p>
              <PhotoSlots group="Logo" photos={photos} accept="image/*,.pdf,.svg" />
            </div>
            <div className="bf-q">
              <span className="lab">Weitere Unterlagen (optional)</span>
              <p className="bf-hint">z. B. Speisekarte, Etikett als Datei, Styleguide oder Beispielbilder.</p>
              <PhotoSlots group="Unterlagen" photos={photos} accept="image/*,.pdf" />
            </div>
          </>
        )}
      </Sec>

      <Sec n={sections.length + 2} title="Zusammenfassung" intro="Prüfen Sie kurz, ob alles stimmt. Bezahlt wird erst im nächsten Schritt.">
        <div className="bf-q bf-panel" aria-live="polite">
          <h3>{tier ? `KI-Shots ${tier}` : "Paket noch offen"}</h3>
          <ul className="bf-tips">
            <li>{pk ? `${pk.photos} Studio-Fotos in hoher Auflösung` : "Wir empfehlen Ihnen ein Paket"}</li>
            <li>{pk ? pk.clips : "Festpreis, bevor Sie etwas bezahlen"}</li>
            <li>Formate: {Array.isArray(v.plattformen) && v.plattformen.length ? (v.plattformen as string[]).map((x) => x.split("|")[0]).join(", ") : "noch nicht gewählt"}</li>
            <li>Bildwelt: {String(v.stil ?? "noch nicht gewählt").split("|")[0]}</li>
            <li>Fotos: {product} hochgeladen</li>
            <li>Lieferung: {pk ? `${pk.time} nach Zahlung, per Download-Link` : "nach Absprache"}</li>
          </ul>
          <p className="bf-small" style={{ marginTop: 12 }}>{pk ? `Preis: ${pk.price} (Endpreis, gemäß § 19 UStG ohne Umsatzsteuer). Kein Abo, volle Nutzungsrechte für Ihr Unternehmen.` : "Ohne Paket melden wir uns innerhalb von 24 Stunden mit einer Empfehlung."}</p>
        </div>
      </Sec>

      <Submit kind="shots" n={sections.length + 3} answers={answers} photos={photos} button="Angaben senden" onDone={setDone} pay={pay} missing={missing} />
    </Shell>
  );
}
