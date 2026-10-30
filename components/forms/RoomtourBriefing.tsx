"use client";

import { useState } from "react";
import { Done, PhotoSlots, ShotHint, Question, Sec, Shell, Submit, usePhotos, usePrefill, type DoneInfo, type Section, type Shot, type Values } from "./Briefing";

const sections: Section[] = [
  {
    title: "Ihre Unterkunft",
    questions: [
      { id: "art", label: "Art der Unterkunft", type: "one", options: ["Ferienwohnung", "Apartment", "Haus", "Hotelzimmer", "Pension", "Gewerbe / Büro", "Sonstiges"] },
      { id: "flaeche", label: "Wohnfläche in m²", type: "number", placeholder: "z. B. 75", half: true },
      { id: "ort", label: "Ort", type: "text", placeholder: "z. B. Garmisch", half: true },
      { id: "inserat", label: "Link zum Inserat (falls vorhanden)", type: "url", placeholder: "Airbnb, Booking.com oder Ihre Website" },
    ],
  },
  {
    title: "Ihr Video",
    questions: [
      { id: "format", label: "Format", type: "one", options: ["Querformat 16:9 (Inserat, Website, YouTube)", "Hochformat 9:16 (Instagram, TikTok)", "Beides"] },
      { id: "stimmung", label: "Stimmung", type: "one", options: ["Ruhig und hell", "Modern", "Gemütlich", "Luxuriös", "Entscheiden Sie"] },
      { id: "highlights", label: "Was sollen Gäste unbedingt sehen?", type: "textarea", placeholder: "z. B. Seeblick vom Balkon, Sauna, die neue Küche" },
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
  usePrefill(sections, set);

  const groups = rooms.flatMap((r) =>
    Array.from({ length: count[r.id] ?? 0 }, (_, i) => ({ room: r, label: (count[r.id] ?? 0) > 1 ? `${r.name} ${i + 1}` : r.name })),
  );
  const recommended = groups.reduce((sum, g) => sum + g.room.shots.length, 0);
  const area = Number(v.flaeche) || 0;

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
      lead="Pro Raum brauchen wir ein paar Fotos aus bestimmten Blickwinkeln. Welche genau, zeigen wir Ihnen unten Raum für Raum."
      steps={[
        ["Fotos senden", "Raum für Raum, so wie unten gezeigt."],
        ["Festpreis und Zahlungslink", "Innerhalb von 24 Stunden."],
        ["Video in bis zu 48 Stunden", "Ab Zahlung und vollständigen Fotos."],
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
                <span className="bf-price">{area > 150 ? "Nach Größe" : "300 €"}</span>
                <span>{area > 150 ? "Über 150 m² nennen wir Ihnen vorher einen schriftlichen Festpreis." : "Bis 150 m² oder ein ganzes Stockwerk."}</span>
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
        <fieldset className="bf-q" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="lab" style={{ padding: 0, marginBottom: 8, fontWeight: 500, fontSize: 15, color: "var(--ink)" }}>Welche Räume hat Ihre Unterkunft?</legend>
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
            <div className="bf-q bf-room" key={g.label}>
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
      </Sec>

      <Submit kind="roomtour" n={4} answers={answers} photos={photos} button="Roomtour beauftragen" onDone={setDone} />
    </Shell>
  );
}
