# FOAV-Lernbuch

Neueste Einträge oben. Regeln, die immer gelten, stehen ganz unten.

## Einträge

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
