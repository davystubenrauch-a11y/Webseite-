# F&D Solutions: Firmen-Website

Luxuriöse, futuristische One-Page-Website für **F&D Solutions** (München): NFC Google Review Cards & Stands, High-End-Webentwicklung und KI-Roomtours.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS · React Three Fiber + drei (three.js) · Framer Motion

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint     # TypeScript-Prüfung
```

## Aufbau

| Bereich | Datei | Inhalt |
|---|---|---|
| Hero | `components/sections/Hero.tsx` | F&D-Logo, Slogan, CTAs, drehbare 3D-NFC-Platte mit Partikeln, Parallax |
| Vision | `components/sections/About.tsx` | Werte + die Visitenkarte als neigbare 3D-Karte (klickbare Telefonnummern) |
| Leistungen | `components/sections/Services.tsx` | 3 Showcase-Cards mit Live-Vorschauen (Tap-Animation, Browser-Mockup, 3D-Punktwolken-Roomtour) |
| Konfigurator | `components/sections/Configurator.tsx` | NFC-Studio (Form, Design, Sprache, Firmenname, Menge, Preis) + Paket-Builder Web/Roomtour |
| Referenzen | `components/sections/Trust.tsx` | Kennzahlen, Testimonials, Vertrauenssiegel |
| Anfrage | `components/sections/Inquiry.tsx` | 4-Schritte-Wizard mit Validierung, Übersicht, Erfolgsmeldung |
| Footer / Recht | `Footer.tsx`, `app/impressum`, `app/datenschutz` | Schnellnavigation, Kontakt, Social, Impressum, Datenschutz |

### 3D
- `components/three/NfcProduct.tsx`: NFC-Produkt (Round Disc, Theken-Stand, Review Card) aus zwei Acrylhälften, dazwischen Kupfer-Antenne + NTAG-215-Chip. „NFC-Chip zeigen“ öffnet die Explosionsansicht. Ziehen zum Drehen (mit Trägheit).
- `lib/drawNfc.ts`: Canvas-Artwork (Google-Farbring, „Tap Here“, Wordmark, Sterne, Firmenname, Chip-Inlay), live neu gezeichnet.
- `components/three/RoomScan.tsx`: KI-Raumscan als Punktwolke mit Scan-Welle und Kamerafahrt.
- Alle Canvases werden lazy geladen und pausieren außerhalb des Viewports.

## Anfrage-Versand
`app/api/inquiry/route.ts` validiert serverseitig (gleiches Schema wie der Client, `lib/inquiry.ts`), mit Honeypot und Rate-Limit. Versand über Umgebungsvariablen:

```bash
RESEND_API_KEY=...                 # E-Mail via resend.com
INQUIRY_TO=fd.solutions@web.de
INQUIRY_FROM="F&D Solutions <anfrage@ihre-domain.de>"
# oder
INQUIRY_WEBHOOK_URL=https://...    # Make, Zapier, n8n, Formspree …
```
Ohne Konfiguration öffnet der Wizard automatisch eine vorausgefüllte E-Mail an `fd.solutions@web.de`. Es geht also keine Anfrage verloren.

## Vor dem Livegang anpassen
- `lib/site.ts`: **Postanschrift** (Pflicht fürs Impressum), Social-Links.
- `lib/pricing.ts`: alle Preise sind **Platzhalter-Richtwerte**.
- `lib/content.ts`: Die **Testimonials sind Platzhalter** und müssen durch echte, freigegebene Kundenstimmen ersetzt werden (erfundene Bewertungen sind nach UWG unzulässig).
- `app/impressum`, `app/datenschutz`: Mustertexte, bitte rechtlich prüfen lassen.
