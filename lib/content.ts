// Copy and data for the content sections. Kept apart from the components so the
// texts can be edited without touching layout code.

export const pillars = [
  {
    title: "Seriosität",
    text: "Feste Ansprechpartner, transparente Festpreise und Verträge ohne Kleingedrucktes. Wir sind erreichbar, persönlich und in München.",
    icon: "shield",
  },
  {
    title: "High-Tech",
    text: "NFC-Hardware, 3D-Web und KI-Bildverarbeitung: Wir setzen Technologie ein, die heute schon den Standard von morgen definiert.",
    icon: "spark",
  },
  {
    title: "Automatisierung",
    text: "Unsere Lösungen arbeiten für Sie, rund um die Uhr. Mehr Bewertungen, mehr Anfragen, mehr Buchungen, ohne zusätzlichen Aufwand.",
    icon: "loop",
  },
] as const;

export const services = [
  {
    id: "nfc",
    index: "01",
    title: "NFC Google Review Cards & Stands",
    kicker: "Bewertungen auf Knopfdruck",
    text: "Ein Tap mit dem Smartphone öffnet direkt Ihr Google-Bewertungsformular, ohne App und ohne Suchen. Edle Acryl-Aufsteller, Platten und Karten mit eingebettetem NTAG-215-Chip und QR-Fallback.",
    features: ["Funktioniert mit iPhone & Android", "Individuelles Branding & Farben", "Ziel-Link jederzeit änderbar", "Ab 1 Stück, Mengenrabatt ab 10"],
  },
  {
    id: "web",
    index: "02",
    title: "High-End Webentwicklung",
    kicker: "Websites, die verkaufen",
    text: "Maßgeschneiderte Websites mit Next.js, 3D-Elementen und durchdachter Nutzerführung. Blitzschnell, SEO-stark und auf Conversion optimiert, damit aus Besuchern Kunden werden.",
    features: ["Individuelles Design, keine Templates", "Lighthouse-Ziel 95+", "SEO, Analytics & DSGVO-konform", "Hosting & Wartung auf Wunsch"],
  },
  {
    id: "roomtour",
    index: "03",
    title: "KI-Roomtour & Walkthroughs",
    kicker: "Räume erleben, bevor man sie betritt",
    text: "Immersive 360°-Rundgänge und KI-gestützte Walkthrough-Videos in bis zu 8K für Immobilien, Hotels und Gewerbe. Inklusive Grundriss, Hotspots und optionalem KI-Home-Staging.",
    features: ["360°-Rundgang in 8K", "KI-Walkthrough-Video in 4K", "Hotspots, Grundriss & Maße", "Einbettung auf Website & Portalen"],
  },
] as const;

/** Product facts, not track-record claims, so they stay true from day one. */
export const stats = [
  { value: 3, suffix: " Sek.", label: "vom Tap zur Bewertung" },
  { value: 13.56, suffix: " MHz", label: "NFC-Frequenz, ISO 14443", decimals: 2 },
  { value: 95, suffix: "+", label: "Lighthouse-Zielwert" },
  { value: 8, suffix: "K", label: "Roomtour-Auflösung" },
] as const;

// PLATZHALTER: Replace these with real, approved customer quotes before going live.
// Invented testimonials are prohibited under German competition law (UWG).
export const testimonials = [
  {
    quote: "Seit die NFC-Aufsteller an unserer Theke stehen, bekommen wir jede Woche neue Bewertungen. Die Gäste finden es sogar spannend.",
    name: "Beispielkunde",
    role: "Gastronomie · München",
  },
  {
    quote: "Die neue Website wirkt so hochwertig wie unser Produkt. Die Anfragen über das Formular haben sich spürbar erhöht.",
    name: "Beispielkunde",
    role: "Handwerksbetrieb · Oberbayern",
  },
  {
    quote: "Mit der KI-Roomtour konnten Interessenten die Wohnung vorab erleben. Besichtigungen waren dadurch deutlich zielgerichteter.",
    name: "Beispielkunde",
    role: "Immobilienmakler · München",
  },
] as const;

export const seals = [
  { title: "DSGVO-konform", text: "Datenschutz by Design" },
  { title: "Hosting in der EU", text: "Server-Standort Deutschland" },
  { title: "Persönlich", text: "Feste Ansprechpartner" },
  { title: "Festpreise", text: "Transparent und verbindlich" },
] as const;
