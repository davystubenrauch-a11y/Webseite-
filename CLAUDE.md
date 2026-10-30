# FOAV (früher F&D Solutions) – Design-Briefing

Website der Agentur **FOAV** (Domain **foav.de**, Name ab 28.10.; vorher „F&D Solutions“) (München): NFC-Platten für Google-Bewertungen, Webseiten-Erstellung, KI-Roomtours.
Gründer: Florian Dressler (+49 155 66456417) und Davy Stubenrauch (+49 176 56612709), fd.solutions@web.de.

## Stand 30.10. spät nachts: Startseite spannender (Skills frontend-design + ui-ux-pro-max) — AKTUELL
- Kunde: „Layout immer noch gleich langweilig und einheitlich, auf höchstem Niveau, mit Premium-Seiten konkurrieren“. Archiv vorher: `public/v20b/`.
- **Typo als Held**: Start-Überschrift bis 184 px (10,6 vw, Zeilenabstand .9), h2 bis 88 px, Szenen-h2 bis 68 px, Preise bis 84 px, Über-uns-Satz bis 64 px. Start-Bühne fast randlos (8–16 px Abstand).
- **Neuer Leistungs-Index** `#angebot` direkt nach dem Start (Agentur-Stil): drei riesige Zeilen Websites / KI-Roomtours / NFC-Platten mit Kurztext + Preis; beim Überfahren werden die anderen Zeilen blass, ein Vorschaubild folgt dem Mauszeiger (`#peek`, nur Maus, nicht bei reduzierter Bewegung).
- **Bewegtes Schriftband** `#bandx` vor dem Ablauf: zwei Zeilen (voll / Kontur) laufen beim Scrollen gegeneinander, Trenner = Logo-Zeichen.
- NFC-Film auf hellgrauem Grund (Abwechslung zu Website weiß / Roomtour warm).
- Formulare: keine Karten mehr, Abschnitte als offene Zeilen (Titel links klebend, Felder rechts), Ablauf als Linie unter der Überschrift; Roomtour-Fotos als **Kacheln mit Mini-Grundriss**, der Kamera-Standort und Blickrichtung zeigt.

## Stand 30.10. nachts: Fragebogen + Roomtour-Auftrag mit Foto-Upload
- Kunde: noch **keine Kunden**; braucht für Websites einen **Informations-Fragebogen** und für Roomtours ein Formular, über das Kunden **pro Raum die passenden Fotos** schicken. Ablauf: Kunde zahlt vorab → bekommt Ergebnis → Änderungen gemeinsam. **Website bis 7 Tage** (je nach Paket), **Roomtour bis 48 Stunden**.
- Neue Next-Seiten **`/anfrage/website`** und **`/anfrage/roomtour`** (`components/forms/Briefing.tsx` = Hülle/Fragen/Foto-Upload/Absenden, `WebsiteBriefing.tsx`, `RoomtourBriefing.tsx`), Stil wie die Startseite. Pflicht nur Name, Telefon-oder-E-Mail, Einwilligung. Vorauswahl per URL, z. B. `?paket=Business`.
- Roomtour: Räume wählen (Schlafzimmer/Bad mit +/−), je Raum Foto-Tipp + empfohlene Anzahl (Flur 2, Wohnzimmer 4, Küche 3, Schlafzimmer 3, Bad 2, Balkon 2, Außen 2, Weitere 2), allgemeine Foto-Tipps, Preis-Karte (≤ 150 m² = 300 €, sonst „Nach Größe“).
- Upload: `@vercel/blob` 2.8.1, Client-Upload über `app/api/upload` (Bilder/PDF/SVG, max. 25 MB, Zufalls-Suffix). **Braucht `BLOB_READ_WRITE_TOKEN`**; ohne Token blendet das Formular den Upload aus und bittet um Fotos per E-Mail/WhatsApp.
- Versand `app/api/briefing` (+ `lib/briefing.ts`): wie `/api/inquiry` (Resend → Webhook → 503 → mailto), Foto-Links nach Raum gruppiert, nur Blob-URLs erlaubt.
- Startseite: Ablauf „Preis sehen → Angaben senden → Ergebnis erhalten“ (Festpreis + Zahlungslink, Lieferzeiten), Zusagen-Zeile **Lieferzeit**, FAQ „Wie lange dauert es?“ + „Wann bezahle ich?“, Preis-Knöpfe „Fragebogen ausfüllen“ / „Fotos hochladen“. Datenschutz: Abschnitt „Fragebogen und Foto-Upload“; Sitemap `/anfrage/*`.
- Offen: Zahlungslink (z. B. Stripe Payment Link) wird bisher von Hand verschickt.

