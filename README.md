# F&D Solutions: Firmen-Website

> 📱 Die mobile App **Gabelmatch** liegt eigenständig im Ordner [`gabelmatch/`](gabelmatch/README.md).

Moderne, seriöse One-Page-Website für **F&D Solutions** (München): runde NFC Google Review Discs (Weiß/Schwarz), Webseiten-Erstellung ab 300 € und Roomtours ab 300 €.

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
| Hero | `components/sections/Hero.tsx` | F&D-Logo, Slogan, CTAs, drehbare 3D-NFC-Platte |
| Vision | `components/sections/About.tsx` | Werte + die Visitenkarte als neigbare 3D-Karte (klickbare Telefonnummern) |
| Leistungen | `components/sections/Services.tsx` | 3 Showcase-Cards mit Live-Vorschauen (Tap-Animation, Browser-Mockup, 3D-Punktwolken-Roomtour) |
| Konfigurator | `components/sections/Configurator.tsx` | NFC-Studio für die runde Review Disc (Farbe Weiß/Schwarz, Sprache, Firmenname, Menge, Preis) + Paket-Builder Web/Roomtour |
| Referenzen | `components/sections/Trust.tsx` | Kennzahlen, Testimonials, Vertrauenssiegel |
| Anfrage | `components/sections/Inquiry.tsx` | 4-Schritte-Wizard mit Validierung, Übersicht, Erfolgsmeldung |
| Footer / Recht | `Footer.tsx`, `app/impressum`, `app/datenschutz` | Schnellnavigation, Kontakt, Social, Impressum, Datenschutz |

### 3D
- `components/three/NfcProduct.tsx`: runde NFC Review Disc (Ø 10 cm) aus zwei Acrylhälften, dazwischen Kupfer-Antenne + NTAG-215-Chip. „NFC-Chip zeigen“ öffnet die Explosionsansicht. Ziehen zum Drehen (mit Trägheit).
- `lib/drawNfc.ts`: Canvas-Artwork (Google-Farbring, „Tap Here“, Wordmark, Sterne, Firmenname, Chip-Inlay), live neu gezeichnet.
- `components/three/RoomScan.tsx`: KI-Raumscan als Punktwolke mit Scan-Welle und Kamerafahrt.
- Alle Canvases werden lazy geladen und pausieren außerhalb des Viewports.

## Startseite `/`
Hauptdesign mit 3D-Erlebnissen (`components/v3/`, Seite `app/page.tsx`):
- **Hero:** 3D-Animation (`components/three/TapStory.tsx`): Ein Smartphone tippt die NFC-Platte an, NFC-Wellen, die Google-Bewertung öffnet sich, fünf 3D-Sterne fliegen heraus. Die Schritt-Beschriftungen laufen synchron (`lib/story.ts`).
- **NFC-Platte:** Scroll-gesteuerte Zerlegung in Frontplatte, NFC-Chip/Antenne und Rückplatte mit Beschriftungen (`components/three/ChipStage.tsx`), Farbwahl Weiß/Schwarz.
- **Websites:** Vorher/Nachher-Regler (`components/v3/WebCompare.tsx`).
- **Roomtour:** Begehbarer 3D-Beispielraum mit Scan-Effekt und Kamerafahrten (`components/three/RoomTour.tsx`).
- Danach Ablauf, Preise, Team, FAQ, Anfrage. Weiches Scrollen über Lenis.

Frühere Varianten zum Vergleich: **/v1** (erste Version) und **/v2** (Bento-Layout).

## Designvariante `/v2`
Alternative Gestaltung unter **/v2** mit denselben Inhalten, Preisen und demselben Anfrage-Assistenten (`components/v2/`):
Pill-Navigation, Bento-Hero mit 3D-Platte, Scroll-Showcase mit fest stehender 3D-Bühne (NFC-Platte → Laptop mit Beispiel-Website → Raumscan, `components/three/ShowcaseStage.tsx`), Ablauf in 4 Schritten, Preistabellen mit Tabs, Team-Karten und FAQ.

## Farben
Helles Design: Hintergrund `slate-50`, weiße Karten, Akzentblau `brand` (#2563eb) in `tailwind.config.ts`.
Jede Leistung hat eine eigene Akzentfarbe (`lib/accents.ts`): NFC grün, Website blau, Roomtour bernstein.
Navy und Gold gibt es nur noch auf der nachgebauten Visitenkarte.

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
- `lib/pricing.ts`: Einstiegspreise (Website und Roomtour je ab 300 €) sind vorgegeben, die höheren Pakete, Extras und der NFC-Preis sind **Platzhalter-Richtwerte**.
- `lib/content.ts`: Die **Testimonials sind Platzhalter** und müssen durch echte, freigegebene Kundenstimmen ersetzt werden (erfundene Bewertungen sind nach UWG unzulässig).
- `app/impressum`, `app/datenschutz`: Mustertexte, bitte rechtlich prüfen lassen.
