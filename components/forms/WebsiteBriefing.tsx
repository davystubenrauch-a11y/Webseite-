"use client";

import { useState } from "react";
import { Done, PhotoSlots, Question, Sec, Shell, Submit, usePhotos, usePrefill, type DoneInfo, type Section, type Values } from "./Briefing";

// One questionnaire for every kind of business. It asks for everything we would otherwise have to ask later:
// the legal details for the imprint, the offer, the texts, the pictures, the technical access and the approvals.
// Only name and contact are required; everything else can be left empty and is then clarified by phone.
const sections: Section[] = [
  {
    title: "Ihr Unternehmen",
    intro: "Diese Angaben erscheinen auf der Website und im Impressum. Bitte genau so, wie sie offiziell lauten.",
    questions: [
      { id: "firma", label: "Name des Unternehmens", type: "text", placeholder: "z. B. Café Morgenrot", half: true },
      { id: "branche", label: "Branche", type: "text", placeholder: "z. B. Café, Physiotherapie, Elektriker", half: true },
      { id: "rechtsform", label: "Rechtsform", type: "one", options: ["Einzelunternehmen", "GbR", "GmbH / UG", "Freiberufler", "Verein", "Andere"] },
      { id: "inhaber", label: "Inhaber oder Geschäftsführer (vollständiger Name)", type: "text", half: true },
      { id: "adresse", label: "Anschrift (Straße, Hausnummer, PLZ, Ort)", type: "text", half: true },
      { id: "tel_public", label: "Telefon für die Website", type: "text", half: true },
      { id: "mail_public", label: "E-Mail für die Website", type: "text", half: true },
      { id: "zeiten", label: "Öffnungs- oder Erreichbarkeitszeiten", type: "textarea", placeholder: "z. B. Mo–Fr 8–18 Uhr, Sa 9–13 Uhr" },
      { id: "gebiet", label: "Wo sind Ihre Kunden?", type: "text", placeholder: "z. B. München und 30 km Umkreis, ganz Deutschland, nur vor Ort" },
      { id: "register", label: "Handelsregister und Nummer (falls vorhanden)", type: "text", placeholder: "z. B. Amtsgericht München, HRB 123456", half: true },
      { id: "ust", label: "USt-IdNr. (falls vorhanden)", type: "text", placeholder: "z. B. DE123456789", half: true },
      { id: "beruf", label: "Nur bei Berufen mit Kammer oder Zulassung", type: "textarea", placeholder: "z. B. Handwerkskammer München, Zahnärztekammer, Berufsbezeichnung und Land der Verleihung, Aufsichtsbehörde", hint: "Ärzte, Therapeuten, Handwerker, Anwälte, Makler und andere müssen das im Impressum angeben." },
    ],
  },
  {
    title: "Ihr Angebot",
    intro: "Aus diesen Antworten schreiben wir die Texte. Stichpunkte reichen völlig.",
    questions: [
      { id: "kurz", label: "Was machen Sie, in einem Satz?", type: "text", placeholder: "z. B. Wir reparieren Fahrräder aller Marken in Schwabing, meist am selben Tag." },
      { id: "leistungen", label: "Ihre Leistungen oder Produkte", type: "textarea", placeholder: "Eine Zeile pro Leistung, gern mit Preis oder Dauer. z. B. Inspektion – 59 € – 1 Tag" },
      { id: "preise", label: "Sollen Preise auf der Website stehen?", type: "one", options: ["Ja, alle", "Nur Startpreise („ab …“)", "Nein, auf Anfrage"] },
      { id: "wichtigste", label: "Womit verdienen Sie am meisten, was soll im Vordergrund stehen?", type: "text" },
      { id: "anders", label: "Warum kommen Kunden zu Ihnen und nicht zur Konkurrenz?", type: "textarea", placeholder: "z. B. schnell, persönlich, Familienbetrieb seit 1998, Termine auch abends" },
      { id: "kunden", label: "Wer sind Ihre Kunden?", type: "text", placeholder: "z. B. Familien aus dem Viertel, Firmen, Touristen, Senioren" },
      { id: "ablauf", label: "Wie läuft ein Auftrag oder Besuch bei Ihnen ab?", type: "textarea", placeholder: "z. B. Anruf, Termin, Beratung vor Ort, Angebot, Ausführung" },
      { id: "fragen", label: "Welche Fragen stellen Kunden immer wieder? Und Ihre Antworten", type: "textarea", placeholder: "z. B. Parken? Hinterhof, kostenlos. Kartenzahlung? Ja." },
      { id: "zahlung", label: "Zahlungsarten", type: "many", options: ["Bar", "EC-Karte", "Kreditkarte", "PayPal", "Rechnung", "Apple / Google Pay"] },
    ],
  },
  {
    title: "Über Sie",
    questions: [
      { id: "geschichte", label: "Ihre Geschichte in ein paar Sätzen", type: "textarea", placeholder: "Seit wann gibt es Sie, wie kam es dazu, was ist Ihnen wichtig?" },
      { id: "team", label: "Team, das auf der Website erscheinen soll", type: "textarea", placeholder: "Name – Rolle – ein Satz. z. B. Anna Huber – Inhaberin – seit 20 Jahren Friseurmeisterin" },
      { id: "nachweise", label: "Auszeichnungen, Zertifikate, Mitgliedschaften", type: "textarea" },
      { id: "stimmen", label: "Kundenstimmen, die wir zeigen dürfen", type: "textarea", placeholder: "Text – Name oder Initialen – Quelle (z. B. Google). Bitte nur mit Einverständnis der Kunden.", hint: "Wir verwenden nur echte Bewertungen. Auf Wunsch binden wir Ihre Google-Bewertungen direkt ein." },
      { id: "referenzen", label: "Referenzen oder Projekte zum Zeigen", type: "textarea" },
    ],
  },
  {
    title: "Ziel der Website",
    questions: [
      { id: "ziel", label: "Was soll die Website vor allem bringen?", type: "many", options: ["Mehr Anfragen", "Mehr Anrufe", "Online-Termine", "Mehr Buchungen", "Bei Google gefunden werden", "Seriöser Auftritt", "Mitarbeiter finden", "Infos für Stammkunden"] },
      { id: "aktion", label: "Was soll ein Besucher am Ende tun?", type: "one", options: ["Anrufen", "Formular senden", "WhatsApp schreiben", "Termin online buchen", "Vorbeikommen", "Online kaufen"] },
      { id: "suche", label: "Wonach suchen Ihre Kunden bei Google?", type: "text", placeholder: "z. B. Fahrradwerkstatt Schwabing, Physiotherapie München Ost" },
      { id: "konkurrenz", label: "Mitbewerber (Namen oder Websites)", type: "textarea" },
    ],
  },
  {
    title: "Umfang und Funktionen",
    intro: "Wenn Sie unsicher sind, wählen Sie „Noch unsicher“. Wir empfehlen Ihnen dann das passende Paket.",
    questions: [
      {
        id: "paket", label: "Paket", type: "one",
        options: ["Basis|3 Seiten, 300 €", "Business|bis 6 Seiten, Texte von uns, 690 €", "Premium|bis 10 Seiten, zweisprachig, 1.290 €", "Noch unsicher|Wir beraten Sie"],
      },
      { id: "seiten", label: "Welche Seiten brauchen Sie?", type: "many", options: ["Startseite", "Leistungen", "Über uns", "Team", "Preise", "Speisekarte", "Galerie / Referenzen", "Termine / Buchung", "Jobs", "Blog / Neuigkeiten", "FAQ", "Kontakt"], hint: "Impressum und Datenschutz sind immer dabei und zählen nicht als Seite." },
      { id: "funktionen", label: "Welche Funktionen?", type: "many", options: ["Kontaktformular", "WhatsApp-Knopf", "Online-Terminbuchung", "Google-Karte mit Anfahrt", "Google-Bewertungen anzeigen", "Speisekarte als PDF", "Newsletter", "Zweisprachig", "Online-Shop"] },
      { id: "tools", label: "Nutzen Sie schon Programme oder Portale?", type: "textarea", placeholder: "z. B. Terminbuchung über Doctolib, Treatwell, Calendly; Lieferando; Booking.com; Shopify" },
      { id: "social", label: "Links zu Google-Profil und Social Media", type: "textarea", placeholder: "Google Maps, Instagram, Facebook, TikTok, LinkedIn …" },
    ],
  },
  {
    title: "Gestaltung",
    questions: [
      { id: "stil", label: "Welcher Stil passt zu Ihnen?", type: "one", options: ["Hell und ruhig", "Dunkel und edel", "Farbig und lebendig", "Klassisch", "Modern und schlicht", "Entscheiden Sie"] },
      { id: "logo", label: "Haben Sie ein Logo?", type: "one", options: ["Ja, lade ich unten hoch", "Nein", "Soll neu entstehen"], half: true },
      { id: "farben", label: "Ihre Farben", type: "text", placeholder: "z. B. Dunkelgrün und Weiß wie unser Schild", half: true },
      { id: "vorbilder", label: "Websites, die Ihnen gefallen, und warum", type: "textarea" },
      { id: "nicht", label: "Was möchten Sie auf keinen Fall?", type: "text", placeholder: "z. B. zu viel Text, knallige Farben" },
    ],
  },
  {
    title: "Texte, Fotos und Technik",
    questions: [
      { id: "texte", label: "Wer schreibt die Texte?", type: "one", options: ["Wir übernehmen die Antworten oben", "Ich liefere fertige Texte", "Teils, teils"] },
      { id: "fotos", label: "Haben Sie eigene Fotos?", type: "one", options: ["Ja, lade ich unten hoch", "Einige, bitte ergänzen", "Nein, bitte passende Bilder auswählen"], hint: "Ohne eigene Fotos verwenden wir lizenzfreie Bilder, die zu Ihrer Branche passen." },
      { id: "rechte", label: "Bildrechte", type: "one", options: ["Die Fotos gehören mir oder ich darf sie nutzen", "Bin mir nicht sicher"] },
      { id: "domain", label: "Domain (Internetadresse)", type: "one", options: ["Habe ich schon", "Bitte für mich registrieren", "Weiß ich nicht"], half: true },
      { id: "adresse_web", label: "Bestehende Website oder Wunsch-Adresse", type: "text", placeholder: "z. B. cafe-morgenrot.de", half: true },
      { id: "anbieter", label: "Wo liegt Ihre Domain bzw. E-Mail? (falls bekannt)", type: "text", placeholder: "z. B. IONOS, Strato, All-inkl, GoDaddy", hint: "Zugangsdaten bitte nicht hier eintragen. Die besprechen wir sicher am Telefon." },
      { id: "formular_an", label: "An welche E-Mail sollen Anfragen von der Website gehen?", type: "text", half: true },
      { id: "tracking", label: "Besucherstatistik gewünscht?", type: "one", options: ["Nein, ohne Cookie-Banner", "Ja, datenschutzfreundlich", "Weiß ich nicht"], half: true },
      { id: "dsb", label: "Datenschutzbeauftragter (falls vorhanden)", type: "text" },
    ],
  },
  {
    title: "Zeitplan und Freigabe",
    questions: [
      { id: "termin", label: "Bis wann soll die Seite online sein?", type: "date", half: true },
      { id: "freigabe", label: "Wer gibt die Website frei?", type: "text", placeholder: "Name und Telefon, falls nicht Sie selbst", half: true },
      { id: "erreichbar", label: "Wann erreichen wir Sie am besten?", type: "text", placeholder: "z. B. werktags nach 17 Uhr" },
      { id: "sonst", label: "Sonst noch etwas, das wir wissen sollten?", type: "textarea" },
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
      title="Ihre Website, einmal beschrieben."
      lead="Mit diesen Angaben können wir Ihre Website komplett bauen, ohne nachzufragen. Nichts ist Pflicht außer Name und Kontakt. Was Sie nicht wissen, klären wir kurz am Telefon. Dauer: etwa 10 Minuten."
      steps={[
        ["Fragebogen senden", "Alles, was Sie schon wissen. Stichpunkte reichen."],
        ["Festpreis erhalten", "Innerhalb von 24 Stunden, mit Zahlungslink."],
        ["Entwurf ansehen", "Basis in 5, Business und Premium in 7 Tagen ab Zahlung."],
        ["Freigeben, online gehen", "Sie sagen, was wir ändern. Dann ist die Seite live."],
      ]}
      done={done && <Done kind="website" {...done} />}
    >
      {sections.map((s, i) => (
        <Sec key={s.title} n={i + 1} title={s.title} intro={s.intro}>
          {s.questions.map((q) => (
            <Question key={q.id} q={q} value={v[q.id]} onChange={(x) => set(q.id, x)} />
          ))}
          {s.title === "Texte, Fotos und Technik" && (
            <div className="bf-q">
              <span className="lab">Logo und Fotos</span>
              {photos.enabled === false ? (
                <p className="bf-off">Logo und Fotos schicken Sie uns nach dem Absenden einfach per E-Mail oder WhatsApp, am besten in Originalgröße.</p>
              ) : (
                <>
                  <p className="bf-hint">Logo (am liebsten als SVG oder PDF), Fotos von Ihnen, Ihrem Team, Ihren Räumen, Produkten oder Arbeiten. Originalgröße, nicht über WhatsApp verkleinert.</p>
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
