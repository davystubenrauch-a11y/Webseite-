# F&D Solutions – Design-Briefing

Website der Agentur F&D Solutions (München): NFC-Platten für Google-Bewertungen, Webseiten-Erstellung, KI-Roomtours.
Gründer: Florian Dressler (+49 155 66456417) und Davy Stubenrauch (+49 176 56612709), fd.solutions@web.de.

## Aktuelle Richtung
Maßgeblich ist `public/studio/index.html` (online unter `/studio/index.html`).

## Vorbilder (vom Kunden ausgewählt)
- **All Star Burgers (wearebrand.io):** Produkt als Held, groß und freigestellt. Fette, schmale Großbuchstaben-Schrift. Produkt zerlegt sich beim Scrollen in seine Schichten, mit feinen Beschriftungslinien. Angebote als „Speisekarte“ mit großem Bild, Name und Preis.
- **QCLAY / CryptoHub:** (Hintergrund-Farbwechsel beim Scrollen wurde vom Kunden abgelehnt.) Schwebende Elemente um eine zentrale Aussage. Handy in der Mitte, Überschrift links, Text rechts. Dunkle Sektion mit hellen Kacheln und Mini-Illustrationen.

## Marke (Stand 26.10.)
- Logo: Monogramm „F&D“ in Cormorant Garamond Bold (Marineblau `#14275c`, „&“ in Gold `#a8874a`) + „SOLUTIONS“ in Inter Medium, gesperrt. Angelehnt an die Vistaprint-Visitenkarte des Kunden (goldenes F&D auf Navy). Dateien: `public/media/logo-fd.svg` (Lockup), `logo-fd-mark.svg` (nur Monogramm, currentColor), `logo-fd-mark-color.svg` (Favicon). Im HTML inline eingebunden (Header, Footer-Wortmarke).
- Gold nur im Logo-„&“, nicht als Seitenfarbe.
- Echte Referenz statt erfundener Beispielseiten: **SPIRULI®** (Ordner `spiruli/`, live unter webseite-spiruli-rp1j-…vercel.app) als „Referenz · Premium-Paket“ im Websites-Bereich und im Hero-Handy; Screenshots `public/media/ref-spiruli.jpg`, `ref-spiruli-mobile.jpg`.

## Design-Regeln (Version 10)
- **Hell und einladend**: Weiß und helles Grau `#f5f6f9`; Marineblau `#14275c` nur als Akzent (Buttons, zweite Überschriftenzeile, Empfehlungspaket, Footer) – **nicht großflächig**, keine zweigeteilten Farbflächen, keine dunklen Bereiche (v8/v9 waren „zu dunkel“).
- **Apple-Look** (vom Kunden gewünscht, statt eckig): Systemschrift (-apple-system/SF Pro, Fallback Inter), Text `#1d1d1f`, Flächen `#f5f5f7`, Pillen-Buttons, weich gerundete Bilder/Video (22 px), Animationsflächen als gerundete graue Kacheln (30 px), Preise als gerundete weiße Karten, Footer hellgrau. Marineblau `#14275c` bleibt Akzent.
- Startseite wie vom Kunden gelobt (Foto): links „Mehr *Kunden.* für Ihr Unternehmen.“ (wechselndes Wort), Text, Buttons, Fakten; rechts **Collage**: Roomtour-Video, Handy mit Beispiel-Website, echte NFC-Platte, Schilder 01/02/03. Darunter Laufband Branchen.
- Leistungsbereiche **kompakt** (max. 1280 px breit, Animationskachel ca. 440–520 px hoch, Überschrift ~2,9 rem), nicht bildschirmfüllend.
- Leistungs-Details als **schlichte Liste mit Gedankenstrichen**, ganze kurze Sätze („Rund, Ø 10 cm, aus Acryl“). Tabelle und Icon-Kreise wurden als unübersichtlich/„KI-Look“ abgelehnt.
- Danach pro Leistung ein Bereich (Animation + Infos/Preis/Anfrage auf gleichem Hintergrund): 01 NFC (3D-iPhone tippt), 02 Websites (Laptop kippt, Beispiele wechseln), 03 Roomtours (Fotos fliegen ins Video) → Ablauf → Preise → Über uns → FAQ → Kontakt → Footer (Marineblau).
- Produktfoto der weißen Platte vom Kunden: `public/media/nfc-front.jpg` (Textur der 3D-Platte), `nfc-front-black.jpg` (daraus abgeleitete schwarze Variante), `nfc-platte.png` (freigestellt, schwebt im Hero). Weitere Fotos (Restaurant, Gründer, Logo) folgen.
- Abgelehnt: Grün/Creme, Fraunces, Plus Jakarta/Königsblau, Manrope, Bricolage, Anton, Nachtblau/Elfenbein, Limette, Orange, Himmelblau, Karten mit Rand, Vollbild-Bühnen nebeneinander, Scroll-Farbwechsel.

