# F&D Solutions – Design-Briefing

Website der Agentur F&D Solutions (München): NFC-Platten für Google-Bewertungen, Webseiten-Erstellung, KI-Roomtours.
Gründer: Florian Dressler (+49 155 66456417) und Davy Stubenrauch (+49 176 56612709), fd.solutions@web.de.

## Aktuelle Richtung (ab 27.10.: Design v3 „Kapitel“)
Maßgeblich ist jetzt **`public/neu/index.html`** (die Startseite `/` leitet dorthin). Der Kunde wollte ausdrücklich ein **komplett neues Design mit Vollbild auf MacBook, iPad und iPhone** – das ersetzt die frühere Regel „kompakt, nicht bildschirmfüllend“. Die alte Version bleibt unter `/studio/index.html` erreichbar (Logo-SVG, Platten-Sprite und NFC-Szene werden per Skript daraus übernommen: Vorlage im Scratchpad `v3/template.html` + `v3/build.py`; bei Änderungen direkt `public/neu/index.html` bearbeiten).
- Jedes Kapitel füllt den Bildschirm (`min-height: 100svh`): Start → 01 NFC → 02 Websites → 03 Roomtours → Preise → Ablauf & Team → Fragen → Kontakt (+ Fußzeile). Kapitel-Punkte rechts (Desktop), Fortschrittslinie oben, mobile Leiste „Anrufen / Jetzt anfragen“.
- Schrift **DM Sans** (ui-ux-pro-max „Premium Sans“), Palette wie bisher hell mit Navy-Akzent, Gold nur im Logo-„&“.
- Start (QCLAY-Muster): Überschrift links, iPhone mit Google-Profil in der Mitte (Bewertungszähler läuft hoch), Text rechts, schwebende Elemente folgen der Maus, Branchen-Laufband unten.
- Leistungen als **Vollbild-Panels, die sich beim Scrollen übereinander schieben** (21st.dev „Services Stack“); auf dem iPhone normal untereinander.
- Preise: NFC-**Rechner mit Schieberegler** (1–20 Platten × 15 €, Empfehlung 5–10) + Preisliste im Speisekarten-Stil (Punktlinien) für Websites und Roomtours. Jeder Anfrage-Button füllt das Formular vor.
- Formular schickt (noch) eine vorausgefüllte E-Mail an fd.solutions@web.de.

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
- Danach pro Leistung ein Bereich (Animation + Infos/Preis/Anfrage auf gleichem Hintergrund): 01 NFC (iPhone tippt, CSS/SVG), 02 Websites (Laptop kippt, Beispiele wechseln), 03 Roomtours (Fotos fliegen ins Video) → Ablauf → Preise → Über uns → FAQ → Kontakt → Footer (Marineblau).
- Produktfoto der weißen Platte vom Kunden: `public/media/nfc-front.jpg` (nur noch Vorlage für die Vektor-Platte, siehe unten). Weitere Fotos (Restaurant, Gründer, Logo) folgen.
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
- NFC: siehe Abschnitt „NFC-Platte & Animation“ (die frühere 3D-/Schichten-Szene ist entfernt).
- Roomtour: Ablauf „Fotos senden → Roomtour entsteht → Mehr Buchungen“ (KI-Roomtours entstehen aus Kundenfotos, Zielgruppe u. a. Airbnb/Ferienwohnungen). Video-Player mit Kapiteln (`public/media/roomtour-villa.mp4`, Vorschaubild `roomtour-villa.jpg`). Aktuell ein vom Kunden mit KI erstelltes Beispielvideo (Wohnung: Flur, Wohnzimmer, Balkon; farblich neutralisiert, leicht verlangsamt, feines Korn), deshalb gekennzeichnet als „KI-Roomtour · Beispiel“ und nicht als „gefilmt vor Ort“. Keine 3D-Modelle, keine fremden Videos. Das Vorschaubild steht immer da, auch wenn ein Gerät das Video nicht vorlädt.

- Anfragen: jede Leistungs-Sektion hat einen eigenen Anfrage-Button; auf dem Handy feste Leiste „Anrufen / Jetzt anfragen“.

## NFC-Platte & Animation (Stand 26.10., v24)
- Die Platte ist jetzt eine **Vektorgrafik** (`<symbol id="disc">` oben im `<body>`), nachgebaut nach dem Produktfoto: Google-Farbring, „TAP HERE“, NFC-Symbol, Google-Schriftzug, 5 Sterne, „Review Us On“. Gestochen scharf, Weiß oder Schwarz (`.disc--black`). Das Foto wird nicht mehr verwendet (wirkte dem Kunden nicht hochwertig).
- NFC-Szene ohne WebGL/Three.js (lief auf dem iPad nicht): CSS-iPhone tippt auf die liegende Platte → Wellen → NFC-Banner → Google-Seite „Bewertung schreiben“, Sterne füllen sich, Text tippt, „Danke!“. Phasen-Klassen `p1`–`p6` am `#nfcStage`, gesteuert per JS-Zeitplan.

## Untere Bereiche (Stand 26.10., v24 – „mehr Wow“)
- Ablauf: Scroll-Story – links die 4 Schritte groß, rechts ein klebendes Handy mit Chat, der sich zum gelesenen Schritt füllt (Anfrage → Anruf → Angebot-PDF → „Alles verknüpft“).
- Über uns: großes Statement, Wörter leuchten beim Scrollen nacheinander auf; Gründer-Karten + drei Versprechen.
- Laufschrift „Mehr Bewertungen ✦ Mehr Kunden ✦ Mehr Buchungen“ (riesig, bewegt sich mit dem Scrollen, kippt leicht je nach Tempo) vor dem Kontakt.
- Footer: „Bereit für mehr Kunden?“ zentral, ringsum schwebende Elemente (Platten, Bewertungskarte, SPIRULI, Roomtour, Buchung), folgen der Maus; magnetischer Button; Wortmarke gleitet ein.

## Qualitäts-Durchgang (27.10., mit ui-ux-pro-max + 21st.dev)
- ui-ux-pro-max Design-System „Trust & Authority + Conversion“ bestätigt die Richtung: Navy/Grau, Akzent nur für CTAs, transparente Preise, kurzes Formular. Dessen Schrift-Vorschlag (EB Garamond/Lato) bewusst nicht übernommen (Serifen nur im Logo).
- Umgesetzt: keine Emojis als Icons (SVG-Sterne/Telefon), Touch-Ziele ≥ 44 px, Skip-Link „Zum Inhalt springen“, Laufband-Kontrast, weiche Kanten + Pause bei Hover an Laufbändern (Muster aus 21st.dev-Marquees), Hero-Überschrift steigt aus einer Maske, goldenes „&“ im Logo setzt sich beim Laden/Einblenden ein.
- Roomtour-Video auf 1600 px neu kodiert (2,2 MB statt 11,7 MB). Toter Code des alten Beispielseiten-Generators entfernt.
- 21st.dev: kostenloser Tarif (Suche frei, 2 Code-Abrufe/Tag, keine KI-Generierung); Komponenten sind React/shadcn, daher nur als Vorlage genutzt.

## Technik
- Next.js-Projekt im Root (`app/`, `components/`); eigenständige HTML-Seiten liegen in `public/` und werden von Vercel mit ausgeliefert.
- `public/studio/index.html` braucht kein Three.js mehr (alles CSS/SVG).
