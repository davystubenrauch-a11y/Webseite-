"use client";

import { useState } from "react";
import { Done, PhotoSlots, ShotHint, Question, Sec, Shell, Submit, useDraft, usePhotos, usePrefill, type DoneInfo, type Section, type Shot, type Values } from "./Briefing";

const sections: Section[] = [
  {
    title: "Ihr Objekt",
    questions: [
      { id: "firma", label: "Name des Unternehmens oder Objekts", type: "text", placeholder: "z. B. Ferienwohnung Seeblick, Praxis Dr. Huber", half: true, req: true },
      { id: "ort_genau", label: "Adresse des Objekts", type: "text", placeholder: "nur für uns, erscheint nicht im Video", half: true },
      { id: "paket", label: "Paket", type: "one", options: ["Basis|bis 150 m², 349 €", "Premium|bis 300 m², 649 €", "Exklusiv|bis 600 m², 1.449 €", "Größer oder mehrere Objekte|Festpreis auf Anfrage"], req: true },
      { id: "art", label: "Was sollen wir zeigen?", type: "one", options: ["Ferienwohnung / Airbnb", "Hotel / Pension", "Immobilie (Verkauf oder Vermietung)", "Laden / Showroom", "Restaurant / Café", "Praxis / Studio", "Büro", "Sonstiges"], req: true },
      { id: "flaeche", label: "Fläche in m²", type: "number", placeholder: "z. B. 75", half: true, req: true },
      { id: "etagen", label: "Etagen im Video", type: "one", options: ["1", "2", "3 oder mehr"], half: true, req: true },
      { id: "ort", label: "Ort", type: "text", placeholder: "z. B. Garmisch", half: true },
      { id: "inserat", label: "Link zum Inserat oder zur Website (falls vorhanden)", type: "url", placeholder: "Airbnb, Immobilienportal, Google oder Ihre Website", half: true, hint: "Dort sehen wir weitere Fotos und Ihren Stil." },
    ],
  },
  {
    title: "So soll es wirken",
    questions: [
      { id: "stimmung", label: "Stimmung", type: "one", options: ["Ruhig und hell", "Modern", "Gemütlich", "Luxuriös", "Entscheiden Sie"], req: true },
      { id: "licht", label: "Lichtstimmung im Video", type: "one", options: ["Tageslicht, wie auf den Fotos", "Sonnig und warm", "Abendstimmung mit Lampen", "Entscheiden Sie"], req: true, hint: "Am besten fotografieren Sie alle Räume zur gleichen Tageszeit, dann wirkt das Video wie aus einem Guss." },
      { id: "tempo", label: "Tempo der Kamera", type: "one", options: ["Ruhig und langsam", "Mittel", "Dynamisch", "Entscheiden Sie"], half: true },
      { id: "kamera", label: "Art der Kamerafahrt", type: "one", options: ["Sanft durch die Räume gleiten", "Im Raum langsam umsehen", "Beides gemischt"], half: true },
      { id: "musik", label: "Musik", type: "one", options: ["Ruhig", "Modern und lebendig", "Elegant", "Ohne Musik", "Entscheiden Sie"] },
      { id: "musik_wunsch", label: "Nur Exklusiv: Musikwunsch oder Beispielvideo, das Ihnen gefällt", type: "text", placeholder: "Link zu YouTube, Instagram oder ein Musikstil" },
      { id: "hauptformat", label: "Wichtigstes Format", type: "one", options: ["Querformat (Website, Portale, YouTube)", "Hochformat (Instagram, TikTok, WhatsApp)", "Beide gleich wichtig"], hint: "Sie bekommen immer beide. Für das wichtigste Format richten wir die Bildausschnitte aus." },
    ],
  },
  {
    title: "Damit nichts falsch aussieht",
    intro: "Eine KI-Roomtour entsteht aus Ihren Fotos. Je genauer Sie uns sagen, was stimmen muss, desto echter wird das Video und desto weniger muss später geändert werden.",
    questions: [
      { id: "optimieren", label: "Was dürfen wir verbessern?", type: "many", options: ["Licht und Farben", "Himmel und Ausblick", "Kleinigkeiten aufräumen (Kabel, Handtücher, Papiere)", "Nichts verändern, alles genau wie auf den Fotos"], req: true },
      { id: "exakt", label: "Was muss genau so bleiben?", type: "textarea", placeholder: "z. B. Anzahl der Betten und Stühle, Bilder an der Wand, Farbe der Küche, Logo am Eingang, Blick auf den See", req: true, hint: "Alles, was ein Gast vor Ort sofort vergleichen würde." },
      { id: "material", label: "Boden, Wände und Farben", type: "text", placeholder: "z. B. Eichenparkett, weiße Wände, Küche in Salbeigrün", hint: "Hilft der KI, Materialien auch in Ecken richtig darzustellen, die auf den Fotos nur halb zu sehen sind." },
      { id: "nicht_zeigen", label: "Was darf nicht zu sehen sein?", type: "text", placeholder: "z. B. Hausnummer, Nachbarhaus, Fotos an der Wand, Personen, Abstellraum" },
      { id: "highlights", label: "Was sollen Ihre Kunden unbedingt sehen?", type: "textarea", placeholder: "z. B. Seeblick vom Balkon, Sauna, die neue Küche, Kamin", req: true },
      { id: "reihenfolge", label: "Reihenfolge des Rundgangs", type: "textarea", placeholder: "z. B. Eingang → Flur → Wohnzimmer → Küche → Schlafzimmer → Bad → Balkon", hint: "So führt die Kamera durch Ihre Räume, wie ein Gast sie betreten würde. Leer lassen, dann wählen wir die natürliche Reihenfolge anhand des Grundrisses." },
    ],
  },
  {
    title: "Texte, Logo, Kennzeichnung",
    questions: [
      { id: "raumnamen", label: "Raumnamen im Video", type: "one", options: ["Ja, einblenden", "Nein, ohne Raumnamen"], half: true },
      { id: "raumnamen_besonders", label: "Besondere Raumnamen (optional)", type: "text", placeholder: "z. B. Schlafzimmer „Seeblick“, Suite 2", half: true },
      { id: "einblendungen", label: "Eckdaten im Video (optional)", type: "textarea", placeholder: "z. B. 68 m², 2 Schlafzimmer, Balkon mit Seeblick, ab 89 € pro Nacht" },
      { id: "sprache", label: "Sprache der Einblendungen", type: "one", options: ["Deutsch", "Englisch", "Deutsch und Englisch (Exklusiv)"], half: true },
      { id: "farben", label: "Premium und Exklusiv: Ihre Farben", type: "text", placeholder: "z. B. Dunkelgrün und Gold, oder #1F4D3A", half: true },
      { id: "abspann", label: "Abspann: was soll am Ende stehen?", type: "text", placeholder: "z. B. Ferienwohnung Seeblick · seeblick-garmisch.de · 0171 2345678", req: true, hint: "Genau so, wie es im Video stehen soll. Bei Premium und Exklusiv kommt Ihr Logo dazu (unten hochladen)." },
      { id: "clips", label: "Premium und Exklusiv: Themen der Kurzclips", type: "text", placeholder: "z. B. Aussicht, Küche, Wellness. Leer lassen, dann wählen wir." },
      { id: "ki_hinweis", label: "Hinweis „Mit KI erstellt“ im Video", type: "one", options: ["Ja, dezent einblenden (empfohlen)", "Nein, ich kennzeichne selbst im Inserat"], req: true, hint: "Seit August 2026 müssen realistisch wirkende KI-Videos erkennbar sein (EU-KI-Verordnung)." },
      { id: "nutzung", label: "Wo zeigen Sie das Video?", type: "many", options: ["Airbnb", "Booking.com", "Immobilienportale", "Eigene Website", "Instagram / TikTok", "YouTube", "Google-Profil", "WhatsApp an Kunden"] },
    ],
  },
];

