"use client";

import { useState } from "react";
import { Done, PhotoSlots, ShotHint, Question, Sec, Shell, Submit, useDraft, usePhotos, usePrefill, type DoneInfo, type Section, type Shot, type Values } from "./Briefing";

const sections: Section[] = [
  {
    title: "Ihre Räume",
    questions: [
      { id: "firma", label: "Name des Unternehmens oder Objekts", type: "text", placeholder: "z. B. Ferienwohnung Seeblick, Praxis Dr. Huber", half: true, req: true },
      { id: "ort_genau", label: "Adresse des Objekts", type: "text", placeholder: "nur für uns, erscheint nicht im Video", half: true },
      { id: "paket", label: "Paket", type: "one", options: ["Basis|bis 150 m², 300 €", "Premium|bis 300 m², 490 €", "Individuell|größer oder mehrere Objekte", "Noch unsicher|wir empfehlen Ihnen eins"], req: true },
      { id: "art", label: "Was sollen wir zeigen?", type: "one", options: ["Ferienwohnung / Airbnb", "Hotel / Pension", "Immobilie (Verkauf oder Vermietung)", "Laden / Showroom", "Restaurant / Café", "Praxis / Studio", "Büro", "Sonstiges"], req: true },
      { id: "flaeche", label: "Fläche in m²", type: "number", placeholder: "z. B. 75", half: true, req: true },
      { id: "ort", label: "Ort", type: "text", placeholder: "z. B. Garmisch", half: true },
      { id: "inserat", label: "Link zum Inserat (falls vorhanden)", type: "url", placeholder: "Airbnb, Immobilienportal, Google oder Ihre Website" },
    ],
  },
  {
    title: "Ihr Video",
    questions: [
      { id: "stimmung", label: "Stimmung", type: "one", options: ["Ruhig und hell", "Modern", "Gemütlich", "Luxuriös", "Entscheiden Sie"] },
      { id: "musik", label: "Musik", type: "one", options: ["Ruhig", "Modern und lebendig", "Elegant", "Ohne Musik", "Entscheiden Sie"] },
      { id: "einblendungen", label: "Texte im Video (optional)", type: "textarea", placeholder: "z. B. 68 m², 2 Schlafzimmer, Balkon mit Seeblick, ab 89 € pro Nacht" },
      { id: "abspann", label: "Abspann: was soll am Ende stehen?", type: "text", placeholder: "z. B. Ferienwohnung Seeblick · seeblick-garmisch.de · 0171 2345678", req: true, hint: "Genau so, wie es im Video stehen soll. Im Premium-Paket kommt Ihr Logo dazu (unten hochladen)." },
      { id: "reihenfolge", label: "Reihenfolge des Rundgangs", type: "textarea", placeholder: "z. B. Eingang → Flur → Wohnzimmer → Küche → Schlafzimmer → Bad → Balkon", hint: "So führt die Kamera durch Ihre Räume. Leer lassen, dann wählen wir die natürliche Reihenfolge." },
      { id: "raumnamen", label: "Besondere Raumnamen im Video (optional)", type: "text", placeholder: "z. B. Schlafzimmer „Seeblick“, Suite 2" },
      { id: "ki_hinweis", label: "Hinweis „Mit KI erstellt“ im Video", type: "one", options: ["Ja, dezent einblenden (empfohlen)", "Nein, ich kennzeichne selbst im Inserat"], req: true, hint: "Seit August 2026 müssen realistisch wirkende KI-Videos erkennbar sein (EU-KI-Verordnung)." },
      { id: "nicht_zeigen", label: "Was darf nicht zu sehen sein?", type: "text", placeholder: "z. B. Hausnummer, Nachbarhaus, Fotos an der Wand, Personen" },
      { id: "nutzung", label: "Wo zeigen Sie das Video?", type: "many", options: ["Airbnb", "Booking.com", "Immobilienportale", "Eigene Website", "Instagram / TikTok", "Google-Profil", "WhatsApp an Kunden"] },
      { id: "highlights", label: "Was sollen Ihre Kunden unbedingt sehen?", type: "textarea", placeholder: "z. B. Seeblick vom Balkon, Sauna, die neue Küche" },
      { id: "clips", label: "Nur Premium: Themen der 3 Kurzclips", type: "text", placeholder: "z. B. Aussicht, Küche, Wellness. Leer lassen, dann wählen wir." },
    ],
  },
];

