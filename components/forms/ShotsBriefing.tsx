"use client";

import { useState } from "react";
import { Done, PhotoSlots, Question, Sec, Shell, Submit, useDraft, usePhotos, usePrefill, type DoneInfo, type Section, type Values } from "./Briefing";

// Order form for KI-Werbevideos (cafés, restaurants, shops; real estate is under Renderings): package, scenes,
// mood, music, texts, photos. After saving, the package lands in the cart (/shop?shots=…&ref=FOAV-…).

export const shotPackages = {
  Starter: { price: "199 €", films: "1 Werbefilm (10 bis 15 Sekunden, Hochformat 9:16)", stills: 3, scenes: 1, time: "48 Stunden", maxUpload: 10 },
  Pro: { price: "449 €", films: "3 Werbefilme (je 10 bis 20 Sekunden), jeder in 9:16 und 16:9", stills: 6, scenes: 3, time: "72 Stunden", maxUpload: 15 },
  "Brand-Paket": { price: "899 €", films: "1 Hauptfilm bis 30 Sekunden und 5 Kurzfilme, alle Formate, mit Logo-Abspann", stills: 12, scenes: 6, time: "72 Stunden", maxUpload: 25 },
} as const;
type Tier = keyof typeof shotPackages;

const sections: Section[] = [
  {
    title: "Paket und Unternehmen",
    intro: "Den Preis sehen Sie sofort. Unsicher? Wählen Sie „Noch unsicher“, dann empfehlen wir Ihnen ein Paket.",
    questions: [
      { id: "paket", label: "Paket", type: "one", req: true, options: ["Starter|1 Werbefilm, 199 €", "Pro|3 Werbefilme, 449 €", "Brand-Paket|Hauptfilm + 5 Kurzfilme, 899 €", "Noch unsicher|wir empfehlen Ihnen eines"] },
      { id: "firma", label: "Name Ihres Unternehmens", type: "text", placeholder: "z. B. Café Sonne", half: true, req: true },
      { id: "branche", label: "Branche", type: "one", req: true, options: ["Café / Bäckerei", "Restaurant / Bar", "Ferienwohnung / Hotel", "Laden / Boutique", "Beauty / Friseur", "Handwerk / Manufaktur", "Sonstiges"] },
      { id: "link", label: "Ihre Website oder Instagram (optional)", type: "url", placeholder: "https://…", half: true, hint: "Dort sehen wir Ihren Stil und Ihre Farben." },
    ],
  },
  {
    title: "Was soll der Film zeigen?",
    intro: "Ein Raum, ein Produkt oder ein Gericht ist eine Szene. Wie viele Szenen Ihr Paket enthält, steht beim Paket.",
    questions: [
      { id: "motive", label: "Ihre Szenen, eine pro Zeile", type: "textarea", req: true, placeholder: "z. B.\nGastraum mit Fensterplätzen\nApfelkuchen an der Theke\nCappuccino am Fenster" },
      { id: "anzahl", label: "Anzahl der Szenen (optional)", type: "number", placeholder: "z. B. 3", half: true },
      { id: "ziel", label: "Was sollen Zuschauer danach tun?", type: "one", req: true, options: ["Vorbeikommen", "Tisch reservieren", "Termin buchen", "Online kaufen", "Anrufen"], hint: "Daraus wird die Aufforderung auf der Schlusstafel, z. B. „Jetzt vorbeikommen“." },
      { id: "exakt", label: "Was muss genau so bleiben? (optional)", type: "textarea", placeholder: "z. B. Logo auf der Tasse, Form des Kuchens, Farbe der Wand", hint: "Die KI darf Licht, Stimmung und Kamera gestalten, aber nie Ihre Räume oder Produkte verändern." },
      { id: "nicht", label: "Was darf nicht zu sehen sein? (optional)", type: "text", placeholder: "z. B. Personen, Alkohol, andere Marken, Baustelle nebenan" },
    ],
  },
  {
    title: "Stimmung, Musik und Plattform",
    questions: [
      { id: "stimmung", label: "Stimmung", type: "one", req: true, options: ["Gemütlich und warm|Lampenlicht, Holz, Ruhe", "Hell und frisch|Tageslicht, klar, freundlich", "Edel und ruhig|dunkel, elegant, wenig Bewegung", "Entscheiden Sie|passend zu Ihrem Betrieb"] },
      { id: "musik", label: "Musik", type: "one", req: true, options: ["Ruhig (Klavier, Gitarre)", "Modern und lebendig", "Nur Raumklang, keine Musik", "Entscheiden Sie"], half: true },
      { id: "plattformen", label: "Wo zeigen Sie die Filme? (mehrere möglich)", type: "many", req: true, options: ["Instagram Reels / TikTok|Hochformat 9:16", "Website|Querformat 16:9", "Google-Unternehmensprofil", "YouTube|Querformat 16:9", "Werbeanzeigen|Meta, Google"] },
      { id: "beispiel", label: "Beispiel, das Ihnen gefällt (optional)", type: "url", placeholder: "Link zu einem Video oder Instagram-Account", hint: "Hilft uns mehr als jede Beschreibung." },
    ],
  },
  {
    title: "Texte und Abschluss",
    questions: [
      { id: "texte", label: "Texte im Film (optional)", type: "textarea", placeholder: "z. B. „Draußen grau.“ · „Drinnen Apfelkuchen.“", hint: "Kurz, eine Zeile pro Szene. Leer lassen, dann schreiben wir die Texte und Sie geben sie frei." },
      { id: "abschluss", label: "Schlusstafel", type: "text", placeholder: "z. B. Café Morgenrot · Täglich ab 7:30 Uhr · Vorbeikommen", hint: "Name, eine Info (Öffnungszeit oder Ort) und die Aufforderung. Leer lassen, dann schlagen wir sie vor." },
      { id: "farben", label: "Ihre Markenfarben (optional)", type: "text", placeholder: "z. B. Dunkelgrün und Creme", half: true },
      { id: "ki_hinweis", label: "Kennzeichnung „Mit KI erstellt“", type: "one", req: true, options: ["Ja, dezent im Film (empfohlen)", "Nein, ich kennzeichne selbst beim Posten"], hint: "Realistische KI-Videos müssen erkennbar sein (EU-KI-Verordnung). Instagram und TikTok bieten dafür auch ein eigenes Label." },
    ],
  },
];

