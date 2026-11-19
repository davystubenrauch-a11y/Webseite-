# FOAV-Lernbuch

Neueste Einträge oben. Regeln, die immer gelten, stehen ganz unten.

## Einträge

### 2026-11-19 · Renderings + Video auf dem iPhone
- „Abgehackt / wirkt wie Ende“: harte Farbkanten (weiß → grau) mit leerem Grau darunter. Lösung: Abschnitts-Hintergründe als weiche Verläufe von der Seitenfarbe aus (`#fbfbfd` → Grau → `#fbfbfd`), Abstände `.sec` max. 128 px statt 160 px. Prüfen mit Screenshots an jeder Abschnittsgrenze (Grenze bei 60 % Bildschirmhöhe).
- Gründer: „Man darf nicht das Gefühl haben, dass die Website nach jeder Seite aufhört.“ → jede Unterseite endet mit „Mehr von FOAV“ (die anderen Angebote als Bildkarten, `#mehr`, build.py entfernt die Karte der eigenen Seite); leere Bildschirme per Messskript `gaps` suchen (größte leere Fläche > 42 % des Bildschirms), Einblend-Animationen mit `threshold: 0` statt 0.2 bei hohen Listen.
- Gründer: Abschnitte lieber „Überschrift → Bild → kurzer Text“ statt Text neben leerer Fläche; Bild beweist, Text erklärt danach. Immer auch bei ~1180 px (MacBook-Fenster) prüfen, nicht nur 1440.
- Selbstprüfung per Übersichtsbogen (Screenshots in Bildschirm-Schritten, mit PIL zu 6er/12er-Bogen zusammengesetzt) spart Zeit und findet Proportionsfehler: schwebende Überschrift (`align-items: end` bei langem Nachbartext), überladene Kontaktknöpfe auf dem Handy, Raster, das durch nicht umbrechende Knöpfe breiter als der Bildschirm wird (`minmax(0, 1fr)`).
- „Video läuft nicht“, aber Code und Live-Seite laufen in Chromium → iPhone-Stromsparmodus/„Bewegung reduzieren“ verhindert Autoplay. Immer einen Abspielknopf als Rückfall haben und bei jedem Tipp erneut `play()` versuchen.
- Gründer: Angebote nicht vermischen. Werbevideos sind der Fokus und bekommen eine eigene Seite; Renderings (inkl. Wohnung einrichten) sind eine eigene Seite. Renderings günstig (49 €), weil „das könnte jeder selbst, wir machen es für Leute ohne Ahnung“.
- Fehler: `img { display: block }` hebt das HTML-Attribut `hidden` auf → für umschaltbare Bilder/Videos `[hidden] { display: none }` ergänzen.
- Renderings (Umbau zeigen, bevor gebaut wird): Vorher als „amateur smartphone snapshot“ erzeugen, Nachher mit `image_references` + „exactly this same room/house from exactly the same camera position“ + genaue Liste der Änderungen und Möbelanordnung → Geometrie bleibt, wirkt echt. 4 Bilder high/2k ≈ 11 Credits.

### 2026-11-15 · KI-Werbevideos: was echt wirkt
- Kritik der Gründer: KI-Bilder „kann jeder gratis“, Restaurant-Film mit Kellner/Stichflamme/Anstoßen „zu sehr KI“, Handy-Look mit Wackeln „nicht professionell“. Gelungen: ruhiger Café-Spot „Draußen grau. Drinnen Apfelkuchen.“
- Regeln: keine Hände, Menschen, Feuer oder Flüssigkeiten in Bewegung; nur langsame, gleichmäßige Kamerafahrten (Slider/Gimbal, „no shake“ im Prompt); natürliches, gemütliches Licht; Regen am Fenster/Kerze/Dampf als einzige kleine Bewegung; Texte als eigene Overlays statt KI-Schrift; kurze Geschichte in zwei Zeilen + Schlusstafel mit Aufforderung.
- Immobilien: leere Wohnung + gleiche Perspektive als Referenz einrichten lassen (Geometrie bleibt), kling3_0 Start-/Endbild für „richtet sich ein“; erste ~0,8 s oft mit Bildfehler → abschneiden. Immer „virtuell eingerichtet“ einblenden.

