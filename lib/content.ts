// Copy and data for the content sections, kept apart from the layout code.

export const principles = [
  { title: "Persönlich", text: "Sie sprechen direkt mit uns, den Gründern. Keine Hotline, keine wechselnden Ansprechpartner." },
  { title: "Transparent", text: "Klare Festpreise, bevor wir beginnen. Websites und Roomtours bereits ab 300 €." },
  { title: "Sorgfältig", text: "Wir arbeiten mit aktueller Technik und achten auf jedes Detail, von der Typografie bis zum Impressum." },
] as const;

export const services = [
  {
    id: "nfc",
    index: "01",
    title: "NFC Google Review Disc",
    price: "Weiß oder Schwarz",
    text: "Ihre Kunden halten das Smartphone an die Platte und landen direkt bei Ihrer Google-Bewertung, ohne App und ohne Suchen.",
    features: ["Ø 10 cm, Acryl", "Mit Ihrem Firmennamen", "iPhone & Android", "Mengenrabatt ab 10 Stück"],
  },
  {
    id: "web",
    index: "02",
    title: "Webseiten-Erstellung",
    price: "ab 300 €",
    text: "Eine Website, die Ihr Unternehmen so zeigt, wie es ist: hochwertig, schnell und auf jedem Gerät stimmig. Vom One-Pager bis zur umfangreichen Firmenseite.",
    features: ["Individuelles Design", "Für Smartphone optimiert", "Impressum & Datenschutz", "Hosting auf Wunsch"],
  },
  {
    id: "roomtour",
    index: "03",
    title: "Roomtour & 360°-Rundgang",
    price: "ab 300 €",
    text: "Virtuelle Rundgänge und Walkthrough-Videos für Immobilien, Ferienwohnungen, Hotels und Gewerbe. Interessenten erleben Ihre Räume, bevor sie kommen.",
    features: ["360°-Rundgang", "Walkthrough-Video", "Grundriss & Info-Punkte", "Für Website & Portale"],
  },
] as const;

export const process = [
  { title: "Gespräch", text: "Sie erzählen uns, was Sie vorhaben. Telefonisch oder bei einem Kaffee in München." },
  { title: "Angebot", text: "Sie erhalten ein klares Festpreis-Angebot, ohne versteckte Kosten." },
  { title: "Umsetzung", text: "Wir gestalten, bauen und filmen. Sie sehen Zwischenstände und geben Feedback." },
  { title: "Übergabe", text: "Alles läuft, Sie wissen, wie es funktioniert, und wir bleiben erreichbar." },
] as const;

// PLATZHALTER: Replace these with real, approved customer quotes before going live.
// Invented testimonials are prohibited under German competition law (UWG).
export const testimonials = [
  {
    quote: "Seit die NFC-Platte an unserer Theke liegt, bekommen wir regelmäßig neue Bewertungen. Unsere Gäste nutzen sie ganz selbstverständlich.",
    name: "Beispielkunde",
    role: "Gastronomie, München",
  },
  {
    quote: "Die Website war schnell fertig, wirkt hochwertig und war trotzdem bezahlbar.",
    name: "Beispielkunde",
    role: "Handwerksbetrieb, Oberbayern",
  },
  {
    quote: "Mit dem Rundgang konnten sich Interessenten die Wohnung vorab ansehen. Das hat uns viele Termine gespart.",
    name: "Beispielkunde",
    role: "Vermietung, München",
  },
] as const;

export const faqs = [
  {
    q: "Wie funktioniert die NFC-Platte?",
    a: "In der Platte steckt ein NFC-Chip mit dem Link zu Ihrer Google-Bewertungsseite. Hält ein Kunde sein Smartphone daran, öffnet sich die Seite direkt im Browser.",
  },
  {
    q: "Brauchen meine Kunden eine App?",
    a: "Nein. Aktuelle iPhones und Android-Smartphones lesen NFC ohne zusätzliche App. Bei Android muss NFC in den Einstellungen aktiviert sein, was meist der Fall ist.",
  },
  {
    q: "Was bekomme ich für eine Website ab 300 €?",
    a: "Das Basis-Paket ist ein moderner One-Pager mit Ihren Inhalten, optimiert für Smartphone und Computer, inklusive Kontaktformular, Impressum und Datenschutz. Mehr Seiten oder Funktionen gibt es in den größeren Paketen.",
  },
  {
    q: "Wie läuft eine Roomtour ab?",
    a: "Wir vereinbaren einen Termin vor Ort, nehmen die Räume auf und bereiten den Rundgang auf. Sie erhalten einen Link, den Sie auf Ihrer Website oder auf Immobilienportalen einbinden können.",
  },
  {
    q: "Gibt es versteckte Kosten?",
    a: "Nein. Sie erhalten vorab ein Festpreis-Angebot. Laufende Kosten entstehen nur, wenn Sie zum Beispiel Hosting und Wartung bei uns buchen.",
  },
] as const;

/** Platforms the products work with, shown as quiet wordmarks (no partnership implied). */
export const compatible = ["iPhone", "Android", "Google Business Profile", "Google Maps", "Immobilienportale"] as const;