## Stand 30.10. abends: Premium-Durchgang nach Apple/Linear
- **Skills-Durchgang (30.10.)**: `marketing-psychology:persuasion-audit` (Ergebnis: Anfrage ist leicht genug, **fehlende Belege** sind die Bremse; keine Kundenstimmen, SPIRULI-Referenz nicht prüfbar) und `humanizer`. Umgesetzt: „Am häufigsten angefragt“ → „Unser Schwerpunkt“ (keine Beliebtheits-Behauptung ohne Daten, DP-03); Vergleich „Oft üblich“ über andere Anbieter entfernt → Tabelle „Darauf können Sie sich verlassen.“ (Unsere Zusage / Was das für Sie heißt); „Festpreis“-Aussagen an „Richtwerte“/„nach Größe“ angeglichen („Klare Preise“, „Startpreise“, schriftlicher Festpreis vor dem Start); Pauschalaussagen abgeschwächt; Roomtour-Film zeigt „Bereit für Airbnb und Booking.com“ statt „Neue Buchung“ + Hinweis „Beispiel-Roomtour“; Texte ohne Verneinungs-Ketten und Satzfetzen. **Keine erfundenen Bewertungen** – echte Kundenstimmen erst, wenn vorhanden (mit Name, Betrieb, Ergebnis, Erlaubnis).
- Kunde: „immer noch nicht hochwertig genug, wie ein Profi-Webdesigner, Premium-Seiten vergleichen und übernehmen; Proportionen in den Animationen falsch; gelber Akzent gefällt nicht“. Verglichen per Firecrawl-Screenshot: apple.com/de/macbook-air, linear.app (Archiv vorher: `public/v20/`).
- **Kein Gelb mehr, monochrom**: Knöpfe Graphit #1d1d1f (Hover Schwarz), Zweitknopf Weiß mit 1-px-Kontur, Kopf-Knopf klein (40 px); Logo-Punkt weiß (Zeichen ganz monochrom), Favicon/Touch-Icon ebenso. Farbe kommt nur aus den Bildern.
- **Schrift Inter** (selbst gehostet `public/site/fonts/inter-latin.woff2`, opsz) statt Sora/Figtree, Laufweite enger, Skala kleiner und ruhiger (h1 44–80 px, h2 32–52 px, Text 17 px), Navigation als schlichte Textlinks.
- **Start wie Linear**: Überschrift links, darunter Zeile mit Text links und Knöpfen rechts („Kostenlos anfragen“, „Preise ansehen“); Produkt-Lineup in einer hellgrauen, abgerundeten Bühne (`.hero__stage`), keine Maus-Neigung mehr.
- **Geräte realistischer**: MacBook mit dünnem Rand, Kerbe, Alu-Rahmenlinie, gewölbter Alu-Unterseite; iPhone mit Titan-Rahmen und Dynamic Island.
- **Animationen**: Fortschritt mit Glättung (smoothstep), Filme kürzer (290 vh, Handy 260 vh); **echte Größenverhältnisse NFC** (Platte Ø 10 cm, Handy 7 × 15 cm → Handy-Breite 0,71 × Platte, `--w`), Handy endet schräg über der Platte; Website-Handy landet vollständig in der Bühne.

## Stand 30.10.: v20 „Bühne“ hell + „einfacher Ablauf“
- **Logo v2 (30.10.)**: Kombi-Marke = **Zeichen** (abgerundetes Graphit-Quadrat, weißer Ring, goldener Punkt; identisch mit Favicon/App-Symbol) + Wortmarke **„foav“ in Kleinbuchstaben** (Sora 650, Pfade per fontTools, Skript `logo/make2.py` im Scratchpad, Varianten v1/v2/v3 verglichen → v3). Klassen `lg-tile`, `lg-on`, `lg-ink`, `lg-amp`. Im Fließtext heißt die Firma weiter „FOAV“.
- **Akzent-Disziplin (30.10.)**, nach Recherche (NN/g, WCAG, Stripe): **Gold #f1b33c nur noch für Anfrage-Knöpfe** (Verlauf, dunkle Kante #9c6a08 für ≥ 3:1 gegen Weiß, Graphit-Schrift, Glanz beim Überfahren, hebt sich 1 px). Alles Nicht-Klickbare (Häkchen, Schritt-Nummern, Kicker, Preise in Links, Regler, Plan-Hervorhebung) in Graphit. Zweitknöpfe = weiß mit Kontur. Block „accent discipline“ vor `/* ---------- responsive`.
- Kunde: v20 gefällt mehr, aber **keine dunkle Seite**; anschaulich und stilvoll; soll für jede Kundengruppe einen **einfachen Prozess** versprechen („nicht tausend Formulare, bis man einen Preis bekommt“).
- Farben jetzt **hell (Apple hell)**: Seite #fbfbfd, Bänder/Kontakt #f5f5f7, Karten Weiß, Text #1d1d1f / #424245 / gedämpft #636366, Akzent Gold #e8b04b (Flächen) bzw. #8a5a00 (Text). Primärknöpfe dunkel (`.btn--light` = Graphit-Pille). Scroll-Filme mit hellen Bühnen (Roomtour-Film warm #f4efe8, Video-Overlay hell).
- Botschaft „einfach“: Start-Text „Preis sofort sehen, in einer Minute anfragen, fertig.“ + 3 Häkchen (Festpreis direkt auf der Seite / Nur Name und Telefon nötig / Antwort in 24 Stunden); Berater heißt **„Ihr Festpreis in zehn Sekunden.“** mit 5. Reiter „Etwas anderes“ (kostenloses Gespräch + Festpreis-Angebot, 0 €); Ablauf auf **3 Schritte** „So einfach geht's. Ohne Formular-Marathon.“ (Preis sehen → Kurz anfragen → Zurücklehnen).
- **Formular verkürzt**: Leistung, Name, **ein Feld „Telefon oder E-Mail“**, Einwilligung; Firma/Nachricht unter „Weitere Angaben (optional)“. Server (`lib/inquiry.ts`) verlangt jetzt E-Mail **oder** Telefon; `reply_to` nur wenn E-Mail.