### 2026-11-15 · KI-Shots: Motiv und Animation
- Kritik der Gründer: Getränkedose als KI-Shot „schlecht dargestellt“, beiger Hintergrund unpassend, Start erklärt KI-Shots nicht. → Motive nehmen, die Kunden aus dem Alltag kennen (Burger, Cappuccino, Kerze), und **zuerst das Problem zeigen** (schlechtes Handyfoto mit gelbem Licht, Ketchup, Kassenzettel), dann die Lösung.
- Rezept: Vorher-Foto mit gpt_image_2_6 als „amateur smartphone snapshot … cluttered … unedited“ erzeugen, dann Nachher mit diesem Job als `image_references` („exactly this burger …“) → Motiv bleibt gleich. Kosten: 8 Bilder ≈ 2 Credits, 4 Clips kling3_0 ≈ 40 Credits.
- Kling-Kamerafahrt endete mit hellem Hintergrund → nur die ersten 3,3 s nehmen und vorwärts+rückwärts zur Schleife machen.

### 2026-11-14 · KI-Shots statt KI-Roomtours
- Entscheidung der Gründer: Roomtours sind zu aufwendig und verbrauchen zu viele Higgsfield-Credits → ersetzt durch **KI-Shots** (Studio-Fotos + kurze Werbeclips aus Handyfotos): Starter 199 € (5 Fotos, 1 Clip, 48 h), Pro 449 € (12 Fotos, 3 Clips, 72 h, Empfohlen), Brand-Paket 899 € (25 Fotos, 6 Clips + Spot, 72 h).
- Kosten Higgsfield: `gpt_image_2_6` mit `image_references` ≈ 0,25 Credits pro Bild, `kling3_0` Bild→Video 5 s ≈ 10 Credits, `seedance_2_5` 1080p ≈ 80 Credits (zu teuer für Pakete), 720p ≈ 35. Upload: media_upload → curl PUT an upload.higgsfield.ai (Host freigegeben) → media_confirm.
- Marktpreise (Recherche): Packshot 14–40 €/Bild, Studio 85–250 €/h, Shooting vor Ort 500–1.500 €/Tag, klassischer 30-s-Spot mehrere Tausend €.
- NFC jetzt Classic 14,90 € und **Custom Brand Edition 29,90 €** (ab 5: 27,90 €, ab 10: 24,90 €), mit Logo-Fragebogen `/anfrage/nfc` und Design-Vorschau vor Produktion. Lieferant/Produktionszeit der Logo-Platten noch bestätigen.
- Weiterleitungen in Next: `statusCode: 301` statt `permanent: true` (gibt 308). Beim lokalen Testen alten `next-server` wirklich beenden, sonst antwortet noch der alte Stand.

### 2026-11-14 · Story-Video (Lisa und die Bäckerei)
- Kritik der Gründer am Video mit „Nora“: Stimme klingt alt, zu wenig Effekte, gezeigte alte Website war eine Karikatur. → Helle Stimme „Chloe“ (ElevenLabs v4, Median ~267 Hz), jede Zeile einzeln erzeugen (exakte Zeiten, bessere Betonung).
- Vorher/Nachher immer mit **demselben, echt wirkenden Betrieb** zeigen (hier erfundene Bäckerei „Morgenduft“, alt = typische Seite von 2014, neu = modern); im Abspann „Beispiel-Geschichte · Betrieb und Personen erfunden“. Keine erfundene Erfolgsgeschichte als echt ausgeben.
- Gewünscht: Videos, die erst wie eine Geschichte wirken und nicht wie Werbung; Preis nicht ins Story-Video, sondern in den Beitragstext.
- Kosten: 8 Sprechzeilen + 6 Stimmproben + 4 Bilder ≈ 25 Credits.

### 2026-11-13 · Werbevideos für FOAV
- Kritik der Gründer: Computerstimme (Piper) „lustlos“, erstes Social-Video „Schwachsinn“ → Stimme nur noch über Higgsfield `elevenlabs_v4` (4 Stimmen erzeugen, Tonhöhen-Spanne messen, lebendigste nehmen; „Nora“ = 15 Halbtöne). 4 Stimmen ≈ 5,5 Credits.
- Higgsfield-Dateien liegen auf `d8j0ntlcm91z4.cloudfront.net` (in der Umgebung „Standard“ freigegeben) → Download per curl geht.
- Video-Regeln (Recherche): Hook + Angebot in 3 s, Bewegung ab Bild 0, eine Idee, 7–20 s, Untertitel Wort für Wort, Schnitt alle 1–2 s, Teilen-Aufruf, Schleife. Stil, der gefiel: Glasrippen, Verlaufs-Schrift, MacBook, Kacheln mit Unschärfe, echte Bewegungsunschärfe (90 Bilder/s + `tmix`).
- Farben auch im Video: Schwarz/Silber/Weiß, nur Sterne gelb (Blau-Violett wurde abgelehnt).