type Room = { id: string; name: string; shots: Shot[]; multi?: boolean };

// The photos we need per room, each with the camera position drawn as a small floor plan.
// Coordinates: x/y 0..1 inside the room, top wall = window; a = view direction in degrees (-90 = towards the window).
const rooms: Room[] = [
  { id: "flur", name: "Eingang und Flur", shots: [
    { label: "Von der Tür hinein", x: 0.2, y: 0.9, a: -60 },
    { label: "Zurück zur Tür", x: 0.8, y: 0.15, a: 120 },
  ] },
  { id: "wohnen", name: "Wohnzimmer", shots: [
    { label: "Aus der Ecke an der Tür", x: 0.06, y: 0.92, a: -40 },
    { label: "Aus der Ecke gegenüber", x: 0.94, y: 0.08, a: 140 },
    { label: "Aus der dritten Ecke", x: 0.94, y: 0.92, a: -140 },
    { label: "Richtung Fenster", x: 0.5, y: 0.9, a: -90 },
  ] },
  { id: "kueche", name: "Küche", shots: [
    { label: "Die ganze Küchenzeile", x: 0.5, y: 0.92, a: -90 },
    { label: "Vom Essplatz", x: 0.94, y: 0.5, a: 180 },
    { label: "Ein schönes Detail", x: 0.5, y: 0.45, a: -90 },
  ] },
  { id: "schlafen", name: "Schlafzimmer", multi: true, shots: [
    { label: "Vom Fußende aufs Bett", x: 0.5, y: 0.92, a: -90 },
    { label: "Aus der Ecke an der Tür", x: 0.06, y: 0.92, a: -40 },
    { label: "Richtung Fenster", x: 0.94, y: 0.92, a: -130 },
  ] },
  { id: "bad", name: "Bad", multi: true, shots: [
    { label: "Von der Tür in den Raum", x: 0.2, y: 0.92, a: -60 },
    { label: "Dusche oder Wanne", x: 0.5, y: 0.55, a: -90 },
  ] },
  { id: "balkon", name: "Balkon oder Terrasse", shots: [
    { label: "Die ganze Fläche", x: 0.08, y: 0.9, a: -35 },
    { label: "Die Aussicht", x: 0.5, y: 0.6, a: -90 },
  ] },
  { id: "aussen", name: "Außen und Umgebung", shots: [
    { label: "Eingang oder Fassade", x: 0.5, y: 0.92, a: -90 },
    { label: "Garten oder Straße", x: 0.5, y: 0.4, a: 90 },
  ] },
  { id: "extra", name: "Weitere Räume", shots: [
    { label: "Überblick", x: 0.06, y: 0.92, a: -40 },
    { label: "Das Besondere", x: 0.5, y: 0.5, a: -90 },
  ] },
];

