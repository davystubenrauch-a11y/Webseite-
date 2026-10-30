"use client";

import { useState } from "react";
import { Done, PhotoSlots, Question, Sec, Shell, Submit, usePhotos, usePrefill, type DoneInfo, type Section, type Values } from "./Briefing";

const sections: Section[] = [
  {
    title: "Ihr Betrieb",
    questions: [
      { id: "firma", label: "Name des Betriebs", type: "text", half: true },
      { id: "branche", label: "Branche", type: "text", placeholder: "z. B. Café, Friseur, Ferienwohnung", half: true },
      { id: "angebot", label: "Was bieten Sie an?", type: "textarea", placeholder: "Ein, zwei Sätze reichen. Was soll ein Besucher sofort verstehen?" },
      { id: "kunden", label: "Wer sind Ihre Kunden?", type: "text", placeholder: "z. B. Familien aus der Umgebung, Geschäftsreisende" },
      { id: "ziel", label: "Was soll die Website vor allem bringen?", type: "many", options: ["Mehr Anfragen", "Mehr Buchungen", "Seriöser Auftritt", "Bei Google gefunden werden", "Infos für Stammkunden"] },
    ],
  },
  {
    title: "Umfang",
    intro: "Wenn Sie unsicher sind, wählen Sie einfach „Noch unsicher“. Wir empfehlen Ihnen dann das passende Paket.",
    questions: [
      {
        id: "paket", label: "Paket", type: "one",
        options: ["Basis|3 Seiten, ab 300 €", "Business|ab 690 €", "Premium|ab 1.290 €", "Noch unsicher|Wir beraten Sie"],
        hint: "Basis: klar und fokussiert. Business und Premium: mehr Seiten, Animationen und 3D.",
      },
      { id: "seiten", label: "Welche Seiten brauchen Sie?", type: "many", options: ["Startseite", "Leistungen", "Über uns", "Preise", "Speisekarte", "Galerie", "Team", "Termine / Buchung", "Blog / Neuigkeiten", "Kontakt"], hint: "Impressum und Datenschutz sind immer dabei." },
      { id: "funktionen", label: "Welche Funktionen?", type: "many", options: ["Kontaktformular", "Online-Termine", "Google-Karte", "Google-Bewertungen anzeigen", "Mehrsprachig", "Animationen", "Online-Shop"] },
    ],
  },
  {
    title: "Gestaltung",
    questions: [
      { id: "stil", label: "Welcher Stil passt zu Ihnen?", type: "one", options: ["Hell und ruhig", "Dunkel und edel", "Farbig und lebendig", "Klassisch", "Modern und schlicht", "Entscheiden Sie"] },
      { id: "farben", label: "Farben, die zu Ihnen gehören", type: "text", placeholder: "z. B. Dunkelgrün und Weiß, wie unser Schild", half: true },
      { id: "logo", label: "Haben Sie ein Logo?", type: "one", options: ["Ja", "Nein", "Soll neu entstehen"], half: true },
      { id: "vorbilder", label: "Websites, die Ihnen gefallen", type: "textarea", placeholder: "Links oder Namen, gern mit einem Satz, was Ihnen daran gefällt." },
      { id: "nicht", label: "Was möchten Sie auf keinen Fall?", type: "text", placeholder: "z. B. zu viel Text, knallige Farben" },
    ],
  },
  {
    title: "Inhalte",
    questions: [
      { id: "texte", label: "Wer schreibt die Texte?", type: "one", options: ["Ich liefere die Texte", "Bitte schreibt ihr sie", "Teils, teils"] },
      { id: "domain", label: "Domain (Internetadresse)", type: "one", options: ["Habe ich schon", "Brauche ich noch", "Weiß ich nicht"], half: true },
      { id: "adresse", label: "Bestehende Website oder Wunsch-Adresse", type: "text", placeholder: "z. B. mein-cafe.de", half: true },
      { id: "termin", label: "Bis wann soll die Seite online sein?", type: "date", half: true },
      { id: "sonst", label: "Sonst noch etwas?", type: "textarea" },
    ],
  },
];

export default function WebsiteBriefing() {
  const [v, setV] = useState<Values>({});
  const [done, setDone] = useState<DoneInfo | null>(null);
  const set = (id: string, value: string | string[]) => setV((o) => ({ ...o, [id]: value }));
  const photos = usePhotos("website");
  usePrefill(sections, set);

  const answers = () =>
    sections.flatMap((s) =>
      s.questions.map((q) => {
        const raw = v[q.id];
        return { section: s.title, label: q.label, value: Array.isArray(raw) ? raw.join(", ") : raw ?? "" };
      }),
    );

  return (
    <Shell
      title="Ihre Website in fünf Minuten beschrieben."
      lead="Je mehr wir über Ihren Betrieb wissen, desto genauer wird der Entwurf. Kein Feld ist Pflicht außer Name und Kontakt."
      steps={[
        ["Fragebogen senden", "Was Sie schon wissen. Den Rest klären wir am Telefon."],
        ["Festpreis erhalten", "Innerhalb von 24 Stunden, mit Zahlungslink."],
        ["Website in bis zu 7 Tagen", "Je nach Paket, ab Zahlungseingang."],
        ["Gemeinsam anpassen", "Sie sehen die Seite vorab und sagen, was wir ändern."],
      ]}
      done={done && <Done kind="website" {...done} />}
    >
      {sections.map((s, i) => (
        <Sec key={s.title} n={i + 1} title={s.title} intro={s.intro}>
          {s.questions.map((q) => (
            <Question key={q.id} q={q} value={v[q.id]} onChange={(x) => set(q.id, x)} />
          ))}
          {s.title === "Inhalte" && (
            <div className="bf-q">
              <span className="lab">Logo und Fotos</span>
              {photos.enabled === false ? (
                <p className="bf-off">Logo und Fotos schicken Sie uns nach dem Absenden einfach per E-Mail oder WhatsApp.</p>
              ) : (
                <>
                  <p className="bf-hint">Logo, Fotos von Ihnen, Ihrem Team, Ihren Räumen oder Produkten. Am besten in Originalgröße.</p>
                  <PhotoSlots group="Logo und Fotos" photos={photos} accept="image/*,.pdf,.svg" />
                </>
              )}
            </div>
          )}
        </Sec>
      ))}
      <Submit kind="website" n={sections.length + 1} answers={answers} photos={photos} button="Fragebogen senden" onDone={setDone} />
    </Shell>
  );
}