type Room = { id: string; name: string; shots: Shot[]; multi?: boolean };

// The photos we need per room, each with the camera position drawn as a small floor plan.
// Coordinates: x/y 0..1 inside the room, top wall = window; a = view direction in degrees (-90 = towards the window).
// The video model can only show what it has seen: every corner, every doorway from both sides and the view out.
const rooms: Room[] = [
  { id: "flur", name: "Eingang und Flur", shots: [
    { label: "Haustür von außen", x: 0.5, y: 0.95, a: -90 },
    { label: "Von der Tür hinein", x: 0.2, y: 0.9, a: -60 },
    { label: "Mitte des Flurs, nach vorn", x: 0.5, y: 0.5, a: -90 },
    { label: "Zurück zur Haustür", x: 0.8, y: 0.15, a: 120 },
  ] },
  { id: "wohnen", name: "Wohnzimmer", shots: [
    { label: "Aus der Ecke an der Tür", x: 0.06, y: 0.92, a: -40 },
    { label: "Aus der Ecke gegenüber", x: 0.94, y: 0.08, a: 140 },
    { label: "Aus der dritten Ecke", x: 0.94, y: 0.92, a: -140 },
    { label: "Aus der vierten Ecke", x: 0.06, y: 0.08, a: 40 },
    { label: "Richtung Fenster", x: 0.5, y: 0.9, a: -90 },
    { label: "Ausblick aus dem Fenster", x: 0.5, y: 0.15, a: -90 },
    { label: "Die Tür von innen", x: 0.5, y: 0.2, a: 90 },
  ] },
  { id: "kueche", name: "Küche", shots: [
    { label: "Die ganze Küchenzeile", x: 0.5, y: 0.92, a: -90 },
    { label: "Vom Essplatz", x: 0.94, y: 0.5, a: 180 },
    { label: "Aus der Ecke an der Tür", x: 0.06, y: 0.92, a: -40 },
    { label: "Die Tür von innen", x: 0.5, y: 0.2, a: 90 },
    { label: "Ein schönes Detail", x: 0.5, y: 0.45, a: -90 },
  ] },
  { id: "schlafen", name: "Schlafzimmer", multi: true, shots: [
    { label: "Vom Fußende aufs Bett", x: 0.5, y: 0.92, a: -90 },
    { label: "Aus der Ecke an der Tür", x: 0.06, y: 0.92, a: -40 },
    { label: "Richtung Fenster", x: 0.94, y: 0.92, a: -130 },
    { label: "Vom Fenster zur Tür", x: 0.5, y: 0.1, a: 90 },
    { label: "Ein schönes Detail", x: 0.3, y: 0.4, a: -60 },
  ] },
  { id: "bad", name: "Bad", multi: true, shots: [
    { label: "Von der Tür in den Raum", x: 0.2, y: 0.92, a: -60 },
    { label: "Dusche oder Wanne", x: 0.5, y: 0.55, a: -90 },
    { label: "Waschtisch", x: 0.3, y: 0.5, a: 180 },
    { label: "Aus der Ecke zur Tür", x: 0.9, y: 0.1, a: 130 },
  ] },
  { id: "treppe", name: "Treppe", multi: true, shots: [
    { label: "Von unten nach oben", x: 0.5, y: 0.92, a: -90 },
    { label: "Von oben nach unten", x: 0.5, y: 0.08, a: 90 },
  ] },
  { id: "balkon", name: "Balkon oder Terrasse", multi: true, shots: [
    { label: "Von der Tür hinaus", x: 0.5, y: 0.95, a: -90 },
    { label: "Die ganze Fläche", x: 0.08, y: 0.9, a: -35 },
    { label: "Die Aussicht", x: 0.5, y: 0.4, a: -90 },
    { label: "Zurück zum Gebäude", x: 0.5, y: 0.1, a: 90 },
  ] },
  { id: "aussen", name: "Außen und Umgebung", shots: [
    { label: "Fassade von vorn", x: 0.5, y: 0.95, a: -90 },
    { label: "Fassade schräg", x: 0.1, y: 0.9, a: -45 },
    { label: "Eingang", x: 0.5, y: 0.6, a: -90 },
    { label: "Garten, Hof oder Straße", x: 0.5, y: 0.3, a: 90 },
  ] },
  { id: "extra", name: "Weitere Räume", multi: true, shots: [
    { label: "Überblick von der Tür", x: 0.06, y: 0.92, a: -40 },
    { label: "Gegenrichtung", x: 0.94, y: 0.08, a: 140 },
    { label: "Das Besondere", x: 0.5, y: 0.5, a: -90 },
  ] },
];

