# F&D Solutions – Design-Briefing

Website der Agentur F&D Solutions (München): NFC-Platten für Google-Bewertungen, Webseiten-Erstellung, KI-Roomtours.
Gründer: Florian Dressler (+49 155 66456417) und Davy Stubenrauch (+49 176 56612709), fd.solutions@web.de.

## Aktuelle Richtung
Maßgeblich ist `public/studio/index.html` (online unter `/studio/index.html`).

## Vorbilder (vom Kunden ausgewählt)
- **All Star Burgers (wearebrand.io):** Produkt als Held, groß und freigestellt. Fette, schmale Großbuchstaben-Schrift. Produkt zerlegt sich beim Scrollen in seine Schichten, mit feinen Beschriftungslinien. Angebote als „Speisekarte“ mit großem Bild, Name und Preis.
- **QCLAY / CryptoHub:** (Hintergrund-Farbwechsel beim Scrollen wurde vom Kunden abgelehnt.) Schwebende Elemente um eine zentrale Aussage. Handy in der Mitte, Überschrift links, Text rechts. Dunkle Sektion mit hellen Kacheln und Mini-Illustrationen.

## Design-Regeln (Version 6, klassische vollständige Dienstleistungsseite)
- Kunde will: übersichtlich, seriös, alles drin, was eine Dienstleistungsseite braucht; 3D/Vorschauen nur **klein**.
- Aufbau: Header (Leistungen, Ablauf, Preise, Über uns, FAQ, Telefon, Button) → Hero (links Versprechen + 2 Buttons + 3 Häkchen, rechts drei kleine Vorschau-Kacheln: NFC-3D, Mini-Laptop, Roomtour-Video) → Vertrauensleiste (4 Punkte) → Leistungsübersicht (3 Karten) → Detail NFC / Websites / KI-Roomtours (abwechselnd links/rechts, Häkchen, Preis, Button) → Warum wir (dunkel, 4 Punkte) → Ablauf (4 Schritte) → Preise (Reiter) → Über uns → FAQ → Kontakt mit Formular → Footer.
- Farben: Weiß, Hellgrau `#f5f6f8`, Dunkel `#10131a`, ein Markenblau `#2341d6` für Buttons und Akzentwörter. Google-Farben nur am NFC-Produkt.
- Schrift: **Plus Jakarta Sans** durchgehend (800 für Überschriften).
- Abgelehnt: große Vollbild-Bühnen, Kästen mit Rand um alles im „KI-Look“, Scroll-Farbwechsel, Limette/Orange/Himmelblau, Nachtblau-Elfenbein, Anton/Bricolage/Manrope-Varianten.

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
- NFC: Szene „iPhone tippt“ läuft in der Startseite, im Panel 01 nur noch das Öffnen mit Schicht-Hervorhebung. iPhone-Details: (abgerundeter Aluminiumrahmen, Dynamic Island, Statusleiste, maßstabsgetreu zur 10-cm-Platte, ohne Apple-Logo) tippt auf die Platte, Wellen, Google-Bewertungsseite leuchtet auf → Platte öffnet sich, **jede Schicht wird einzeln hervorgehoben** (Rest abgeblendet, passende Beschriftung fett) mit Schritt-Text oben links, damit klar ist, welche Beschreibung zu welchem Teil gehört.
- Roomtour: Ablauf „Fotos senden → Roomtour entsteht → Mehr Buchungen“ (KI-Roomtours entstehen aus Kundenfotos, Zielgruppe u. a. Airbnb/Ferienwohnungen). Video-Player mit Kapiteln (`public/media/roomtour-villa.mp4`, Vorschaubild `roomtour-villa.jpg`). Aktuell ein vom Kunden mit KI erstelltes Beispielvideo (Wohnung: Flur, Wohnzimmer, Balkon; farblich neutralisiert, leicht verlangsamt, feines Korn), deshalb gekennzeichnet als „KI-Roomtour · Beispiel“ und nicht als „gefilmt vor Ort“. Keine 3D-Modelle, keine fremden Videos. Ohne Datei ist der Player ausgeblendet.

- Anfragen: jede Leistungs-Sektion hat einen eigenen Anfrage-Button; auf dem Handy feste Leiste „Anrufen / Jetzt anfragen“.

## Technik
- Next.js-Projekt im Root (`app/`, `components/`); eigenständige HTML-Seiten liegen in `public/` und werden von Vercel mit ausgeliefert.
- Three.js r128 per CDN in den eigenständigen Seiten.
