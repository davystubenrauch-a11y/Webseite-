// Copy and data for the content sections. Kept apart from the components so the
// texts can be edited without touching layout code.

export const pillars = [
  {
    title: "Persönlich",
    text: "Sie sprechen direkt mit uns, den beiden Gründern. Keine Hotline, keine wechselnden Ansprechpartner.",
    icon: "shield",
  },
  {
    title: "Fair",
    text: "Klare Festpreise, bevor wir starten. Websites und Roomtours gibt es schon ab 300 €.",
    icon: "check",
  },
  {
    title: "Modern",
    text: "Wir arbeiten mit aktueller Technik, damit Ihr Unternehmen online so gut aussieht wie vor Ort.",
    icon: "spark",
  },
] as const;

export const services = [
  {
    id: "nfc",
    index: "01",
    title: "NFC Google Review Disc",
    kicker: "Mehr Google-Bewertungen",
    text: "Ihre Kunden halten das Handy an die Platte und landen direkt bei Ihrer Google-Bewertung, ohne App und ohne Suchen. Runde Acryl-Platte (Ø 10 cm) mit NFC-Chip, in Weiß oder Schwarz.",
    features: ["Funktioniert mit iPhone & Android", "Weiß oder Schwarz", "Mit Ihrem Firmennamen", "Mengenrabatt ab 10 Stück"],
  },
  {
    id: "web",
    index: "02",
    title: "Webseiten-Erstellung",
    kicker: "Ab 300 €",
    text: "Eine moderne Website, die auf Handy und Computer gut aussieht und schnell lädt. Vom einfachen One-Pager bis zur größeren Firmenseite, mit Impressum und Datenschutz.",
    features: ["Modernes, individuelles Design", "Für Handy optimiert", "Kontaktformular & Google Maps", "Hosting auf Wunsch"],
  },
  {
    id: "roomtour",
    index: "03",
    title: "Roomtour & 360°-Rundgang",
    kicker: "Ab 300 €",
    text: "Virtuelle Rundgänge und Walkthrough-Videos für Immobilien, Ferienwohnungen, Hotels und Gewerbe. Interessenten sehen sich die Räume online an, bevor sie vorbeikommen.",
    features: ["360°-Rundgang", "Walkthrough-Video", "Grundriss & Info-Punkte", "Für Website & Immobilienportale"],
  },
] as const;

/** Facts about the offer, not track-record claims, so they stay true from day one. */
export const stats = [
  { value: 300, suffix: " €", label: "Websites ab" },
  { value: 300, suffix: " €", label: "Roomtours ab" },
  { value: 24, suffix: " h", label: "Antwortzeit" },
  { value: 2, suffix: "", label: "feste Ansprechpartner" },
] as const;

// PLATZHALTER: Replace these with real, approved customer quotes before going live.
// Invented testimonials are prohibited under German competition law (UWG).
export const testimonials = [
  {
    quote: "Seit die NFC-Platte an unserer Theke klebt, bekommen wir regelmäßig neue Bewertungen. Die Gäste nutzen sie gern.",
    name: "Beispielkunde",
    role: "Gastronomie · München",
  },
  {
    quote: "Die neue Website war schnell fertig, sieht professionell aus und war bezahlbar. Genau das, was wir gebraucht haben.",
    name: "Beispielkunde",
    role: "Handwerksbetrieb · Oberbayern",
  },
  {
    quote: "Mit dem Rundgang konnten sich Interessenten die Wohnung vorab ansehen. Das hat uns viele Besichtigungen gespart.",
    name: "Beispielkunde",
    role: "Vermietung · München",
  },
] as const;

export const seals = [
  { title: "DSGVO-konform", text: "Datenschutz von Anfang an" },
  { title: "Aus München", text: "Persönlich vor Ort" },
  { title: "Festpreise", text: "Keine versteckten Kosten" },
  { title: "Schnell", text: "Antwort innerhalb von 24 h" },
] as const;