## Stand 30.10.: Design v20 „Bühne“ (erst dunkel, Apple-Produktseite)
- Kunde zu v19/FOAV: „noch zu einfach und langweilig, neues Design, andere Farben, bessere Animationen“ (Richtungsfrage abgebrochen, ich habe „Apple-Produktseite“ gewählt).
- **Quelle `design/v20-template.html`**, bauen mit `python3 design/build.py v20`. Archiv v19 (hell, FOAV) unter `public/v19/`.
- Farben: **Schwarz #000** / Band #0b0b0d / Flächen #161618, Text #f5f5f7 / #c7c7cc / gedämpft #98989d, Akzent **Gold #e8b04b** (Logo-Punkt, Schritt-Nummern, Preise in den Schnell-Links, Dock). Nur dunkel (`color-scheme: dark`), weiße Pillen-Knöpfe (`.btn--light`). Schriften unverändert (Sora/Figtree).
- Start: „Mehr Kunden für Ihren Betrieb.“ zentriert + Text + 2 Knöpfe + Schnell-Links mit Preisen; darunter **Produkt-Lineup** (Laptop mit SPIRULI, iPhone mit Roomtour-Video, liegende NFC-Platte): fährt beim Laden hoch, Laptop-Deckel klappt auf, Platte dreht sich ein; folgt leicht der Maus, zoomt beim Scrollen.
- Leistungen als **drei Scroll-Filme** (`.scene`, 340 vh hoch, Bühne klebt; JS schreibt Fortschritt als `--a/--b/--c` 0..1 und Klassen `s1–s3`, Schritte „So läuft's“ leuchten mit; Handy zeigt nur den aktuellen Schritt): Website = Deckel öffnet sich → Seite scrollt auf dem Bildschirm → Handy fährt ein, „Online“; Roomtour = 3 Fotos steigen auf → schieben sich zusammen → Video öffnet sich bildschirmfüllend, „Neue Buchung“; NFC = Platte dreht sich und legt sich hin → Handy kommt, Wellen → Sterne, „+1 Google-Bewertung“. Ohne GSAP/reduzierte Bewegung: `.static`, Endbild.
- Referenz-Abschnitt entfällt (SPIRULI steckt im Website-Film), alte NFC-Demo entfällt → neuer Abschnitt „Wie viele Platten brauchen Sie?“ (Farbe Weiß/Schwarz färbt die Platte im NFC-Film, Rechner). Berater, Vorher/Nachher, Ablauf, Preise, Vergleich, Über uns, Fragen, Kontakt, Wortmarke bleiben (dunkel).

## Stand 30.10.: Marke FOAV auf der Seite (v19 weiterentwickelt, Archiv `public/v19/`)
- Name **FOAV** (Schreibweise in Versalien, Kunde hat noch nicht bestätigt), Domain **foav.de** bei Checkdomain, Hosting Vercel (Production Branch soll `claude/fd-solutions-landing-l1x6bu` sein).
- **Logo neu** (`design/parts/logo.svg`, `public/media/logo-foav.svg`): Wortmarke FOAV aus Sora 600 (Glyphen per fontTools in Pfade umgewandelt, Skript im Scratchpad `logo/make.py`), das **O ist ein Ring mit Champagner-Punkt** (Antipp-Punkt/Objektiv). Favicon/`app/icon.svg`/`logo-foav-mark.svg` = nur der Ring auf Tinte; `apple-touch-foav.png`; Vorschaubild `og-foav.jpg`. Logo-Farbe Tinte statt Marine, Punkt #b8955a (hell) / #c9ad7c (dunkel). Alte F&D-Dateien bleiben nur für die Archive.
- Neu auf der Seite: Abschnitt **„Was FOAV anders macht.“** (Tabelle Bei FOAV / Oft üblich: Preis, Antwort, Ansprechpartner, laufende Kosten, Freigabe, Leistungen; Handy: gestapelt) statt der 4 Versprechen; **riesige FOAV-Wortmarke** unten im Kontakt-Band, steigt beim Scrollen auf.
- Technik: `/` wird per `rewrites().beforeFiles` auf `/site/index.html` umgeschrieben (Adresse bleibt foav.de/, kein Redirect mehr); `canonical`, `og:url`, absolute OG-Bilder auf https://foav.de; Sitemap/robots mit fester Basis foav.de; schema.org mit url/logo. Impressum/Datenschutz (`components/ui/LegalPage.tsx`) im neuen Stil mit FOAV-Logo, ohne alte React-Footer. Anfrage-IDs `FOAV-…`.
- **Erklären statt nur zeigen (30.10.)**, Kunde: „nicht überzeugend genug, Animationen besser, alles einfach und schnell verständlich“:
  - Start: Schnell-Links mit Preis unter den Knöpfen (Websites ab 300 € / KI-Roomtours ab 300 € / NFC-Platten 15 €).
  - Branchen-Laufband ersetzt durch **„Was passt zu Ihrem Betrieb?“** (`#passend`): 4 Branchen-Reiter (Restaurant/Café, Ferienwohnung/Hotel, Laden, Handwerk) → Empfehlungskarte mit Leistungen, Einzelpreisen, „Start ab …“ und Knopf, der die Leistungen im Formular vorwählt (`data-pick` mit Komma-Liste + `data-note`).
  - Jede Leistung hat jetzt **„So läuft's“ in 3 Schritten** (`.how`, Nummern leuchten synchron auf) + eine **Erklär-Animation** (`[data-ex]`, Phasen `data-p` 0–3, spielt einmal, wenn zu 50 % sichtbar; danach „Nochmal ansehen“; reduzierte Bewegung = Endzustand): Website = Drahtgitter → Design wischt ein → Adresse tippt sich, Handy kommt dazu, „Online“; Roomtour = 3 Fotos landen → werden zu „Video entsteht“-Balken → Video öffnet sich, „Neue Buchung“; NFC = Handy kommt zur Platte → Wellen → Sterne füllen sich, „+1 Google-Bewertung“. Häkchen-Listen dafür durch eine Faktenzeile ersetzt.
- Offen: echte Adresse + Firmenname laut Gewerbeanmeldung in `lib/site.ts`, E-Mail (noch fd.solutions@web.de), Schreibweise des Namens.

## Stand 28.10.: Design v19 „Schaufenster“ (komplett neu, vollständige Seite)
- Kunde: „nochmal eine komplett neue Seite mit neuem Design, vollständig mit allem, was eine Seite braucht“.
- **Quelle `design/v19-template.html`**, bauen mit `python3 design/build.py v19`. Archiv v18 unter `public/v18/`. NFC-Demo + Rechner aus v18 übernommen.
- Idee nach Kunden-Vorbild QCLAY: Aussage in der Mitte („Digitale Auftritte, die Kunden gewinnen.“), ringsum schweben echte Arbeitsproben (Roomtour-Video, SPIRULI-Handy, NFC-Platten, Google-Bewertung, „Neue Buchung“, Website) – fliegen beim Laden ein, folgen Maus und Scroll (GSAP quickTo/scrub). Dann Branchen-Laufband → Leistungen als **offene Zeilen, Bild und Text wechseln die Seite** (Handy: Bild zuerst; das frühere Stapeln der Karten beim Scrollen hat der Kunde abgelehnt) → Vorher/Nachher (Räume) → **Referenz SPIRULI** (Laptop klappt auf, Seite scrollt in Laptop + iPhone, Fakten-Liste) → NFC auf Tinte (Demo + Rechner) → Ablauf (Linie füllt sich) → Preise als 3 Karten + 4 Versprechen → Über uns (Wörter leuchten auf) → Fragen → Kontakt auf Tinte mit **vollständigem Formular** → Fußzeile mit Navigation, Impressum, Datenschutz.
- Formular sendet an `/api/inquiry` (volles Inquiry-Format, Pflicht: Leistung, Name, E-Mail, Einwilligung Datenschutz; Honeypot `website`); ohne konfigurierten Versand (503/502/Fehler) öffnet sich automatisch eine fertige E-Mail an fd.solutions@web.de.
- Vollständigkeit: Meta-/OG-Daten + Vorschaubild `public/media/og-fd.jpg` (1200×630), `app/robots.ts` (Archive/Entwürfe nicht indexieren), `app/sitemap.ts`, schema.org, Skip-Link, Menü fürs Handy, feste Leiste „Anrufen / Kostenlos anfragen“.
- Farben: Porzellan #f6f4ef, Weiß, Tinte #111114, Text #45433e, Champagner #c9ad7c (Text #74572c). Schrift **Sora** (Überschriften) + **Figtree** (Text).
- Geprüft 1440/2000/820/390 px: keine JS-Fehler, kein Überlaufen, Kontrast ≥ 4,5:1, Formular-Ersatzweg getestet.
- **Apple-HIG-Durchgang (28.10.)**: Dunkelmodus nach Systemeinstellung (Tokens `--fill/--on-fill/--band/--glass/--logo`, Flächen #141416/#1d1d20, Bänder #0b0b0c); Schriftgrößen in rem, auf iPhone/iPad folgt die Grundgröße der eingestellten Textgröße (`font: -apple-system-body`, nur iOS); keine Dauer-Schwebe mehr, Knopf „Bewegung anhalten“ stoppt Start-Video, Laufband und Maus-Parallaxe; Datenschutz-Link getrennt vom Häkchen (Zeile ≥ 44 pt); Raum-Reiter mit Pfeiltasten; NFC-Bild im Start als Karte; Tastatur-Hinweise im Formular; kein Überlaufen mehr bei 320 px. **Schriften selbst gehostet** in `public/site/fonts/` (Sora, Figtree, OFL) – kein Google-Abruf mehr (DSGVO).

- **Hochwertiger-Durchgang (28.10.)**: mit frontend-design-Skill Standard-KI-Merkmale entfernt: keine Kicker-Labels („— Leistungen“) mehr über Überschriften, kein farbig hervorgehobenes Wort in der Start-Überschrift, keine Einblend-Effekte pro Abschnitt (Überschriften, Absätze aus der Unschärfe, Preise, Personen, Formular), kein Hover-Anheben der Preiskarten, keine Scroll-Anzeige, eine schwebende Karte weniger (Website). Bewegung nur noch: Start-Auftritt, gestapelte Karten, Laptop klappt auf, Ablauf-Linie, Über-uns-Wörter, NFC-Demo. Überschriften Sora 500, größer und enger (`text-wrap: balance`), Flächen mit Haarlinien-Kante + gestaffeltem warmem Schatten (`--edge`, `--shadow`), Laufband ruhiger (gedämpft, 500), Preise mit Tabellenziffern.

- **Videos (28.10.)**: Kunde meldete, Roomtour-Video und Vorher/Nachher spielen nicht. In Chrome liefen sie; Ursache vermutlich Safari (Video in Karte mit Filter-Effekt friert ein; Stromsparmodus blockiert Autoplay). Jetzt: Stapel-Effekt mit Filter entfernt, alle drei Videos über eine Hilfsfunktion `keepPlaying` (spielen nur sichtbar, `autoplay` + `play()`), bei Ablehnung erscheint ein Knopf „Video abspielen“; erster Fingertipp auf der Seite startet sichtbare Videos erneut; Vorher/Nachher nutzt nur noch `roomtour-villa-1280.mp4` (kein `<source media>`), Antippen des Reglers startet das Video.

## Stand 28.10.: Design v18 „Sichtbar. Gebucht. Bewertet.“ (Archiv `public/v18/`)
- Kunde: „komplett neue Webseite mit neuem Design“, mit GSAP (github.com/greensock/GSAP), Lenis (darkroomengineering/lenis) und React Bits (DavidHDev/react-bits) als Hilfe.
- **Quelle `design/v18-template.html`**, bauen mit `python3 design/build.py v18`. Archive: `public/v17/` (v16-Layout + GSAP), `public/v16/` … 
- Technik: **GSAP 3.13** (gsap, ScrollTrigger, SplitText) selbst gehostet in `public/site/vendor/gsap-3.13/`, **Lenis 1.3.26** in `public/site/vendor/lenis-1.3/` (weiches Scrollen nur mit Maus). React Bits ist React-only → Effekte in reinem JS nachgebaut: Magnet-Knöpfe, BlurText (Absätze aus der Unschärfe), Buchstaben-Aufstieg (SplitText). Ohne GSAP bleibt alles sichtbar; reduzierte Bewegung = statisch.
- Idee: jede Leistung ein Wort – **Sichtbar.** (Websites), **Gebucht.** (KI-Roomtours), **Bewertet.** (NFC). Start **dunkel** (#0f0f10): drei riesige Wörter (Archivo breit, Versalien; aktives Wort gefüllt, andere als Kontur), rechts wechselt Bild/Video (SPIRULI / Roomtour / NFC-Studio) alle 5 s mit Fortschrittslinien, bis Maus/Klick übernimmt. Darunter Agentur-Text + Faktenzeile.
- Kapitel in dieser Reihenfolge: Websites (Laptop klappt beim Scrollen auf, SPIRULI scrollt in Laptop+iPhone, Pakete) → Roomtours (Video öffnet sich beim Scrollen aus einem Rahmen auf volle Breite; Vorher/Nachher je Raum, Regler gleitet mit dem Scrollen) → NFC auf Schwarz (Demo + Rechner) → Ablauf (Linie füllt sich) → Preise auf Schwarz mit Licht-Spot → Über uns (Wörter leuchten auf) → Fragen → Kontakt auf Schwarz („Lassen Sie uns sprechen.“) mit riesiger Wortmarke „F&D Solutions“, die beim Scrollen aufsteigt.
- Farben: Schwarz #0f0f10/#19191b, Knochenweiß #f2efe9/#e8e3da, Text #121212, Champagner #c9ad7c (Text #74572c). Schrift **Archivo** (variabel, Anzeige 112–122 % Breite).
- Geprüft 1440/2000/1180/820/390 px: keine JS-Fehler, kein Überlaufen.

## Stand 28.10.: Design v16 „Galerie“ (Archiv `public/v16/`; v17 = gleiches Layout mit GSAP, Archiv `public/v17/`)
- Kunde zu v15: Start wirkt, als würden wir **nur** Roomtours machen; Qualität nicht perfekt; Vorher/Nachher: Fotos nicht in voller Größe, Grau „komisch“, passende Vorher-Fotos erstellen; Roomtour-Bilder unscharf; untere Bereiche (Ablauf, Preise, Über uns …) „basic, langweilig“ → coole Effekte.
- **Quelle `design/v16-template.html`**, bauen mit `python3 design/build.py v16`. Archiv v15 unter `public/v15/`.
- Start: Überschrift **„Mehr Gäste, Kunden und Bewertungen.“** + Agentur-Text; darunter **Galerie aller drei Leistungen** (Roomtour-Video, SPIRULI-Website, NFC-Studio-Bild): aktives Feld öffnet sich groß (flex), wechselt alle 6 s mit Fortschrittslinie, bis Maus/Fokus es übernimmt; Handy: untereinander. Zeile „Festpreis · 24 h · zwei Gründer · München“. Kein Vollbild-Video mehr (machte das Material unscharf); Kopfzeile immer hell.
- Vorher/Nachher: Umschalter **Flur / Wohnzimmer / Balkon**; links ein **farbiges Vorher-Foto** in voller Größe (`vorher-1..3.jpg` + `-md`; aus den schärfsten Videobildern, als normales Handyfoto aufbereitet: leicht schief, kühler, flacher, leichte Vignette), rechts das Video, das im Raum-Abschnitt in Schleife läuft. 16:9.
- Bildqualität: schärfste Frames per Laplace-Varianz gesucht, mit OpenCV **EDSR x2** hochgerechnet (Modell im Scratchpad), dann auf 1920 verkleinert.
- Untere Bereiche: **Ablauf** = klebende Überschrift links, rechts 4 große Schritte, Linie füllt sich beim Scrollen champagner, Schritte leuchten auf. **Preise** auf Graphit mit Licht-Spot, der der Maus folgt. **Über uns** = großes Statement, Wörter leuchten beim Scrollen nacheinander auf. **Laufband** „KI-Roomtours / Websites / NFC-Platten / München“ (voll + Kontur) bewegt sich mit dem Scrollen vor dem Kontakt.
- Geprüft 1440/2000/1180/820/390 px: kein Überlaufen, keine JS-Fehler.

## Stand 27.10. nachts (3): Design v15 „Kino“ (Archiv `public/v15/`)
- Kunde zu v14: Spruch „Aus drei Fotos wird ein Video, das Gäste bucht“ klingt unprofessionell; Herauszoomen ruckelt; Website-Attrappe falsch proportioniert; Fotos/Videos plötzlich schlechte Qualität; NFC-Foto „wie auf eBay“; insgesamt seriöser, cooler, hochwertiger.
- **Quelle `design/v15-template.html`**, bauen mit `python3 design/build.py v15`. Archiv v14 unter `public/v14/`.
- Überschrift jetzt sachlich: **„Roomtour-Videos für Ferienwohnungen und Hotels.“** + Text „Aus Ihren vorhandenen Fotos erstellen wir einen hochwertigen Video-Rundgang …“ + Faktenzeile (Full HD 16:9/9:16 · Freigabe · ab 300 €) statt Pillen.
- Zoom ruckelfrei: scroll-gekoppelte **CSS-Animation** (`animation-timeline: scroll(root)`, läuft im Compositor); Fallback per JS mit Glättung; kein Border-Radius-Animieren mehr (Video startet bei scale 1.06, Ecken außerhalb des Bildes).
- Website-Attrappe: echter Laptop (16:10, Scharnier/Unterteil) + iPhone (9:19,5). Fehler war: `<img height>` ohne `height:auto` streckte das Bild. Neue Retina-Aufnahmen der SPIRULI-Seite (lokal gebaut aus `spiruli/`, Playwright 2x/3x): `ref-spiruli-desk.webp` (1600×3000, 3 Bildschirme), `ref-spiruli-mob.webp`, `ref-spiruli-desk-top.jpg`; scrollen im Rahmen mit.
- **Achtung:** Die SPIRULI-Vercel-Vorschau ist passwortgeschützt (Vercel-Login) → Link „Live ansehen“ entfernt, bis der Kunde die Seite öffentlich macht.
- Medien neu: Video aus bester Quelle (Commit 2fe8838) neu kodiert, CRF 18, leicht geschärft (12 MB) + `roomtour-villa-1280.mp4` (Handy, 3,9 MB); Standbilder `tour-hd-1..3` (1920) und `tour-md-1..3` (960) neu aus dem Video, srcset. Vorher/Nachher nutzt jetzt volle Auflösung (vorher 640-px-Bilder → unscharf).
- NFC: **Studio-Produktbild** `nfc-platten.webp` (weiße + schwarze Platte, schräg auf Stein, Acryl-Kante, weicher Schatten), gerendert aus der Vektor-Platte – kein fremdes Foto (Urheberrecht).

## Stand 27.10. nachts (2): Design v14 „Kino“ (Archiv `public/v14/`)
- Kunde zu v13: „viel zu unspektakulär, langweilig, zu einheitlich, Farben unseriös, basic“. Wollte **keine Entwürfe mehr, direkt eine fertige Seite** (3 Ansätze `public/entwurf/spek-1|2|3` nur intern verglichen; „Kino“ gewählt, Vorher/Nachher-Regler aus spek-3 übernommen).
- **Quelle: `design/v14-template.html`**, bauen mit `python3 design/build.py v14`. Archive: `public/v13/`, `public/v12/`, `public/v11/`.
- Farben wie das vom Kunden früher gewählte v11: Stein `#ebe8e2` (Seite), `#e2ded6` (Kontakt/Fuß), Graphit `#1c1c1f` (NFC-Band, Hero-Rand), Tinte `#151517`, Champagner `#c9ad7c` (Knöpfe/Flächen), Champagner-Text `#74572c`. Schrift **Hanken Grotesk** 400–800, große fette Überschriften.
- Hero: das Roomtour-Video füllt den ganzen Bildschirm, Überschrift steigt Zeile für Zeile auf; beim Scrollen zieht sich das Video zu einem gerahmten Bild zusammen (sticky, an Scroll gekoppelt, kein Pinning von Inhalten), Kopfzeile wird hell. → Drei Leistungen (Bild, Text, Preis, Spalten mit Linie) → Roomtours: **Vorher/Nachher-Regler** (links 3 Fotos grau, rechts Video; schwingt bis zur ersten Berührung, Maus/Finger/Pfeiltasten) → Websites: Laptop + Handy, SPIRULI scrollt im Rahmen mit → NFC auf Graphit (Demo + Rechner) → Ablauf 1–4 → Preistabelle → Gründer → Fragen → Kontakt.
- Geprüft 1440/2000/1180/820/390 px: kein Überlaufen, keine JS-Fehler, Kontrast ≥ 4,5:1 (Text auf dem Video über Abdunklung), Ziele ≥ 44 px.

## Stand 27.10. nachts: Design v13 „Ruhig & klar“ (abgelehnt: zu langweilig; Archiv `public/v13/`)
- Kunde zu v12 (Kacheln): „alles durcheinander, zu viel auf einmal, KI-Kasten-Schema, ein Kasten schwarz, einer weiß – nicht professionell“. Wunsch: übersichtlich, professionell, hochwertig, anschaulich, Wow durch Animation, andere und **einheitliche** Farben. Ausdrücklich mit dem frontend-design-Skill gearbeitet (Plan → Prüfung gegen KI-Muster → Bau → Screenshot-Kritik).
- **Quelle: `design/v13-template.html`**, bauen mit `python3 design/build.py v13` (füllt Logo, Platten-Symbol, schema.org aus `design/parts/`). Archiv: `public/v12/`, `public/v11/`.
- Farben (eine Familie aus dem Logo): Fläche `#f4f5f8`, Band `#e7ebf3`, Linie `#d5dae6`, Logo-Marine `#14275c` (Überschriften, Knöpfe), Text `#3b4560`, gedämpft `#5a6380`; Gold nur im Logo. **Keine schwarzen Kästen, keine Karten-Raster, kein Schwarz/Weiß-Wechsel.**
- Schrift **Schibsted Grotesk** (eine Familie). Keine Großbuchstaben-Labels, keine Eyebrows, keine „A · B“-Zeilen, keine Pfeile an Knöpfen, Nummern nur beim Ablauf.
- Aufbau: offene Abschnitte, getrennt durch Weißraum; zwei hellblaue Bänder (NFC, Kontakt). Hero: Überschrift „Aus drei Fotos wird ein Video, das Gäste bucht.“ + **einziger Wow-Moment**: drei Fotos liegen als Abzüge da, gleiten ins Bild, werden zum laufenden Video, dann „Neue Buchung“; Knopf „Nochmal“. → Leistungen als Preisliste (Zeilen) → Roomtours (Text + Player mit Kapiteln) → Websites (Browser-Rahmen SPIRULI, Computer/Handy) → NFC-Band (Demo + Rechner) → Ablauf 1–4 (Linie zeichnet sich einmal) → Preise als **eine Tabelle** → Gründer → Fragen (details/summary) → Kontakt-Band mit Formular.
- Geprüft (1440/2000/1180/820/390 px): kein Überlaufen, keine JS-Fehler, Kontrast ≥ 4,5:1, Bedienelemente ≥ 44 px.

## Stand 27.10. spät: Design v12 „Alles auf einen Blick“ (abgelöst, Archiv `public/v12/`)
- Kunde wollte „eine komplett neue Webseite“. 3 Entwürfe gezeigt (`public/entwurf/neu-1|2|3.html` + Screenshots `neu-*-desktop.png`): 1 „Bühne“ (Video groß + Preisliste), 2 „Alles auf einen Blick“ (Kacheln/Bento), 3 „In drei Schritten“ (Ablauf als Start, Logo-Navy) → **Entwurf 2 gewählt**. Eine Änderung nur an den Fotos war ausdrücklich NICHT gewünscht.
- Quelle `design/v12-template.html`, gebaut mit `python3 design/build.py v12` (setzt Logo, NFC-Platten-Symbol und schema.org-Daten aus `design/parts/` ein). Änderungen im Template machen, dann bauen. v11 liegt als Archiv unter `public/v11/index.html`.
- Palette: Seite warmes Mittelgrau `#dedbd5`, Kacheln `#f7f6f3` / Weiß, dunkle Kacheln Graphit `#1b1b1d`, Text `#161616`, gedämpft `#55514b`, Akzent **Google-Gelb `#f4b400`** (nur Flächen, Sterne, Preisschilder; Text darauf immer dunkel). Schrift **Onest** (eine Familie). Kachel-Radius 24 px, Preisschild oben rechts in jeder Leistungskachel.
- Aufbau: Start-Bento (Überschrift „Mehr Buchungen. Mehr Bewertungen. Mehr Kunden.“, großes Roomtour-Video mit den 3 Ausgangsfotos, NFC-Kachel dunkel mit Platte, Website-Kachel SPIRULI, Gründer-Kachel mit Telefonnummern, Ablauf 1–4) → 1 KI-Roomtours (Video mit Kapiteln Flur/Wohnzimmer/Balkon, Preis-Kachel mit Ablauf, „Nur 3 Fotos“, „Das bekommen Sie“, „Für wen?“) → 2 Websites (SPIRULI Desktop/Handy-Umschalter, Pakete, „Immer dabei“) → 3 NFC (Live-Demo ohne Bibliothek: Handy tippt, Bewertung, Sterne, „Danke“, +1, Weiß/Schwarz; Rechner) → Preise auf einen Blick → Über uns → Fragen + Formular (mailto) + Kontaktkacheln → Fußzeile. Handy: Menü-Knopf, feste Leiste „Anrufen / Kostenlos anfragen“.
- Technik: keine GSAP/Lenis mehr (nur ein kleines Skript); Demos laufen nur, solange sichtbar; reduzierte Bewegung = statisch. Handy lädt `roomtour-villa-960.mp4` (1,1 MB) statt 6,4 MB; Vorschaubilder `tour-sm-1..3.jpg` (640 px).
- Geprüft per Playwright (1440, 2000, 1180, 820, 390 px): kein Überlaufen, keine JS-Fehler, alle Texte ≥ 4,5:1, alle Bedienelemente ≥ 44 px.

## Stand 28.10.: Design v11 „Graphit & Champagner“ (abgelöst durch v12, Archiv `public/v11/`)
- v10 (Hotel-Stil) abgelehnt: „soll keine Hotel-Seite sein, sondern eine Dienstleistungs-Seite“. Dann 3 Entwürfe gezeigt (`public/entwurf/a|b|c.html`): Kunde mochte A (hell, klar) + B (dunkel, spektakulär), aber „nicht komplett dunkel, hell aber nicht alles weiß“. Kombination in 4 Farbwelten (`entwurf/ab1–ab4.html`) → **Variante 2 gewählt**.
- Palette: Seite warmes Hellgrau `#f0efec` mit feinem 64-px-Raster + leichtem Champagner-Schimmer, Karten weiß, **Demos/Hervorhebungen auf Graphit `#1c1c1f`** mit Champagner-Leuchten, Akzent **Champagner `#c9ad7c`** (Text-Variante `#8f7045`), Text `#18181a`. Kein Blau/Türkis/Violett.
- Schrift: **Outfit** (Überschriften) + **Work Sans** (Text) – ui-ux-pro-max-Empfehlung für Agenturen/Dienstleister.
- Start: links Punkt-Label + „Aus 3 Fotos wird ein Video, das Gäste bucht.“ (zweiter Teil champagner) + Buttons; rechts dunkle Karte „So funktioniert es“: 3 Fotos → KI-Pfeil → **echtes Video** (läuft, Play/Pause, Fortschritt), Chip „Neue Buchung“. Darunter drei Leistungskarten mit Preis (erste graphit).
- v11.1 Prüfung mit ui-ux-pro-max (automatisiert per Playwright): alle Texte ≥ 4,5:1 Kontrast (`--muted` auf `#5d5a54`), alle Bedienelemente ≥ 44 px, keine Schrift < 12 px außer in den illustrativen Handy-Attrappen (aria-hidden), Fokus-Ring champagner, Drück-Feedback, Lesebreite ≤ 62ch, feines Filmkorn über der Seite.
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
