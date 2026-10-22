# F&D Solutions – Design-Briefing

Website der Agentur F&D Solutions (München): NFC-Platten für Google-Bewertungen, Webseiten-Erstellung, KI-Roomtours.
Gründer: Florian Dressler (+49 155 66456417) und Davy Stubenrauch (+49 176 56612709), fd.solutions@web.de.

## Aktuelle Richtung
Maßgeblich ist `public/studio/index.html` (online unter `/studio/index.html`).

## Vorbilder (vom Kunden ausgewählt)
- **All Star Burgers (wearebrand.io):** Produkt als Held, groß und freigestellt. Fette, schmale Großbuchstaben-Schrift. Produkt zerlegt sich beim Scrollen in seine Schichten, mit feinen Beschriftungslinien. Angebote als „Speisekarte“ mit großem Bild, Name und Preis.
- **QCLAY / CryptoHub:** Hintergrund wechselt beim Scrollen (hier nur Creme ↔ Dunkel). Schwebende Elemente um eine zentrale Aussage. Handy in der Mitte, Überschrift links, Text rechts. Dunkle Sektion mit hellen Kacheln und Mini-Illustrationen.

## Design-Regeln
- Farben: Creme `#f3f0e8`, Papier `#faf9f5`, Tiefschwarz `#111110`, Dunkel `#121212`, Akzent nur ein ruhiger Sandton `#d6ccb8` (hell: `#ebe5d9`). Bunte Akzente (Limette, Orange, Himmelblau) wurden abgelehnt: zu viele Farben, zu wenig seriös. Betonung über Schwarz/Weiß.. Google-Farben nur auf dem NFC-Produkt.
- Schrift: Anton (Überschriften, Großbuchstaben) + Inter (Text).
- Buttons eckig (Radius 6 px), Großbuchstaben, keine Leuchteffekte.

## Nicht verwenden (wirkt wie eine Standard-KI-Website)
- Gold oder dunkles Navy-Gold-Schema
- Farbverläufe in Überschriften, Leuchtflecken, Glas-Kacheln überall
- Das immer gleiche Muster „Eyebrow + Überschrift + Untertitel + drei Icon-Karten“
- Zentrierte Textwände, Countdown-Timer, Popups
- Mehrere Komplett-Neugestaltungen hintereinander: lieber gezielt an der bestehenden Version weiterarbeiten

## Fakten zum Angebot
- NFC: nur **runde** Acryl-Platten (Ø 10 cm), nur **Weiß und Schwarz**, Chip NTAG 215. Preis: auf Anfrage.
- Websites ab 300 € (Basis), Roomtours ab 300 € (Basis). Höhere Pakete (690/1.290 €, 490/790 €) sind Platzhalter.
- Kundenstimmen sind noch Platzhalter und müssen durch echte ersetzt werden.

## Widgets (Stand jetzt)
- Websites: Laptop + Handy zeigen dieselbe Beispielseite (Café / Handwerk / Immobilien umschaltbar, Container-Queries).
- Paketkarten: schlicht (Name, Preis, Häkchen-Liste, Button „Jetzt anfragen“ / bei NFC „Jetzt bestellen“). Bilder in den Preiskarten waren dem Kunden zu unübersichtlich.
- Startseite: links „Mehr [Bewertungen./Kunden./Buchungen.]“ (wechselndes Wort auf schwarzem Balken), Text, 2 Buttons, Fakten-Zeile; rechts eine Collage der drei Produkte (Roomtour-Standbild mit Ken-Burns-Zoom, Handy mit Beispiel-Website, CSS-NFC-Platte), klickbar zu 01/02/03, leichte Maus-Parallaxe.
- NFC-Animation (15-s-Schleife): aktuelles iPhone (abgerundeter Aluminiumrahmen, Dynamic Island, Statusleiste, maßstabsgetreu zur 10-cm-Platte, ohne Apple-Logo) tippt auf die Platte, Wellen, Google-Bewertungsseite leuchtet auf → Platte öffnet sich, **jede Schicht wird einzeln hervorgehoben** (Rest abgeblendet, passende Beschriftung fett) mit Schritt-Text oben links, damit klar ist, welche Beschreibung zu welchem Teil gehört.
- Aufbau (vom Kunden genau so vorgegeben, **kompakt**: „nicht so viel Text, keine halbe Seite Platz“): kurzes Intro ohne 3D → je Leistung **ein Panel**: Kopfzeile (Nummer, Titel, ein Satz) → links das Modell (01 NFC: 3D-Platte öffnet sich automatisch in Schichten, ziehbar, Farbe folgt der Weiß/Schwarz-Wahl; 02 Laptop/Handy mit Beispielen; 03 Roomtour-Video) → rechts daneben die Kaufbox (4 Details, Preis, Anfrage-Button, Link „Alle Pakete & Preise“) → **Preise & Pakete am Ende** (Reiter) → Team → Anfrage. Keine Scroll-Strecken, keine Bewertungs-Chips, keine Zwischenlisten.
- Roomtour: Ablauf „Fotos senden → Roomtour entsteht → Mehr Buchungen“ (KI-Roomtours entstehen aus Kundenfotos, Zielgruppe u. a. Airbnb/Ferienwohnungen). Video-Player mit Kapiteln (`public/media/roomtour-villa.mp4`, Vorschaubild `roomtour-villa.jpg`). Aktuell ein vom Kunden mit KI erstelltes Beispielvideo (Wohnung: Flur, Wohnzimmer, Balkon; farblich neutralisiert, leicht verlangsamt, feines Korn), deshalb gekennzeichnet als „KI-Roomtour · Beispiel“ und nicht als „gefilmt vor Ort“. Keine 3D-Modelle, keine fremden Videos. Ohne Datei ist der Player ausgeblendet.

- Anfragen: jede Leistungs-Sektion hat einen eigenen Anfrage-Button; auf dem Handy feste Leiste „Anrufen / Jetzt anfragen“.

## Technik
- Next.js-Projekt im Root (`app/`, `components/`); eigenständige HTML-Seiten liegen in `public/` und werden von Vercel mit ausgeliefert.
- Three.js r128 per CDN in den eigenständigen Seiten.