### 2026-11-10 · Sabine van den Boom, Konzept C „Der Weg“
- Kritik der Gründer: erster Entwurf „wie jede andere Seite“, weil ich die 3 Konzepte übersprungen habe → **nie ohne 3 Konzepte und Wahl bauen**, auch nicht bei Verkaufsentwürfen.
- Technik „Der Weg“: SVG-Pfad über alle Abschnitte (Punkte aus Abschnitts-Positionen, Catmull-Rom → Bezier), zeichnet sich per stroke-dash beim Scrollen, Spitze bei 62 % Bildschirmhöhe, Marker leuchten auf; Hintergrund wird von kühl zu warm (Sonnenaufgang). Handy: senkrechte Schiene links.
- Mittige Abschnitte: Linie nie durch Überschrift/Kreis führen, sondern links vorbei (Selbstprüfung hat das gefunden).

### 2026-11-09 · Verkaufsentwurf Sabine van den Boom (Coach, München-Solln)
- Verkaufsentwürfe brauchen kein eigenes Repo: `public/entwurf/<name>-<zufall>/index.html` in diesem Repo, Pfade absolut, Aufruf `foav.de/entwurf/<slug>` (Rewrite `afterFiles` in `next.config.mjs`), `/entwurf/` ist in robots gesperrt + `noindex`. Eigenes Repo erst nach Kauf.
- Bilder der alten Website: Jimdo-Bildserver ist im Container gesperrt (Proxy 403) → Firecrawl-Screenshot der Seite (1920 px bzw. fullPage) und zuschneiden.
- Unaufgeforderte Werbe-E-Mails sind verboten (§ 7 UWG, auch B2B) → Brief per Post mit QR-Code oder persönlicher Besuch.
- Konzept für ruhige Branchen (Coaching/Therapie): warmes Papier, Serif (Instrument Serif) + Figtree, Porträt im Bogen, ein Scroll-Moment (Werte-Wörter leuchten nacheinander auf), Preise offen nennen.

### 2026-11-15 · Fehler: `@property` mit kurzem Namen
- `@property --w` (für eine Wisch-Animation) hat global die NFC-Variable `--w: min(30vh, 20vw)` ungültig gemacht → ganze NFC-Seite verschoben. Registrierte Properties immer mit eindeutigem Präfix benennen (z. B. `--immo-w`) und vorher `grep -- '--name'` im Template.
- Kunde mag keine übereinander liegenden Bilder/Videos → Vorher/Nachher lieber nebeneinander mit Pfeil und Nummern.

### 2026-11-15 · Social Media (Instagram + TikTok über Metricool)
- Metricool-Marke „foav.de“ (blogId 8127810) mit Instagram @foav.de und TikTok verbunden. Bio, Name, Profilbild, Highlights kann nur der Mensch in der App ändern; Beiträge plant Claude über Metricool.
- Instagram/TikTok laden Videos nur von öffentlichen Adressen → Datei nach `public/social/` legen, pushen (Production folgt dem Zweig), dann planen.
- Impressum auf Social Media: höchstens 2 Klicks (§ 5 DDG) → eigener Bio-Link „Impressum“ + Fußzeile auf foav.de/links.
- Instagram: max. 5 Hashtags; KI-Inhalte mit `isAiGenerated`, TikTok `isAigc` + `commercialContentOwnBrand`.
- Anleitung und Texte: `marketing/social-media/PROFIL.md`.