## Feinschliff (Polish-Layer, Stand 26.10.)
- Palette: Seite `#fbfbfd`, Fläche `#fff`, Kachel `#f5f5f7`, Text `#1d1d1f`, sekundär `#6e6e73`, Haarlinie `#d2d2d7`, Akzent `#14275c`.
- Typo-Skala (1440 px): Hero 76, H2 52 (Leistungen ~46), Text 17, Klein 13. Laufweite Überschriften -0,032 bis -0,038em.
- Micro-Interactions: Lesefortschritts-Linie oben, Header blendet beim Runterscrollen aus und beim Hochscrollen ein, Licht-Spot folgt der Maus auf den Animationskacheln, Preiskarten heben sich bei Hover, Fokus-Ring in Akzent-Blau bei Formularfeldern. Alles respektiert „reduzierte Bewegung“.

## Nicht verwenden (wirkt wie eine Standard-KI-Website)
- Gold oder dunkles Navy-Gold-Schema
- Farbverläufe in Überschriften, Leuchtflecken, Glas-Kacheln überall
- Das immer gleiche Muster „Eyebrow + Überschrift + Untertitel + drei Icon-Karten“
- Zentrierte Textwände, Countdown-Timer, Popups
- Mehrere Komplett-Neugestaltungen hintereinander: lieber gezielt an der bestehenden Version weiterarbeiten

## Fakten zum Angebot (Stand 26.10.2026)
- **NFC-Platten: 15 € pro Stück**, einheitlich. Einzelkauf jederzeit; für Restaurants/Geschäfte Empfehlung **5 bis 10 Stück** (z. B. in jede Rechnung/Rechnungsmappe). Preis-Karten: 1 Stück 15 €, 5 Stück 75 €, 10 Stück 150 €. Nur rund (Ø 10 cm), nur Weiß/Schwarz, nicht personalisiert – nur der Chip wird mit dem Google-Profil verknüpft.
- **Roomtours:** Basis 300 € bis **150 m² oder ein ganzes Stockwerk**; größere/komplexere Objekte = **Premium, Preis nach Raumgröße und Detailgrad**. Kunde schickt nur Fotos.
- **Websites:** Basis 300 € mit **3 professionell gestalteten Seiten**, bewusst klar und fokussiert; **Animationen und 3D-Modelle nur in den erweiterten Paketen** (Business ab 690 €, Premium ab 1.290 € – Platzhalterpreise).
- Kundenstimmen sind noch Platzhalter und müssen durch echte ersetzt werden.
- `public/studio/index.html` ist die einzige Quelle. Das Stylesheet wurde am 26.10. **komplett neu und sauber geschrieben** (ein Stylesheet, keine Override-Schichten, Kommentar-Kopf mit Palette/Typo-Skala/Rhythmus). Änderungen direkt dort, keine neuen Schichten anhängen.