const tips = [
  "Handy quer halten, alle Fotos im gleichen Format",
  "Normale 1×-Kamera für alle Fotos, 0,5× nur für den Überblick",
  "Auf Brusthöhe (etwa 1,20 m), Kamera gerade, nicht kippen",
  "Tagsüber, alle Lampen an, Vorhänge auf, alle Räume zur gleichen Zeit",
  "Türen offen, damit man sieht, wie die Räume verbunden sind",
  "Jedes Foto zeigt ein Stück vom vorherigen, keine Lücken",
  "Aufgeräumt, ohne Personen und Haustiere, nicht in Spiegeln",
  "Kein Zoom, kein Filter, kein Porträt- oder Nachtmodus",
  "Originaldateien hochladen, nicht per WhatsApp verschickt",
];

const MIN_PER_ROOM = 3;
const slug = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-");

export default function RoomtourBriefing() {
  const [v, setV] = useState<Values>({});
  const [count, setCount] = useState<Record<string, number>>({ flur: 1, wohnen: 1, kueche: 1, schlafen: 1, bad: 1 });
  const [done, setDone] = useState<DoneInfo | null>(null);
  const set = (id: string, value: string | string[]) => setV((o) => ({ ...o, [id]: value }));
  const photos = usePhotos("roomtour");
  useDraft("roomtour", { v, count }, (d) => { if (d.v) setV((o) => ({ ...d.v, ...o })); if (d.count) setCount(d.count); });
  usePrefill(sections, set);

  const groups = rooms.flatMap((r) =>
    Array.from({ length: count[r.id] ?? 0 }, (_, i) => ({ room: r, label: (count[r.id] ?? 0) > 1 ? `${r.name} ${i + 1}` : r.name })),
  );
  const recommended = groups.reduce((sum, g) => sum + g.room.shots.length, 0);
  const area = Number(v.flaeche) || 0;

  // package from the choice, or from the area if none was chosen; bigger objects get a quote first
  const pay = () => {
    const p = String(v.paket ?? "").split("|")[0];
    const tier = p === "Basis" || p === "Premium" || p === "Exklusiv" ? p : p ? "" : area > 600 ? "" : area > 300 ? "Exklusiv" : area > 150 ? "Premium" : "Basis";
    return tier === "Basis" ? { href: "/shop?roomtour=1", label: "KI-Roomtour Basis für 349 €" }
      : tier === "Premium" ? { href: "/shop?premium=1", label: "KI-Roomtour Premium für 649 €" }
      : tier === "Exklusiv" ? { href: "/shop?exklusiv=1", label: "KI-Roomtour Exklusiv für 1.449 €" } : null;
  };

  // Without these we would have to ask back: every chosen room needs at least two photos.
  const missing = () => {
    const out = sections.flatMap((s) => s.questions).filter((q) => q.req && !String(v[q.id] ?? "").trim()).map((q) => ({ id: `q-${q.id}`, label: q.label }));
    if (!groups.length) out.push({ id: "rooms", label: "Räume wählen" });
    if (photos.enabled) for (const g of groups) {
      const have = photos.done.filter((x) => x.group === g.label).length;
      const need = Math.min(MIN_PER_ROOM, g.room.shots.length);
      if (have < need) out.push({ id: `room-${g.label}`, label: `Fotos: ${g.label} (${have} von mind. ${need})` });
    }
    const tier = String(v.paket ?? "");
    if (photos.enabled && (tier.startsWith("Premium") || tier.startsWith("Exklusiv")) && !photos.done.some((x) => x.group === "Logo")) out.push({ id: "up-logo", label: "Logo für den Abspann" });
    if (photos.enabled && Number(v.flaeche) > 150 && !photos.done.some((x) => x.group === "Grundriss")) out.push({ id: "up-grundriss", label: "Grundriss (ab 150 m², auch abfotografiert)" });
    return out;
  };

  const answers = () => [
    ...sections.flatMap((s) =>
      s.questions.map((q) => {
        const raw = v[q.id];
        return { section: s.title, label: q.label, value: Array.isArray(raw) ? raw.join(", ") : raw ?? "" };
      }),
    ),
    { section: "Räume", label: "Räume", value: groups.map((g) => g.label).join(", ") },
    ...groups.filter((g) => String(v[`raum-${slug(g.label)}`] ?? "").trim()).map((g) => ({ section: "Räume", label: `Besonderheiten: ${g.label}`, value: String(v[`raum-${slug(g.label)}`]) })),
    { section: "Räume", label: "Fotos", value: `${photos.done.length} hochgeladen, ${recommended} empfohlen` },
  ];

  return (
    <Shell
      title="Ihre Roomtour: Fotos senden, Video erhalten."
      lead="Aus Ihren Fotos entsteht mit KI ein Video-Rundgang. Damit er echt wirkt und nichts erfunden wird, braucht die KI jeden Raum aus mehreren Blickwinkeln und jede Tür von beiden Seiten. Welche Fotos genau, zeigen wir Ihnen unten Raum für Raum. Mindestens drei pro Raum, besser alle vorgeschlagenen. Ihre Angaben bleiben in diesem Browser gespeichert; Fotos laden Sie am besten direkt vom Handy hoch."
      steps={[
        ["Fotos hochladen", "Raum für Raum, so wie unten gezeigt."],
        ["In den Warenkorb, bezahlen", "Direkt im Anschluss, sicher über Stripe."],
        ["Video erhalten", "Per E-Mail-Link: Basis in 48, Premium in 72 Stunden, Exklusiv in 5 Werktagen ab Zahlung."],
        ["Gemeinsam anpassen", "Passt etwas nicht, ändern wir es mit Ihnen."],
      ]}
      done={done && <Done kind="roomtour" {...done} />}
    >
      {sections.map((s, i) => (
        <Sec key={s.title} n={i + 1} title={s.title} intro={s.intro}>
          {s.questions.map((q) => (
            <Question key={q.id} q={q} value={v[q.id]} onChange={(x) => set(q.id, x)} />
          ))}
          {i === 0 && (
            <div className="bf-q" aria-live="polite">
              <div className="bf-quote">
                <span className="bf-price">{area > 600 ? "Auf Anfrage" : area > 300 ? "1.449 €" : area > 150 ? "649 €" : "349 €"}</span>
                <span>{area > 600 ? "Über 600 m² nennen wir Ihnen vorher einen schriftlichen Festpreis." : area > 300 ? "Exklusiv: bis 600 m², Hauptfilm in 4K, Kurzfassung, sechs Kurzclips, Deutsch und Englisch." : area > 150 ? "Premium: bis 300 m² oder mehrere Etagen, mit Außenbereich, Logo und drei Kurzclips." : "Basis: bis 150 m² oder ein ganzes Stockwerk."}</span>
              </div>
            </div>
          )}
        </Sec>
      ))}

      <Sec n={sections.length + 1} title="Räume und Fotos" intro={<>Wählen Sie Ihre Räume. Jede Kachel zeigt, von wo aus fotografiert wird. Insgesamt {recommended} Fotos.</>}>
        <div className="bf-q bf-panel">
          <h3>So werden die Fotos gut</h3>
          <ul className="bf-tips">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <fieldset className="bf-q" id="rooms" tabIndex={-1} style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="lab" style={{ padding: 0, marginBottom: 8, fontWeight: 500, fontSize: 15, color: "var(--ink)" }}>Welche Räume sollen ins Video?</legend>
          <div className="bf-chips">
            {rooms.map((r) => {
              const n = count[r.id] ?? 0;
              return (
                <span key={r.id} style={{ display: "inline-flex", gap: 4 }}>
                  <label className="bf-chip">
                    <input type="checkbox" checked={n > 0} onChange={() => setCount((c) => ({ ...c, [r.id]: n > 0 ? 0 : 1 }))} />
                    <span>{n > 1 ? `${n} ${r.name}` : r.name}</span>
                  </label>
                  {r.multi && n > 0 && (
                    <span className="bf-step">
                      <button type="button" aria-label={`Ein ${r.name} weniger`} disabled={n < 2} onClick={() => setCount((c) => ({ ...c, [r.id]: n - 1 }))}>−</button>
                      <button type="button" aria-label={`Noch ein ${r.name}`} disabled={n > 7} onClick={() => setCount((c) => ({ ...c, [r.id]: n + 1 }))}>+</button>
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </fieldset>
        {photos.enabled === false && (
          <p className="bf-q bf-off">
            Den Upload schalten wir gerade frei. Schicken Sie uns die Fotos nach dem Absenden bitte per E-Mail oder WhatsApp, gern mit dem Raum im Dateinamen. Die Kacheln zeigen, welche wir brauchen.
          </p>
        )}
        {groups.map((g) => {
          const have = photos.items.filter((x) => x.group === g.label && !x.error).length;
          return (
            <div className="bf-q bf-room" key={g.label} id={`room-${g.label}`} tabIndex={-1}>
              <div className="lab">{g.label}<span>{have} von {g.room.shots.length} (mind. {Math.min(MIN_PER_ROOM, g.room.shots.length)})</span></div>
              {photos.enabled === false ? (
                <div className="bf-shots">
                  {g.room.shots.map((s) => <ShotHint key={s.label} {...s} />)}
                </div>
              ) : (
                <PhotoSlots group={g.label} photos={photos} shots={g.room.shots} />
              )}
              <Question q={{ id: `raum-${slug(g.label)}`, label: "Besonderheiten in diesem Raum (optional)", type: "text", placeholder: "z. B. Kamin links, Bild über dem Sofa bleibt, Tür zum Balkon rechts" }} value={v[`raum-${slug(g.label)}`]} onChange={(x) => set(`raum-${slug(g.label)}`, x)} />
            </div>
          );
        })}
        {photos.enabled && (
          <>
            <div className="bf-q" id="up-logo" tabIndex={-1}>
              <span className="lab">Logo und Grundriss</span>
              <p className="bf-hint">Das Logo kommt bei Premium und Exklusiv ins Intro und den Abspann. Der Grundriss, auch abfotografiert oder als Skizze, zeigt der KI, wie die Räume zusammenhängen. Ab 150 m² brauchen wir ihn.</p>
              <PhotoSlots group="Logo" photos={photos} accept="image/*,.pdf,.svg" />
              <span id="up-grundriss" tabIndex={-1} />
              <PhotoSlots group="Grundriss" photos={photos} accept="image/*,.pdf" />
            </div>
          </>
        )}
      </Sec>

      <Submit kind="roomtour" n={sections.length + 2} answers={answers} photos={photos} button="Weiter zur Bezahlung" onDone={setDone} pay={pay} missing={missing} />
    </Shell>
  );
}