const tips = [
  "Pro Raum oder Produkt 2 bis 3 Fotos aus verschiedenen Winkeln",
  "Räume aus einer Ecke in den Raum hinein, Gerichte von schräg oben",
  "Tageslicht, Lampen an, kein Blitz",
  "Aufgeräumt: Kabel, Putzmittel und Kassenzettel weg",
  "Keine Personen im Bild",
  "Gerade halten, Handy auf Brusthöhe",
  "Kein Filter, kein Porträtmodus, nicht per WhatsApp verschickt",
  "Jedes Handy reicht, Profikamera brauchen Sie nicht",
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
  const shots = photos.done.filter((x) => x.group === "Fotos").length;
  const immo = false;

  const pay = () => (tier ? { href: `/shop?shots=${tier === "Brand-Paket" ? "Brand" : tier}`, label: `KI-Werbevideos ${tier} für ${shotPackages[tier].price}` } : null);

  // Everything we need to start without asking back.
  const missing = () => {
    const out = sections.flatMap((s) => s.questions).filter((q) => q.req && !(Array.isArray(v[q.id]) ? (v[q.id] as string[]).length : String(v[q.id] ?? "").trim())).map((q) => ({ id: `q-${q.id}`, label: q.label }));
    const n = Number(v.anzahl) || String(v.motive ?? "").split("\n").filter((x) => x.trim()).length;
    if (pk && n > pk.scenes) out.push({ id: "q-anzahl", label: `${tier} enthält bis ${pk.scenes} ${pk.scenes === 1 ? "Szene" : "Szenen"}, Sie haben ${n}. Bitte größeres Paket wählen` });
    if (photos.enabled) {
      if (shots < 3) out.push({ id: "up-fotos", label: `Fotos (${shots} von mind. 3)` });
      if (pk && shots > pk.maxUpload) out.push({ id: "up-fotos", label: `Höchstens ${pk.maxUpload} Fotos für ${tier} (jetzt ${shots})` });
      if (tier === "Brand-Paket" && !photos.done.some((x) => x.group === "Logo")) out.push({ id: "up-logo", label: "Logo (für den Abspann)" });
    }
    return out;
  };

  const answers = () => [
    ...sections.flatMap((s) => s.questions.map((q) => {
      const raw = v[q.id];
      return { section: s.title, label: q.label, value: Array.isArray(raw) ? raw.join(", ") : raw ?? "" };
    })),
    { section: "Fotos", label: "Hochgeladen", value: `${shots} Fotos, ${photos.done.length - shots} weitere Dateien` },
  ];

  return (
    <Shell
      title="KI-Werbevideos: aus Ihren Fotos wird ein Werbefilm."
      lead="Sie fotografieren Ihr Café, Ihre Gerichte oder Ihren Laden mit dem Handy. Wir machen daraus kurze Werbefilme mit ruhigen Kamerafahrten, Musik und Text, fertig für Instagram, TikTok und Ihre Website. Etwa 5 Minuten, Pflicht sind nur die markierten Felder. Ihre Angaben bleiben in diesem Browser gespeichert, falls Sie zwischendurch aufhören."
      steps={[
        ["Paket und Fotos", "3 bis 10 normale Handyfotos reichen."],
        ["Bestellen und bezahlen", "Im Warenkorb bestellen. Bezahlt wird sicher online, die Rechnung kommt per E-Mail."],
        ["Film erhalten", "Starter in 48 Stunden, Pro und Brand-Paket in 72 Stunden, als Download-Link."],
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
                <span>{pk ? `${pk.films}, dazu ${pk.stills} Standbilder, bis ${pk.scenes} ${pk.scenes === 1 ? "Szene" : "Szenen"}, fertig in ${pk.time}.` : "Starter 199 €, Pro 449 €, Brand-Paket 899 €. Festpreis, ohne Abo."}</span>
              </div>
            </div>
          )}
        </Sec>
      ))}

      <Sec n={sections.length + 1} title="Ihre Fotos" intro="3 bis 10 normale Handyfotos. Je besser die Fotos zeigen, wie es bei Ihnen aussieht, desto echter wird der Film.">
        <div className="bf-q bf-panel">
          <h3>So werden die Fotos gut</h3>
          <ul className="bf-tips">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        {photos.enabled === false ? (
          <p className="bf-q bf-off">Den Upload schalten wir gerade frei. Schicken Sie uns die Fotos und Ihr Logo nach dem Absenden bitte per E-Mail an info@foav.de.</p>
        ) : (
          <>
            <div className="bf-q" id="up-fotos" tabIndex={-1}>
              <span className="lab">Fotos<span className="bf-req">Pflicht</span></span>
              <p className="bf-hint">{shots} hochgeladen{pk ? `, bis ${pk.maxUpload} möglich` : ""}. JPG, PNG oder HEIC direkt vom Handy, bis 25 MB pro Foto.</p>
              <PhotoSlots group="Fotos" photos={photos} />
            </div>
            <div className="bf-q" id="up-logo" tabIndex={-1}>
              <span className="lab">Logo {tier === "Brand-Paket" ? <span className="bf-req">Pflicht</span> : "(optional)"}</span>
              <p className="bf-hint">Am besten als PNG mit transparentem Hintergrund, SVG oder PDF. Für die Schlusstafel und den Abspann.</p>
              <PhotoSlots group="Logo" photos={photos} accept="image/*,.pdf,.svg" />
            </div>
            <div className="bf-q">
              <span className="lab">Weitere Unterlagen (optional)</span>
              <p className="bf-hint">z. B. Speisekarte, Flyer oder Beispielbilder.</p>
              <PhotoSlots group="Unterlagen" photos={photos} accept="image/*,.pdf" />
            </div>
          </>
        )}
      </Sec>

      <Sec n={sections.length + 2} title="Zusammenfassung" intro="Prüfen Sie kurz, ob alles stimmt. Bezahlt wird erst im nächsten Schritt.">
        <div className="bf-q bf-panel" aria-live="polite">
          <h3>{tier ? `KI-Werbevideos ${tier}` : "Paket noch offen"}</h3>
          <ul className="bf-tips">
            <li>{pk ? pk.films : "Wir empfehlen Ihnen ein Paket"}</li>
            <li>{pk ? `${pk.stills} Standbilder in hoher Auflösung` : "Festpreis, bevor Sie etwas bezahlen"}</li>
            <li>Stimmung: {String(v.stimmung ?? "noch nicht gewählt").split("|")[0]}</li>
            <li>Plattformen: {Array.isArray(v.plattformen) && v.plattformen.length ? (v.plattformen as string[]).map((x) => x.split("|")[0]).join(", ") : "noch nicht gewählt"}</li>
            <li>Fotos: {shots} hochgeladen</li>
            <li>Lieferung: {pk ? `${pk.time} nach Zahlung, per Download-Link` : "nach Absprache"}</li>
          </ul>
          <p className="bf-small" style={{ marginTop: 12 }}>{pk ? `Preis: ${pk.price} (Endpreis, gemäß § 19 UStG ohne Umsatzsteuer). Kein Abo, volle Nutzungsrechte für Ihr Unternehmen.` : "Ohne Paket melden wir uns innerhalb von 24 Stunden mit einer Empfehlung."}</p>
        </div>
      </Sec>

      <Submit kind="shots" n={sections.length + 3} answers={answers} photos={photos} button="Angaben senden" onDone={setDone} pay={pay} missing={missing} />
    </Shell>
  );
}
