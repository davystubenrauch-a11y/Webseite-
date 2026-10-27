# F&D Solutions – Design-Briefing

Website der Agentur F&D Solutions (München): NFC-Platten für Google-Bewertungen, Webseiten-Erstellung, KI-Roomtours.
Gründer: Florian Dressler (+49 155 66456417) und Davy Stubenrauch (+49 176 56612709), fd.solutions@web.de.

## Stand 28.10.: Design v11 „Graphit & Champagner“ — AKTUELL (vom Kunden gewählt)
- v10 (Hotel-Stil) abgelehnt: „soll keine Hotel-Seite sein, sondern eine Dienstleistungs-Seite“. Dann 3 Entwürfe gezeigt (`public/entwurf/a|b|c.html`): Kunde mochte A (hell, klar) + B (dunkel, spektakulär), aber „nicht komplett dunkel, hell aber nicht alles weiß“. Kombination in 4 Farbwelten (`entwurf/ab1–ab4.html`) → **Variante 2 gewählt**.
- Palette: Seite warmes Hellgrau `#f0efec` mit feinem 64-px-Raster + leichtem Champagner-Schimmer, Karten weiß, **Demos/Hervorhebungen auf Graphit `#1c1c1f`** mit Champagner-Leuchten, Akzent **Champagner `#c9ad7c`** (Text-Variante `#8f7045`), Text `#18181a`. Kein Blau/Türkis/Violett.
- Schrift: **Outfit** (Überschriften) + **Work Sans** (Text) – ui-ux-pro-max-Empfehlung für Agenturen/Dienstleister.
- Start: links Punkt-Label + „Aus 3 Fotos wird ein Video, das Gäste bucht.“ (zweiter Teil champagner) + Buttons; rechts dunkle Karte „So funktioniert es“: 3 Fotos → KI-Pfeil → **echtes Video** (läuft, Play/Pause, Fortschritt), Chip „Neue Buchung“. Darunter drei Leistungskarten mit Preis (erste graphit).
- Projekte 01–03 behalten Demos/Abläufe aus v6–v9, jetzt in Graphit-Karten; Preis-Karte weiß. Preise: Roomtour-Karte graphit mit Champagner-Button.

## Stand 28.10.: Design v10 „Warmes Luxus-Design“ (vom Kunden per Abfrage gewählt)
- Kunde zu v9: Video nicht komplett sichtbar, langweilig, Hintergrund nicht seriös, „komisches Türkis“, blaue Knöpfe langweilig → wählte „Warmes Luxus-Design“ (Boutique-Hotel): Sandgrau `#efebe5`, Stein `#e7e1d8`, Hell `#f7f4ef`, Anthrazit `#1e1c1a`, gedämpft `#7a736a`. **Kein Blau/Türkis/Violett**, Farbe nur im Logo (Original Navy + Gold).
- Schrift **Jost** (Futura-Charakter, leicht 300 für große Überschriften, Labels in Versalien mit weiter Laufweite). Knöpfe eckig, Anthrazit bzw. Kontur. Feine 1-px-Linien statt Karten-Schatten.
- Einstieg nach Aman-Vorbild (aman.com per Firecrawl verglichen): kurze Überschriftenzeile, darunter **das Video vollständig in 16:9** über die volle Breite (object-fit: contain), eigene Play/Pause-Taste, Kapitel-Linien Flur/Wohnzimmer/Balkon, rechts „Entstanden aus 3 Fotos“ mit Miniaturen. Vorher/Nachher-Regler entfernt.
- „KI-Merkmale“ entfernt: kein ✦-Glitzer, keine Pillen-Badges, keine Verlaufs-Chips, keine hochzählenden Zahlen, keine doppelten Beschriftungen (nur „01 — KI-Roomtours“ usw.), Schritte als Textzeile mit Linie statt Kacheln, Umschalter als unterstrichene Textlinks.

## Stand 27.10. spät: Design v9 „Seriös“ (Weiterentwicklung von v8)
- Kunde: „seriöser und attraktiver, andere Hintergründe/Farben, Video war unscharf, hochwertiger.“
- Einstieg komplett auf **Nachtblau `#0b1730`** mit ruhig fließendem Indigo/Petrol-Licht (Canvas) + feines Punkteraster, weiße Schrift, weißer Haupt-Button. Kein Pink/Pfirsich/Violett mehr.
- Akzent **Indigo `#4f46e5`**, zweiter Ton **Petrol `#14b8a6`**. Projekte auf klaren Flächen (Weiß / `#f5f7fb`) mit feinem Punkteraster, große Projektnummer nur als Kontur, Kennung als dunkles Kästchen „01/02/03“ + „PROJEKT 1 VON 3“.
- Video wieder in voller Qualität: aus dem Original (Commit 2fe8838) neu kodiert, 1920×1080, x264 CRF 21 (6,4 MB, SSIM 0,989); Standbilder `tour-hd-1..3.jpg` und Poster in 1920 px.
- Preise: KI-Roomtours zuerst und hervorgehoben („Schwerpunkt“), dann Websites, dann NFC-Rechner.