### 2026-11-09 · Start des Lernbuchs
- Gründer-Kritik bisher: Seiten sehen „alle gleich aus“ → immer erst 3 Konzepte, ein Helden-Element, Vorlage des Kunden ernst nehmen (siehe `foav-website`).
- Gewünscht ist hochwertige Scroll-Animation wie bei Apple/Awwwards; Weg: Higgsfield-Video → Einzelbilder → Canvas + GSAP ScrollTrigger.
- Werbevideos werden lokal mit Playwright (Einzelbilder) + ffmpeg gerendert; Dateien > 100 MB lehnt GitHub ab → mit `-crf 21 -maxrate 9M` neu kodieren.
- GitHub-App kann keine neuen Repositories anlegen (403) → Gründer legen sie selbst an (Private, README an) und geben sie unter github.com/apps/claude/installations/select_target frei.

## Feste Regeln (aus Erfahrung)

- Gründer wollen Antworten auf Deutsch, kurz, einfach, ohne Fachbegriffe.
- Nie erfundene Bewertungen oder Kundenstimmen, auch wenn darum gebeten wird.
- foav.de ist monochrom (Graphit/Weiß/Grau); Akzentfarben wurden dort mehrfach abgelehnt. Für Kundenseiten gilt das nicht – dort die Marke des Kunden.
- Name der Firma immer „FOAV“, nie „foav.de“ oder „F&D Solutions“.
- Anrufen ist nur Notfall-Kanal; Bestellweg: Paket wählen → Fragebogen → Warenkorb/Bezahlen.

## 17.11. – Werbefilme, die nicht nach KI aussehen
- Kritik: alles beige/gleichfarbig, zu glatt. Was geholfen hat: **gemischte Farben und Materialien mit klarer Designsprache** (z. B. Oliv-Samt + Cognac-Leder + Walnuss + Perserteppich + ein Bild in Burgund/Ocker), Abend/Blaue Stunde mit **geschichtetem warmem Licht** (Stehlampe, Tischlampe, Bilderleuchte, gedimmte Papierlampe) gegen kühles Blau draußen, Kamera und Objektiv nennen (Sony A7R V 24 mm bzw. ARRI Alexa Mini 35/50/100 mm), „uncluttered, considered“, keine Wörter wie cozy/luxury/aesthetic.
- Startbilder immer gpt_image_2_6 **quality high, 2k** (2,75 Credits) – die 0,25-Credit-Bilder waren ein Hauptgrund für den KI-Look. Videos kling4_0 1080p image-to-video (5 s = 16,25, 8 s = 26 Credits); Seedance 2.5 1080p kostet 80 je 5 s.
- Wohnung: leeres Foto als `image_references` → Geometrie blieb exakt. Start-/Endbild (leer → eingerichtet) mit kling4_0 klappt sauber, auch Tag → Abend. Zwei 8-s-Fahrten vom selben Startbild (eine rückwärts abgespielt) ergeben eine durchgehende 16-s-Fahrt.
- Café-Szenen ohne Hände/Menschen, Bewegung nur Regen, Dampf, Spiegelungen, Kamerafahrt → alle 4 Clips im ersten Versuch brauchbar. Außenclip brauchte ~17 Minuten Rechenzeit.
- Nachtrag 17.11.: Kunde fand den neuen Café-Spot schlechter als den alten → zurückgesetzt. Wohnung: „Möbel stehen sinnlos verteilt“ – **bei virtueller Einrichtung immer die Anordnung vorgeben** (Sitzgruppe: Sofa an der Wand, Couchtisch ~40 cm davor, Sessel ~1 m gegenüber auf demselben Teppich; Esstisch als eigene Zone; Pflanze in eine Ecke; „no furniture floating alone in empty space, real furniture sizes“). Damit kam ein glaubwürdiges Wohnzimmer heraus.

## 18.11.2026 – Persönliche Briefe an Betriebe in Solln
- Kunde wollte keine Angebotsliste, sondern: „was ist bei diesem Betrieb negativ, und wie lösen wir es“. Aufbau je Brief: Überschrift = größte Schwäche, Steckbrief (Google, Website, Instagram), 2–3 Punkte „Aufgefallen → Unsere Lösung + Preis“, dann alle Angebote in einer Zeile, Besuchsangebot, „Ihre Nachbarn aus Solln“.
- KI-Recherche (Firecrawl-Agent) irrt oft: „Website lädt nicht“ war 2× falsch, 2 Betriebe waren geschlossen/übergeben. Negative Befunde immer selbst nachprüfen, sonst nicht schreiben. Branchenwörter per Regex vorsichtig: „Fischer“ ≠ Fisch, „Meisterbetrieb“ enthält „eis“.