## Widgets (Stand jetzt)
- Websites: Laptop + Handy zeigen dieselbe Beispielseite (Café / Handwerk / Immobilien umschaltbar, Container-Queries).
- Paketkarten: schlicht (Name, Preis, Häkchen-Liste, Button „Jetzt anfragen“ / bei NFC „Jetzt bestellen“). Bilder in den Preiskarten waren dem Kunden zu unübersichtlich.
- NFC: Szene „iPhone tippt“ läuft in der Startseite, im Panel 01 nur noch das Öffnen mit Schicht-Hervorhebung. iPhone-Details: (abgerundeter Aluminiumrahmen, Dynamic Island, Statusleiste, maßstabsgetreu zur 10-cm-Platte, ohne Apple-Logo) tippt auf die Platte, Wellen, Google-Bewertungsseite leuchtet auf → Platte öffnet sich, **jede Schicht wird einzeln hervorgehoben** (Rest abgeblendet, passende Beschriftung fett) mit Schritt-Text oben links, damit klar ist, welche Beschreibung zu welchem Teil gehört.
- Roomtour: Ablauf „Fotos senden → Roomtour entsteht → Mehr Buchungen“ (KI-Roomtours entstehen aus Kundenfotos, Zielgruppe u. a. Airbnb/Ferienwohnungen). Video-Player mit Kapiteln (`public/media/roomtour-villa.mp4`, Vorschaubild `roomtour-villa.jpg`). Aktuell ein vom Kunden mit KI erstelltes Beispielvideo (Wohnung: Flur, Wohnzimmer, Balkon; farblich neutralisiert, leicht verlangsamt, feines Korn), deshalb gekennzeichnet als „KI-Roomtour · Beispiel“ und nicht als „gefilmt vor Ort“. Keine 3D-Modelle, keine fremden Videos. Ohne Datei ist der Player ausgeblendet.

- Anfragen: jede Leistungs-Sektion hat einen eigenen Anfrage-Button; auf dem Handy feste Leiste „Anrufen / Jetzt anfragen“.

## NFC-Platte & Animation (Stand 26.10., v24)
- Die Platte ist jetzt eine **Vektorgrafik** (`<symbol id="disc">` oben im `<body>`), nachgebaut nach dem Produktfoto: Google-Farbring, „TAP HERE“, NFC-Symbol, Google-Schriftzug, 5 Sterne, „Review Us On“. Gestochen scharf, Weiß oder Schwarz (`.disc--black`). Das Foto wird nicht mehr verwendet (wirkte dem Kunden nicht hochwertig).
- NFC-Szene ohne WebGL/Three.js (lief auf dem iPad nicht): CSS-iPhone tippt auf die liegende Platte → Wellen → NFC-Banner → Google-Seite „Bewertung schreiben“, Sterne füllen sich, Text tippt, „Danke!“. Phasen-Klassen `p1`–`p6` am `#nfcStage`, gesteuert per JS-Zeitplan.

## Untere Bereiche (Stand 26.10., v24 – „mehr Wow“)
- Ablauf: Scroll-Story – links die 4 Schritte groß, rechts ein klebendes Handy mit Chat, der sich zum gelesenen Schritt füllt (Anfrage → Anruf → Angebot-PDF → „Alles verknüpft“).
- Über uns: großes Statement, Wörter leuchten beim Scrollen nacheinander auf; Gründer-Karten + drei Versprechen.
- Laufschrift „Mehr Bewertungen ✦ Mehr Kunden ✦ Mehr Buchungen“ (riesig, bewegt sich mit dem Scrollen, kippt leicht je nach Tempo) vor dem Kontakt.
- Footer: „Bereit für mehr Kunden?“ zentral, ringsum schwebende Elemente (Platten, Bewertungskarte, SPIRULI, Roomtour, Buchung), folgen der Maus; magnetischer Button; Wortmarke gleitet ein.

## Technik
- Next.js-Projekt im Root (`app/`, `components/`); eigenständige HTML-Seiten liegen in `public/` und werden von Vercel mit ausgeliefert.
- `public/studio/index.html` braucht kein Three.js mehr (alles CSS/SVG).
