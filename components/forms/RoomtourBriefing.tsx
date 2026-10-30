"use client";

import { useState } from "react";
import { CallCard, Done, PhotoDrop, Question, Sec, Shell, Steps, Submit, usePhotos, usePrefill, type DoneInfo, type Section, type Values } from "./Briefing";

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

type Room = { id: string; name: string; n: number; tip: string; multi?: boolean };

// How many photos we need per room and from where. Keeps the AI result close to the real space.
const rooms: Room[] = [
  { id: "flur", name: "Eingang und Flur", n: 2, tip: "Von der Tür in die Wohnung hinein und einmal zurück zur Tür." },
  { id: "wohnen", name: "Wohnzimmer", n: 4, tip: "Aus jeder Ecke einmal in den Raum, dazu ein Foto Richtung Fenster." },
  { id: "kueche", name: "Küche", n: 3, tip: "Die ganze Küchenzeile, ein Blick vom Essplatz und ein Detail." },
  { id: "schlafen", name: "Schlafzimmer", n: 3, tip: "Vom Fußende aufs Bett, aus der Ecke an der Tür und Richtung Fenster.", multi: true },
  { id: "bad", name: "Bad", n: 2, tip: "Von der Tür in den Raum, dazu Dusche oder Badewanne.", multi: true },
  { id: "balkon", name: "Balkon oder Terrasse", n: 2, tip: "Die Fläche mit Möbeln und die Aussicht." },
  { id: "aussen", name: "Außen und Umgebung", n: 2, tip: "Hauseingang oder Fassade, gern auch Garten oder Straße." },
  { id: "extra", name: "Weitere Räume", n: 2, tip: "Arbeitszimmer, Sauna, Pool: alles, was Gäste besonders mögen." },
];

const tips = [
  "Handy quer halten (Querformat)",
  "Auf Brusthöhe fotografieren, Kamera gerade",
  "Aus den Ecken in den Raum, gern mit 0,5×-Weitwinkel",
  "Tagsüber, Licht an, Vorhänge auf",
  "Aufgeräumt, ohne Personen und ohne Filter",
  "Originalfotos senden, nicht über WhatsApp verkleinert",
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
  const recommended = groups.reduce((sum, g) => sum + g.room.n, 0);
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

  const aside = (
    <>
      <div className="bf-card">
        <h3>Ihr Preis</h3>
        {area > 150 ? (
          <>
            <div className="bf-price">Nach Größe</div>
            <p>Über 150 m² rechnen wir nach Fläche und Aufwand. Sie bekommen vorher einen schriftlichen Festpreis.</p>
          </>
        ) : (
          <>
            <div className="bf-price">300 €</div>
            <p>Bis 150 m² oder ein ganzes Stockwerk.</p>
          </>
        )}
      </div>
      <div className="bf-card">
        <h3>So geht es weiter</h3>
        <Steps
          items={[
            ["Fotos senden", "Raum für Raum, so wie unten beschrieben."],
            ["Festpreis und Zahlungslink", "Innerhalb von 24 Stunden."],
            ["Video in bis zu 48 Stunden", "Ab Zahlungseingang und vollständigen Fotos."],
            ["Gemeinsam anpassen", "Passt etwas nicht, ändern wir es mit Ihnen."],
          ]}
        />
      </div>
      <CallCard />
    </>
  );

  return (
    <Shell
      title="Ihre Roomtour: Fotos senden, Video erhalten."
      lead="Wir brauchen pro Raum ein paar Fotos aus verschiedenen Blickwinkeln. Daraus entsteht ein Video, das Ihre Unterkunft so zeigt, wie sie ist."
      aside={aside}
      done={done && <Done kind="roomtour" {...done} />}
    >
      {sections.map((s, i) => (
        <Sec key={s.title} n={i + 1} title={s.title}>
          {s.questions.map((q) => (
            <Question key={q.id} q={q} value={v[q.id]} onChange={(x) => set(q.id, x)} />
          ))}
        </Sec>
      ))}

      <Sec n={3} title="Räume und Fotos" intro={`Wählen Sie Ihre Räume. Insgesamt empfehlen wir ${recommended} Fotos.`}>
        <div className="bf-q">
          <div className="bf-card" style={{ background: "var(--bg2)", boxShadow: "none", padding: 20 }}>
            <h3 style={{ marginBottom: 10 }}>So werden die Fotos gut</h3>
            <ul className="bf-tips">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
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
                    <span>{r.name}{n > 1 ? ` × ${n}` : ""}</span>
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
            Den Upload schalten wir gerade frei. Schicken Sie uns die Fotos nach dem Absenden bitte per E-Mail oder WhatsApp, gern mit dem Raum im Dateinamen.
          </p>
        )}
        {groups.map((g) => (
          <div className="bf-q" key={g.label} style={{ paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <span className="lab">{g.label} <span style={{ color: "var(--muted)", fontWeight: 400 }}>· {g.room.n} Fotos</span></span>
            <PhotoDrop group={g.label} photos={photos} recommended={g.room.n} tip={g.room.tip} />
          </div>
        ))}
      </Sec>

      <Submit kind="roomtour" n={4} answers={answers} photos={photos} button="Roomtour beauftragen" onDone={setDone} />
    </Shell>
  );
}
