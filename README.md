# F&D Solutions: Website

Website der Digitalagentur **F&D Solutions** (München): NFC Google Review Discs, Webseiten-Erstellung ab 300 € und Roomtours ab 300 €.

**Stack:** Next.js (App Router) · React · Tailwind CSS · React Three Fiber + drei (three.js) · Framer Motion

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint     # TypeScript-Prüfung
```

## Gestaltung

| Rolle | Farbe | Einsatz |
|---|---|---|
| Hintergrund | Paper `#F9F8F6` | warmes Off-White statt Reinweiß |
| Text / dunkles Band | Ink `#1C1B19` | warmes Tiefschwarz für Schrift, NFC-Sektion, Footer |
| Akzent | Deep Sage `#4A5D52` | Hervorhebungen, aktive Zustände, Formular-Fokus |
| Nebennote | Taupe `#A39382` | Nummern, Trennlinien, Zitatzeichen |

Google-Farben erscheinen ausschließlich auf dem NFC-Produkt selbst.
Schriften: **Playfair Display** (Headlines), **Inter** (Fließtext), Cinzel nur im Logo-Schriftzug „SOLUTIONS“.
Layout: 12-Spalten-Raster (`.grid-12`), Container `.container-site`, Sektionsabstand `.section` (96/128/160 px).
Tokens: `tailwind.config.ts`, Komponentenklassen: `app/globals.css`.

## Aufbau (`app/page.tsx`, Komponenten in `components/premium/`)

1. **Hero:** Serif-Headline auf Mesh-Gradient, ruhige CTAs, drehbare 3D-NFC-Platte im Glasrahmen, Leiste „Funktioniert mit“.
2. **Haltung:** kurzes Statement und drei Prinzipien.
3. **Leistungen:** editoriale Liste im 12-Spalten-Raster.
4. **NFC Review Disc:** dunkles Band, 3D-Modell mit Farbwahl und „Aufbau zeigen“ (Chip sichtbar), drei Schritte.
5. **Ablauf:** vier Schritte.
6. **Preise:** Tabs Website / Roomtour / NFC-Platte (NFC mit Mengenrechner).
7. **Stimmen**, **Über uns**, **FAQ**.
8. **Anfrage:** 4-Schritte-Assistent (`components/sections/Inquiry.tsx`) mit Validierung.
9. **Footer** mit Kontakt, Impressum, Datenschutz.

3D: `components/three/NfcProduct.tsx` (Platte aus zwei Acrylhälften mit Kupferantenne und NTAG-215-Chip), Artwork in `lib/drawNfc.ts`.

## Anfrage-Versand
`app/api/inquiry/route.ts` validiert serverseitig (gleiches Schema wie der Client, `lib/inquiry.ts`), mit Honeypot und Rate-Limit. Versand über Umgebungsvariablen:

```bash
RESEND_API_KEY=...                 # E-Mail via resend.com
INQUIRY_TO=fd.solutions@web.de
INQUIRY_FROM="F&D Solutions <anfrage@ihre-domain.de>"
# oder
INQUIRY_WEBHOOK_URL=https://...    # Make, Zapier, n8n, Formspree …
```
Ohne Konfiguration öffnet der Assistent eine vorausgefüllte E-Mail an `fd.solutions@web.de`.

## Vor dem Livegang anpassen
- `lib/site.ts`: **Postanschrift** (Pflicht fürs Impressum), Social-Links.
- `lib/pricing.ts`: Website und Roomtour je ab 300 € sind vorgegeben. Die höheren Pakete, die Extras und der NFC-Preis sind **Platzhalter-Richtwerte**.
- `lib/content.ts`: Die **Kundenstimmen sind Platzhalter** und müssen durch echte, freigegebene Zitate ersetzt werden (erfundene Bewertungen sind nach UWG unzulässig).
- `app/impressum`, `app/datenschutz`: Mustertexte, bitte rechtlich prüfen lassen.