## Stand 27.10. abends: Design v8 (Weiterentwicklung von v7)
- Kunde: „Seiten nicht ausgefüllt, zu langweilig, Startseite langweilig.“ → Start jetzt mit **großem Vorher/Nachher-Regler** über die volle Breite (links „Vorher · 3 Fotos“ als Mosaik aus `tour-hd-1..3.jpg` = Standbilder aus dem Beispielvideo, rechts „Nachher · KI-Video“, Griff ziehbar per Maus/Finger/Pfeiltasten, schwingt automatisch hin und her bis zur ersten Berührung, Chips „Neue Buchung“ und „KI-Roomtour · Full HD“). Überschrift links, Text + Buttons rechts darüber.
- Kunde (Screenshot auf großem Monitor ~2000 px): „zu viel Platz drumherum, halbe Seite leer“ → ab 1500 px Breite nutzt die Seite bis 1640 px (90 vw), Demos größer (bis 58–64 vh), Fotos füllen die Roomtour-Kachel (Standbilder `tour-hd-*`), weniger Leerraum oben/unten.
- Projekt-Bildschirme gefüllt: eigene Farbstimmung je Projekt (01 Violett/Türkis, 02 Blau/Türkis, 03 Pfirsich/Violett), riesige blasse Projektnummer im Hintergrund, größere Demos, Preis in eigener weißer Karte mit Kurzinfo.

## Aktuelle Richtung (ab 27.10.: Design v7 – Stripe-Stil, Fokus KI-Videos für Airbnb)
Maßgeblich ist **`public/site/index.html`** (Startseite `/` leitet dorthin). Kunde will sich **auf KI-Roomtour-Videos für Airbnbs/Ferienwohnungen spezialisieren**. Wünsche: einladender Einstieg mit Animation, die erklärt, was wir machen; danach **drei Projekte, je eins pro Bildschirm** (Animation, gute Beschreibung, Preis); alles strukturiert, seriös, modern, nichts durcheinander/übergreifend; Wow-Effekt, der Aufmerksamkeit hält.
- Start: „Aus Ihren Fotos wird ein Video, das Gäste bucht.“ + Animation rechts: drei Kundenfotos erscheinen → Scan + „KI erstellt Ihr Video 0–100 %“ → Fotos fliegen ins Airbnb-ähnliche Inserat im Handy → Video läuft → „Neue Buchung · 3 Nächte“. Darunter Leiste „Für Gastgeber auf Airbnb, Booking.com …“.
- Projekt 1 von 3 KI-Roomtours (Schwerpunkt), Projekt 2 Websites, Projekt 3 NFC-Platten – jeweils `min-height: 100svh`, eigene Live-Demo (siehe v6), Preis + Anfrage-Button. Dann Navy-Band „Warum F&D“, Preise, Über uns, FAQ, Kontakt.
- Überschrift jetzt schlicht Navy (kein color-burn mehr, wirkte zu bunt).

### Vorher: Design v6 „Stripe-Stil“
Maßgeblich ist **`public/site/index.html`** (Startseite `/` leitet dorthin). Der Kunde hat per Abfrage den **Stripe-Stil** gewählt: weiß und klar, mit fließendem Farbverlauf als Wow-Element, interaktive Mini-Demos je Angebot, scharfe Karten. Wunsch: Leistungen **auffällig, anschaulich, mit Wow-Effekt vorgeführt**, seriös, klar, „höchstes Niveau“.
- Abgelehnt in dieser Reihe: v3 hell/Navy-Kapitel, v4 „Graphit“ (Serifen, Film-in-Buchstaben → „Immobilien-Vibes, unübersichtlich“), v5 „Klar“ (Graphit-Sans → „immer noch nicht gut, soll sich abheben“).
- Palette: Text Navy `#0a2540`, Fließtext `#425466`, Fläche `#f6f9fc`, Aktion Indigo `#635bff`; Aurora-Verlauf Violett `#a960ee` · Blau `#635bff` · Türkis `#3ecbd6` · Pfirsich `#ffb38a` (animiertes Canvas, schräg abgeschnittenes Band oben und am Kontakt). Schrift **Inter**. Logo im Kopf weiß auf dem Verlauf, sonst Original-Farben.
- Aufbau: Hero (Headline mit color-burn auf dem Verlauf, schwebende Produkt-UI: Google-Bewertung, SPIRULI-Browser, Roomtour, „+1 Bewertung“) → Branchen → „Drei Lösungen“-Karten (Neigung bei Hover) → je Leistung Text + **Live-Demo**: NFC (Handy tippt Platte, Leuchten/Wellen, Sterne, „Danke“, Toast „Neue Google-Bewertung“, Zähler +1, Schleife, Button „Antippen ausprobieren“, Weiß/Schwarz), Website (Gerüst zeichnet sich → SPIRULI wischt ein → Wechsel aufs Handy, Desktop/Handy-Schalter), Roomtour (3 Fotos erscheinen → „KI erstellt den Rundgang“ → Video läuft) → Navy-Band „Warum F&D“ mit Zählern und 4 Schritten → Preise (Schieberegler-Rechner + Pakete) → Über uns → FAQ → Kontakt mit Verlauf.
- Technik: GSAP + ScrollTrigger + Lenis selbst gehostet in `public/site/vendor/`; Haptik bei Buttons; alles bei reduzierter Bewegung statisch. Vorlage `v6/template.html` + `v6/build.py` im Scratchpad, sonst direkt `public/site/index.html`.

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
