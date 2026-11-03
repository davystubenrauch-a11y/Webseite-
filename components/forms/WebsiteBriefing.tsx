"use client";

import { useState } from "react";
import { Done, PhotoSlots, Question, Sec, Shell, Submit, useDraft, usePhotos, usePrefill, type DoneInfo, type Section, type Values } from "./Briefing";

// One questionnaire for every kind of business. It asks for everything we would otherwise have to ask later:
// the legal details for the imprint, the offer, the texts, the pictures, the technical access and the approvals.
// Only name and contact are required; everything else can be left empty and is then clarified by phone.
const sections: Section[] = [
  {
    title: "Ihr Unternehmen",
    intro: "Aus diesen Angaben erstellen wir Ihr Impressum und den Kontaktbereich. Bitte genau so, wie sie offiziell lauten.",
    questions: [
      { id: "firma", label: "Name des Unternehmens", type: "text", placeholder: "z. B. Café Morgenrot", half: true, req: true },
      { id: "branche", label: "Branche", type: "text", placeholder: "z. B. Café, Physiotherapie, Elektriker", half: true, req: true },
      { id: "rechtsform", label: "Rechtsform", type: "one", options: ["Einzelunternehmen", "GbR", "GmbH / UG", "Freiberufler", "Verein", "Andere"], req: true },
      { id: "inhaber", label: "Inhaber oder Geschäftsführer (vollständiger Name)", type: "text", half: true, req: true, hint: "Bei einer GbR alle Gesellschafter." },
      { id: "adresse", label: "Anschrift (Straße, Hausnummer, PLZ, Ort)", type: "text", half: true, req: true, hint: "Erscheint im Impressum und in der Google-Karte. Kein Postfach." },
      { id: "tel_public", label: "Telefon für die Website", type: "text", half: true, req: true },
      { id: "mail_public", label: "E-Mail für die Website", type: "text", half: true, req: true, hint: "Dorthin gehen auch die Anfragen aus Ihrem Kontaktformular." },
      { id: "zeiten", label: "Öffnungs- oder Erreichbarkeitszeiten", type: "textarea", placeholder: "z. B. Mo–Fr 8–18 Uhr, Sa 9–13 Uhr, So Ruhetag", req: true },
      { id: "gebiet", label: "Wo sind Ihre Kunden?", type: "text", placeholder: "z. B. München und 30 km Umkreis, ganz Deutschland, nur vor Ort" },
      { id: "register", label: "Handelsregister und Nummer (falls vorhanden)", type: "text", placeholder: "z. B. Amtsgericht München, HRB 123456", half: true },
      { id: "ust", label: "USt-IdNr. (falls vorhanden)", type: "text", placeholder: "z. B. DE123456789", half: true },
      { id: "verantwortlich", label: "Verantwortlich für die Inhalte (falls nicht der Inhaber)", type: "text", placeholder: "Name und Anschrift", hint: "Pflichtangabe im Impressum bei Websites mit eigenen Texten (§ 18 MStV)." },
    ],
  },
  {
    title: "Ihr Angebot",
    intro: "Aus diesen Antworten schreiben wir die Texte. Stichpunkte reichen völlig.",
    questions: [
      { id: "kurz", label: "Was machen Sie, in einem Satz?", type: "text", placeholder: "z. B. Wir reparieren Fahrräder aller Marken in Schwabing, meist am selben Tag.", req: true },
      { id: "leistungen", label: "Ihre Leistungen oder Produkte", type: "textarea", placeholder: "Eine Zeile pro Leistung, gern mit Preis oder Dauer. z. B. Inspektion – 59 € – 1 Tag. Restaurants: Speisekarte unten als PDF hochladen.", req: true },
      { id: "preise", label: "Sollen Preise auf der Website stehen?", type: "one", options: ["Ja, alle", "Nur Startpreise („ab …“)", "Nein, auf Anfrage"] },
      { id: "wichtigste", label: "Womit verdienen Sie am meisten, was soll im Vordergrund stehen?", type: "text" },
      { id: "anders", label: "Warum kommen Kunden zu Ihnen und nicht zur Konkurrenz?", type: "textarea", placeholder: "z. B. schnell, persönlich, Familienbetrieb seit 1998, Termine auch abends", req: true },
      { id: "kunden", label: "Wer sind Ihre Kunden?", type: "text", placeholder: "z. B. Familien aus dem Viertel, Firmen, Touristen, Senioren" },
      { id: "ablauf", label: "Wie läuft ein Auftrag oder Besuch bei Ihnen ab?", type: "textarea", placeholder: "z. B. Anruf, Termin, Beratung vor Ort, Angebot, Ausführung" },
      { id: "fragen", label: "Welche Fragen stellen Kunden immer wieder? Und Ihre Antworten", type: "textarea", placeholder: "z. B. Parken? Hinterhof, kostenlos. Kartenzahlung? Ja." },
      { id: "zahlung", label: "Zahlungsarten", type: "many", options: ["Bar", "EC-Karte", "Kreditkarte", "PayPal", "Rechnung", "Apple / Google Pay"] },
      { id: "ansprache", label: "Wie sollen wir Ihre Kunden ansprechen?", type: "one", options: ["Sie", "Du", "Entscheiden Sie"], half: true },
      { id: "sprache", label: "Sprache der Website", type: "one", options: ["Deutsch", "Deutsch und Englisch (Premium, wir übersetzen)"], half: true },
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
      { id: "aktion", label: "Was soll ein Besucher am Ende tun?", type: "one", options: ["Anrufen", "Formular senden", "WhatsApp schreiben", "Termin online buchen", "Vorbeikommen", "Online kaufen"], req: true },
      { id: "suche", label: "Wonach suchen Ihre Kunden bei Google?", type: "text", placeholder: "z. B. Fahrradwerkstatt Schwabing, Physiotherapie München Ost", req: true },
      { id: "konkurrenz", label: "Mitbewerber (Namen oder Websites)", type: "textarea" },
    ],
  },
  {
    title: "Umfang und Funktionen",
    intro: "Wenn Sie unsicher sind, wählen Sie „Noch unsicher“. Wir empfehlen Ihnen dann das passende Paket.",
    questions: [
      {
        id: "paket", label: "Paket", type: "one",
        options: ["Basis|3 Seiten, 300 €", "Business|bis 6 Seiten, Texte von uns, 690 €", "Premium|bis 10 Seiten, Deutsch und Englisch, 1.290 €", "Noch unsicher|Wir beraten Sie"], req: true,
      },
      { id: "extra", label: "Nur Premium: Ihr inklusive Extra", type: "one", options: ["KI-Roomtour Basis", "10 NFC-Platten Weiß", "10 NFC-Platten Schwarz", "5 Weiß und 5 Schwarz"], hint: "Für die Roomtour schicken wir Ihnen nach der Zahlung den Link zum Foto-Upload." },
      { id: "seiten", label: "Welche Seiten brauchen Sie?", type: "many", options: ["Startseite", "Leistungen", "Über uns", "Team", "Preise", "Speisekarte", "Galerie / Referenzen", "Termine / Buchung", "Jobs", "Blog / Neuigkeiten", "FAQ", "Kontakt"], hint: "Impressum und Datenschutz sind immer dabei und zählen nicht als Seite." },
      { id: "funktionen", label: "Welche Funktionen?", type: "many", options: ["Kontaktformular", "WhatsApp-Knopf", "Online-Terminbuchung", "Google-Karte mit Anfahrt", "Google-Bewertungen anzeigen", "Speisekarte als PDF", "Newsletter", "Zweisprachig", "Online-Shop"] },
      { id: "tools", label: "Nutzen Sie schon Programme oder Portale?", type: "textarea", placeholder: "z. B. Terminbuchung über Doctolib, Treatwell, Calendly; Lieferando; Booking.com; Shopify" },
      { id: "social", label: "Links zu Google-Profil und Social Media", type: "textarea", placeholder: "Google Maps, Instagram, Facebook, TikTok, LinkedIn …", hint: "Den Google-Link brauchen wir für Karte und Bewertungen: in Google Maps Ihr Unternehmen öffnen, „Teilen“, Link kopieren." },
    ],
  },
  {
    title: "Gestaltung",
    questions: [
      { id: "stil", label: "Welcher Stil passt zu Ihnen?", type: "one", options: ["Hell und ruhig", "Dunkel und edel", "Farbig und lebendig", "Klassisch", "Modern und schlicht", "Entscheiden Sie"], req: true },
      { id: "logo", label: "Haben Sie ein Logo?", type: "one", options: ["Ja, lade ich unten hoch", "Nein, Schriftzug genügt", "Soll neu entstehen"], half: true, req: true, hint: "Ein neues Logo ist nicht im Paket enthalten. Ohne Logo setzen wir Ihren Namen als schlichten Schriftzug." },
      { id: "farben", label: "Ihre Farben", type: "text", placeholder: "z. B. Dunkelgrün und Weiß wie unser Schild", half: true },
      { id: "vorbilder", label: "Websites, die Ihnen gefallen, und warum", type: "textarea" },
      { id: "nicht", label: "Was möchten Sie auf keinen Fall?", type: "text", placeholder: "z. B. zu viel Text, knallige Farben" },
    ],
  },
  {
    title: "Texte, Fotos und Technik",
    questions: [
      { id: "texte", label: "Wer schreibt die Texte?", type: "one", options: ["Sie, aus meinen Antworten oben", "Ich liefere fertige Texte (unten als Datei)", "Teils, teils"], req: true, hint: "Im Basis-Paket bringen wir Ihre Stichpunkte in Form. Ab Business schreiben wir alle Texte neu." },
      { id: "fotos", label: "Haben Sie eigene Fotos?", type: "one", options: ["Ja, lade ich unten hoch", "Einige, bitte ergänzen", "Nein, bitte passende Bilder auswählen"], req: true, hint: "Ohne eigene Fotos verwenden wir lizenzfreie oder mit KI erstellte Bilder, die zu Ihrer Branche passen. Eigene Fotos wirken immer echter." },
      { id: "rechte", label: "Bildrechte", type: "one", options: ["Die Fotos gehören mir oder ich darf sie nutzen", "Bin mir nicht sicher"] },
      { id: "domain", label: "Domain (Internetadresse)", type: "one", options: ["Habe ich schon", "Buche ich noch", "Weiß ich nicht"], half: true, req: true, hint: "Domain und Hosting buchen Sie selbst, z. B. bei IONOS oder Strato. Wir sagen Ihnen gern, welcher Tarif reicht." },
      { id: "hosting", label: "Hosting (Speicherplatz für die Website)", type: "one", options: ["Habe ich schon", "Buche ich noch", "Weiß ich nicht"], half: true },
      { id: "adresse_web", label: "Ihre Domain oder Wunsch-Adresse", type: "text", placeholder: "z. B. cafe-morgenrot.de", half: true },
      { id: "alt_web", label: "Bestehende Website, deren Inhalte wir übernehmen dürfen", type: "url", placeholder: "https://…", half: true },
      { id: "anbieter", label: "Bei welchem Anbieter liegen Domain und Hosting?", type: "text", placeholder: "z. B. IONOS, Strato, All-inkl", hint: "Zugangsdaten bitte nie hier eintragen. Zum Veröffentlichen schicken wir Ihnen nach Ihrer Freigabe eine kurze Anleitung, wie Sie uns sicher Zugang geben." },
      { id: "rechtstexte", label: "Datenschutzerklärung (und ggf. AGB)", type: "one", options: ["Habe ich, schicke ich mit", "Erstelle ich noch", "Weiß ich nicht"], hint: "Das Impressum erstellen wir aus Ihren Angaben. Datenschutzerklärung und AGB erstellen Sie selbst, z. B. mit eRecht24 oder der IT-Recht Kanzlei. Wir binden sie ein." },
      { id: "beruf", label: "Nur falls zutreffend: Kammer, Berufsbezeichnung, Aufsichtsbehörde", type: "text", placeholder: "z. B. Handwerkskammer München, Zahnärztekammer Bayern", hint: "Für Handwerker, Ärzte, Therapeuten, Makler und andere zulassungspflichtige Berufe gehört das ins Impressum." },
      
      { id: "tracking", label: "Besucherstatistik gewünscht?", type: "one", options: ["Nein, ohne Cookie-Banner", "Ja, datenschutzfreundlich", "Weiß ich nicht"], half: true },
    ],
  },
  {
    title: "Zeitplan und Freigabe",
    questions: [
      { id: "termin", label: "Gibt es einen festen Termin? (sonst so schnell wie möglich)", type: "date", half: true },
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
  useDraft("website", v, (d) => setV((o) => ({ ...d, ...o })));
  usePrefill(sections, set);

  // Everything we need to build the site without asking back; checked before the package goes to the cart.
  const missing = () => {
    const out = sections.flatMap((s) => s.questions).filter((q) => q.req && !(Array.isArray(v[q.id]) ? (v[q.id] as string[]).length : String(v[q.id] ?? "").trim())).map((q) => ({ id: `q-${q.id}`, label: q.label }));
    const p = String(v.paket ?? "");
    if (p.startsWith("Premium") && !v.extra) out.push({ id: "q-extra", label: "Premium-Extra wählen" });
    if (photos.enabled && String(v.logo ?? "").startsWith("Ja") && !photos.done.some((x) => x.group === "Logo")) out.push({ id: "up-logo", label: "Logo hochladen" });
    if (photos.enabled && String(v.fotos ?? "").startsWith("Ja") && !photos.done.some((x) => x.group === "Fotos")) out.push({ id: "up-fotos", label: "Fotos hochladen" });
    return out;
  };

  // the chosen package decides what is paid next; "Noch unsicher" leads to a call instead
  const pay = () => {
    const p = String(v.paket ?? "").split("|")[0];
    const price: Record<string, string> = { Basis: "300 €", Business: "690 €", Premium: "1.290 €" };
    return price[p] ? { href: `/shop?web=${p}`, label: `Website ${p} für ${price[p]}` } : null;
  };

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
      lead="Mit diesen Angaben bauen wir Ihre Website komplett, ohne nachzufragen. Felder mit „Pflicht“ brauchen wir zum Start, alles andere macht das Ergebnis besser. Dauer: etwa 15 Minuten. Ihre Eingaben bleiben in diesem Browser gespeichert, Sie können jederzeit unterbrechen."
      steps={[
        ["Fragebogen ausfüllen", "Stichpunkte reichen. Logo und Fotos direkt hochladen."],
        ["In den Warenkorb, bezahlen", "Direkt im Anschluss, sicher über Stripe. Die Rechnung kommt per E-Mail."],
        ["Entwurf ansehen", "Per E-Mail-Link: Basis in 5, Business und Premium in 7 Tagen ab Zahlung."],
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
            photos.enabled === false ? (
              <div className="bf-q"><p className="bf-off">Der Upload ist gerade nicht verfügbar. Logo, Fotos und Texte schicken Sie uns nach der Bestellung per E-Mail, am besten in Originalgröße.</p></div>
            ) : (
              <>
                <div className="bf-q" id="up-logo" tabIndex={-1}>
                  <span className="lab">Logo</span>
                  <p className="bf-hint">Am liebsten als SVG oder PDF, sonst als PNG mit durchsichtigem Hintergrund.</p>
                  <PhotoSlots group="Logo" photos={photos} accept="image/*,.pdf,.svg" />
                </div>
                <div className="bf-q" id="up-fotos" tabIndex={-1}>
                  <span className="lab">Fotos</span>
                  <p className="bf-hint">Sie, Ihr Team, Ihre Räume, Produkte oder Arbeiten. Gern 10 bis 30 Stück, in Originalgröße (nicht über WhatsApp verkleinert). Im Dateinamen gern, wohin das Foto gehört, z. B. „team-anna.jpg“.</p>
                  <PhotoSlots group="Fotos" photos={photos} accept="image/*" />
                </div>
                <div className="bf-q">
                  <span className="lab">Dokumente (optional)</span>
                  <p className="bf-hint">Speisekarte, Preisliste, fertige Texte, Datenschutzerklärung als PDF oder Bild.</p>
                  <PhotoSlots group="Dokumente" photos={photos} accept="image/*,.pdf" />
                </div>
              </>
            )
          )}
        </Sec>
      ))}
      <Submit kind="website" n={sections.length + 1} answers={answers} photos={photos} button="Fragebogen senden" onDone={setDone} pay={pay} missing={missing} />
    </Shell>
  );
}