const tips = [
  "Handy quer halten",
  "Auf Brusthöhe, Kamera gerade",
  "0,5×-Weitwinkel, falls vorhanden",
  "Tagsüber, Licht an, Vorhänge auf",
  "Aufgeräumt, ohne Personen und Filter",
  "Originalfotos, nicht über WhatsApp",
];

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
    const tier = p === "Basis" || p === "Premium" ? p : p ? "" : area > 300 ? "" : area > 150 ? "Premium" : "Basis";
    return tier === "Basis" ? { href: "/shop?roomtour=1", label: "KI-Roomtour Basis für 300 €" } : tier === "Premium" ? { href: "/shop?premium=1", label: "KI-Roomtour Premium für 490 €" } : null;
  };

  // Without these we would have to ask back: every chosen room needs at least two photos.
  const missing = () => {
    const out = sections.flatMap((s) => s.questions).filter((q) => q.req && !String(v[q.id] ?? "").trim()).map((q) => ({ id: `q-${q.id}`, label: q.label }));
    if (!groups.length) out.push({ id: "rooms", label: "Räume wählen" });
    if (photos.enabled) for (const g of groups) {
      const have = photos.done.filter((x) => x.group === g.label).length;
      if (have < Math.min(2, g.room.shots.length)) out.push({ id: `room-${g.label}`, label: `Fotos: ${g.label} (${have} von mind. 2)` });
    }
    if (photos.enabled && String(v.paket ?? "").startsWith("Premium") && !photos.done.some((x) => x.group === "Logo")) out.push({ id: "up-logo", label: "Logo für den Abspann" });
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
    { section: "Räume", label: "Fotos", value: `${photos.done.length} hochgeladen, ${recommended} empfohlen` },
  ];

  return (
    <Shell
      title="Ihre Roomtour: Fotos senden, Video erhalten."
      lead="Pro Raum brauchen wir ein paar Fotos aus bestimmten Blickwinkeln. Welche genau, zeigen wir Ihnen unten Raum für Raum. Mindestens zwei Fotos pro Raum, besser alle vorgeschlagenen. Ihre Angaben bleiben in diesem Browser gespeichert; Fotos laden Sie am besten direkt vom Handy hoch."
      steps={[
        ["Fotos hochladen", "Raum für Raum, so wie unten gezeigt."],
        ["In den Warenkorb, bezahlen", "Direkt im Anschluss, sicher über Stripe."],
        ["Video erhalten", "Per E-Mail-Link: Basis in 48, Premium in 72 Stunden ab Zahlung."],
        ["Gemeinsam anpassen", "Passt etwas nicht, ändern wir es mit Ihnen."],
      ]}
      done={done && <Done kind="roomtour" {...done} />}
    >
      {sections.map((s, i) => (
        <Sec key={s.title} n={i + 1} title={s.title}>
          {s.questions.map((q) => (
            <Question key={q.id} q={q} value={v[q.id]} onChange={(x) => set(q.id, x)} />
          ))}
          {i === 0 && (
            <div className="bf-q" aria-live="polite">
              <div className="bf-quote">
                <span className="bf-price">{area > 300 ? "Auf Anfrage" : area > 150 ? "490 €" : "300 €"}</span>
                <span>{area > 300 ? "Über 300 m² nennen wir Ihnen vorher einen schriftlichen Festpreis." : area > 150 ? "Premium: bis 300 m² oder mehrere Etagen, mit Außenbereich, Logo und drei Kurzclips." : "Basis: bis 150 m² oder ein ganzes Stockwerk."}</span>
              </div>
            </div>
          )}
        </Sec>
      ))}

      <Sec n={3} title="Räume und Fotos" intro={<>Wählen Sie Ihre Räume. Jede Kachel zeigt, von wo aus fotografiert wird. Insgesamt {recommended} Fotos.</>}>
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
              <div className="lab">{g.label}<span>{have} von {g.room.shots.length}</span></div>
              {photos.enabled === false ? (
                <div className="bf-shots">
                  {g.room.shots.map((s) => <ShotHint key={s.label} {...s} />)}
                </div>
              ) : (
                <PhotoSlots group={g.label} photos={photos} shots={g.room.shots} />
              )}
            </div>
          );
        })}
        {photos.enabled && (
          <>
            <div className="bf-q" id="up-logo" tabIndex={-1}>
              <span className="lab">Logo (Premium) und Grundriss (optional)</span>
              <p className="bf-hint">Das Logo kommt in den Abspann. Ein Grundriss, auch abfotografiert, hilft uns bei der Reihenfolge des Rundgangs.</p>
              <PhotoSlots group="Logo" photos={photos} accept="image/*,.pdf,.svg" />
              <PhotoSlots group="Grundriss" photos={photos} accept="image/*,.pdf" />
            </div>
          </>
        )}
      </Sec>

      <Submit kind="roomtour" n={4} answers={answers} photos={photos} button="Weiter zur Bezahlung" onDone={setDone} pay={pay} missing={missing} />
    </Shell>
  );
}
