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
Schriften: **Manrope** (Überschriften und Text), im Logo Cormorant Garamond (Monogramm) und Cinzel („SOLUTIONS“).
Tokens: `tailwind.config.ts`, Komponentenklassen: `app/globals.css`.

## Aufbau (`app/page.tsx`, Komponenten in `components/split/`)

Geteilter Bildschirm: Links steht auf dem Desktop eine feste Spalte (`Sidebar.tsx`) mit Botschaft, Buttons, mitlaufendem Inhaltsverzeichnis und Kontakt. Rechts scrollen die Inhalte als nummerierte Panels (`Panel.tsx`):

1. **Überblick:** 3D-NFC-Platte auf großer Fläche, drei Kennzahlen.
2. **Leistungen:** Kacheln (NFC breit, Website und Roomtour nebeneinander).
3. **NFC-Platte:** dunkle 3D-Bühne mit Farbwahl und „Aufbau zeigen“, drei Schritte.
4. **Preise:** Tabs Website / Roomtour / NFC-Platte (NFC mit Mengenrechner).
5. **Über uns:** Gründer, Prinzipien, Kundenstimmen.
6. **FAQ**, 7. **Anfrage** (4-Schritte-Assistent), Footer.

Auf dem Handy: Kopfleiste mit Menü (`MobileBar.tsx`), danach alle Bereiche untereinander.

3D: `components/three/NfcProduct.tsx` (Platte aus zwei Acrylhälften mit Kupferantenne und NTAG-215-Chip), Artwork in `lib/drawNfc.ts`.

## Eigenständige Version `standalone/index.html`
Eine einzelne HTML-Datei ohne Build-Schritt (HTML, CSS, Vanilla JS, Three.js r128 per CDN): Lade-Animation, 3D-Hintergrund (NFC-Platte mit Google-Design und F&D-Rückseite, Roomtour-Drahtmodell mit Raumwahl), NFC-Tap-Demo, Website-Mockup, Konfigurator und 4-Schritte-Anfrage.
Einfach per Doppelklick im Browser öffnen oder auf einen beliebigen Webspace hochladen. Anfragen gehen ohne weitere Einrichtung per vorbereiteter E-Mail an `fd.solutions@web.de`. Mit einem Formular-Dienst (z. B. Formspree) trägt man dessen URL oben im Skript bei `FORM_ENDPOINT` ein.

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
