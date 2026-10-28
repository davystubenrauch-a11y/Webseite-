# Übergabe-Prompt für eine neue Sitzung – F&D Solutions Website

> So benutzen: Neue Claude-Code-Sitzung auf diesem Repository starten (Branch `claude/fd-solutions-landing-l1x6bu`) und als erste Nachricht schreiben:
> **„Lies NEUE-SITZUNG.md und CLAUDE.md vollständig und arbeite danach an der Website weiter.“**
> Danach den eigentlichen Auftrag nennen (z. B. „Prüfe und verbessere die Seite mit allen Design-Skills“).

---

## 1. Auftrag und Rolle

Du betreust die Website der Agentur **F&D Solutions** aus München. Ziel: eine **überzeugende, seriöse, moderne Dienstleistungs-Website** (keine Hotel-, Immobilien- oder Tech-Startup-Optik), die konkret zeigt und vorführt, was wir anbieten, und Besucher zur Anfrage bringt. Antworte dem Kunden auf **Deutsch**, kurz und verständlich (er ist kein Entwickler).

**Wichtigste Arbeitsregel:** Es gab bereits ~25 Komplett-Neugestaltungen. Das aktuelle Design ist **v19 „Schaufenster“** (komplett neu, vollständige Seite; Aussage in der Mitte, ringsum schwebende Arbeitsproben; Porzellan/Tinte/Champagner; GSAP + Lenis). Nicht wieder alles neu bauen, sondern **gezielt am Template `design/v19-template.html` weiterarbeiten** und mit `python3 design/build.py v19` nach `public/site/index.html` bauen. Details in CLAUDE.md, Abschnitt „Design v19“. Der Kunde will **keine Entwürfe zur Auswahl mehr**, sondern direkt Ergebnisse. Wenn eine grundsätzliche Stilfrage offen ist: erst 2–4 echte Entwürfe als Screenshots zeigen (unter `public/entwurf/`), den Kunden wählen lassen, dann ausbauen.

## 2. Unternehmen

- **Name:** F&D Solutions, München
- **Gründer:** Florian Dressler (+49 155 66456417) und Davy Stubenrauch (+49 176 56612709)
- **E-Mail:** fd.solutions@web.de
- **Positionierung:** zwei Gründer, persönlich, kein Callcenter, Festpreise, kein Abo, Antwort innerhalb von 24 Stunden.
- **Schwerpunkt (neu):** **KI-Roomtour-Videos für Airbnbs, Ferienwohnungen und Hotels.** Danach Websites und NFC-Platten.

## 3. Leistungen und Preise (verbindlich)

| Leistung | Preis | Details |
|---|---|---|
| **KI-Roomtours** (Projekt 1, Schwerpunkt) | **Basis 300 €** | bis 150 m² oder ein ganzes Stockwerk. Kunde schickt nur Fotos, wir erstellen ein Video (Full HD, quer oder hochkant) für Airbnb, Booking.com, Website, Social Media; Freigabe vor Veröffentlichung. **Premium: Preis nach Raumgröße und Detailgrad** (größere Objekte, Hotels, Villen). |
| **Websites** (Projekt 2) | **Basis 300 €** | 3 professionell gestaltete Seiten, klar und fokussiert, Kontakt, Google Maps, Impressum, Datenschutz. **Business ab 690 €**, **Premium ab 1.290 €** (Animationen, 3D, Inhalte selbst bearbeitbar) – *diese zwei Preise sind noch Platzhalter*. |
| **NFC-Platten** (Projekt 3) | **15 € pro Stück** | rund, Ø 10 cm, Acryl, nur Weiß oder Schwarz, einheitliches Google-Design (nicht personalisiert), nur der Chip wird mit dem Google-Profil verknüpft. iPhone + Android, ohne App. Empfehlung für Restaurants **5–10 Stück** (z. B. in jede Rechnungsmappe). |

Alle Preise einmalig, zzgl. MwSt.

## 4. Vorheriges Design (v11 „Graphit & Champagner“) – Archiv unter `public/v11/index.html`, abgelöst durch v12 (siehe CLAUDE.md)

Live-Datei: **`public/site/index.html`** (eine eigenständige HTML-Datei mit CSS + JS). Die Startseite `/` leitet per `next.config.mjs` dorthin.

- **Farben:** Seite warmes Hellgrau `#f0efec` mit feinem 64-px-Raster und leichtem Champagner-Schimmer (hell, aber *nicht* reinweiß); Karten weiß; **Vorführungen/Hervorhebungen auf Graphit `#1c1c1f`** mit Champagner-Leuchten; **Akzent Champagner `#c9ad7c`** (als Text `#8f7045`); Text `#18181a`, gedämpft `#5d5a54`. Feines Filmkorn über der Seite.
- **Schrift:** Outfit (Überschriften) + Work Sans (Text).
- **Aufbau:**
  1. **Start:** links „Aus 3 Fotos wird ein Video, das Gäste bucht.“ + Buttons; rechts dunkle Karte „So funktioniert es“: 3 Fotos → KI-Pfeil → **echtes Video** (läuft, Play/Pause, Fortschritt) + „Neue Buchung · 3 Nächte“. Darunter drei Leistungskarten mit Preis.
  2. **01 KI-Roomtours** (eigener Bildschirm): Text, Liste, Preis-Karte; Demo: 3 Fotos erscheinen → „Daraus entsteht der Film“ → Video läuft.
  3. **02 Websites:** Demo baut die Referenz SPIRULI live auf (Gerüst → echte Seite → Handy-Ansicht), Umschalter Desktop/Handy, Link „Live ansehen“.
  4. **03 NFC-Platten:** Demo: Handy tippt auf die Platte, Google-Bewertung öffnet sich, Sterne, „Danke“, Meldung „Neue Google-Bewertung“, Zähler +1; Weiß/Schwarz-Umschalter, „Antippen ausprobieren“.
  5. Graphit-Band „Warum F&D“ (Zahlen + 4 Schritte) → **Preise** (Roomtour-Karte graphit hervorgehoben, Websites, NFC-Rechner mit Schieberegler) → Über uns (Gründer, Anruf-Buttons) → Fragen (FAQ) → Kontakt (Formular öffnet vorausgefüllte E-Mail an fd.solutions@web.de) → Fußzeile.
- **Technik:** GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.13 **selbst gehostet** in `public/site/vendor/`; Haptik bei Buttons (Android vibrate, iOS-18-Switch-Trick); alles bei „reduzierter Bewegung“ statisch; Skip-Link; alle Bedienelemente ≥ 44 px; alle Texte ≥ 4,5:1 Kontrast (geprüft).

## 5. Was der Kunde abgelehnt hat (nicht wiederholen)

- **Hotel-/Luxus-Stil** (Sand, Serifen, Versalien) → „falscher Stil, soll Dienstleistung sein“.
- **Serifenschriften** (Cormorant, Playfair …) für Text → „Immobilien-Vibes“.
- Film in Buchstaben, gepinnte Scroll-Szenen, eigener Mauszeiger → „unübersichtlich“.
- **Komplett dunkle** Seiten; aber auch **komplett weiße** Seiten.
- **Türkis, Pink, Pfirsich, Violett, knalliges Blau** für Knöpfe/Flächen; Farbverläufe in Überschriften.
- Leere, zu schmale Layouts („halbe Seite leer“) → auf großen Bildschirmen (≥ 1500 px) bis 1640 px Breite nutzen, Demos groß.
- Video abgeschnitten oder unscharf → Video immer vollständig und in voller Qualität.
- „KI-Look“: ✦-Glitzer, Pillen-Badges überall, Icon-Kreis-Karten, hochzählende Zahlen, Emojis als Icons.
- Frühere Ablehnungen: Grün/Creme, Orange, Limette, Himmelblau, Königsblau, Fonts Fraunces/Anton/Bricolage/Manrope/Plus Jakarta.

## 6. Dateien im Repository

| Pfad | Inhalt |
|---|---|
| `public/site/index.html` | **aktuelle Website (v19)** – gebaut aus `design/v19-template.html` |
| `public/v17/index.html`, `public/v16/index.html` | Versionen v17/v16 (Archiv) |
| `public/site/vendor/gsap-3.13/`, `lenis-1.3/` | GSAP 3.13 (ScrollTrigger, SplitText) und Lenis 1.3.26, selbst gehostet |
| `public/v15/index.html` | Version v15 (Archiv) |
| `public/v14/index.html` | Version v14 (Archiv) |
| `public/v13/index.html` | Version v13 (Archiv) |
| `public/v12/index.html` | Version v12 Kacheln (Archiv) |
| `public/v11/index.html` | vorherige Version v11 (Archiv) |
| `public/site/vendor/` | gsap, ScrollTrigger, lenis (nur noch von v11 genutzt) |
| `public/entwurf/a,b,c,ab1–ab4.html` | Stil-Entwürfe (ab2 = gewählte Richtung) |
| `public/studio/index.html`, `public/neu/` | ältere Versionen (Archiv; `studio` enthält die Quell-SVGs für Logo und NFC-Platte) |
| `public/media/logo-fd.svg`, `logo-fd-mark.svg`, `logo-fd-mark-color.svg` | Logo: Monogramm „F&D“ (Navy `#14275c`, „&“ Gold `#a8874a`) + „SOLUTIONS“; Favicon |
| `public/media/roomtour-villa.mp4` / `.jpg` | KI-Roomtour-Beispielvideo (vom Kunden mit KI erstellt; Flur, Wohnzimmer, Balkon), 1920×1080, 11 s, 6,4 MB; Poster. Immer als „KI-Roomtour · Beispiel“ kennzeichnen. |
| `public/media/tour-hd-1..3.jpg` | Standbilder aus dem Video (Flur, Wohnzimmer, Balkon), 1920 px – dienen als „Ihre Fotos“ |
| `public/media/tour-foto-1/4/9.jpg` | kleine Fotos (520 px) |
| `public/media/ref-spiruli.jpg`, `ref-spiruli-mobile.jpg` | Screenshots der echten Referenz-Website **SPIRULI®** (Getränke-Marke mit Shop, Premium-Paket), live: https://webseite-spiruli-rp1j-qccufwve3-davy-stubenrauch1.vercel.app/ ; Quellcode im Ordner `spiruli/` |
| `public/media/nfc-front.jpg` (+ `-black`, `nfc-platte.png`) | Foto der echten NFC-Platte (Vorlage; auf der Seite wird eine Vektor-Nachbildung `<symbol id="disc">` genutzt) |
| `app/` | Next.js (Impressum, Datenschutz, `api/inquiry` für Formular-Versand per Resend/Webhook – noch nicht verbunden) |
| `next.config.mjs` | Weiterleitung `/` → `/site/index.html` |
| `CLAUDE.md` | ausführliches Design-Protokoll aller Versionen |
| `.claude/skills/` | **ui-ux-pro-max, brand, design-system, ui-styling, design** (aus github.com/nextlevelbuilder/ui-ux-pro-max-skill) |

## 7. Skills, Werkzeuge, Zugänge

- **Skills im Projekt** (in neuer Sitzung automatisch verfügbar): `ui-ux-pro-max` (Suche: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<begriff>" --domain <style|color|typography|ux|landing|gsap>` oder `--design-system`), `brand`, `design-system`, `ui-styling`, `design`. Vor Abgabe: Checkliste in `.claude/skills/ui-ux-pro-max/references/` durchgehen.
- **Weitere sinnvolle Skills:** `code-review`, `security-review`, `simplify` vor dem Livegang.
- **21st.dev (MCP):** muss pro Sitzung neu eingetragen werden: `claude mcp add --transport http 21st https://21st.dev/api/mcp --header "x-api-key: <SCHLÜSSEL>"` – **Schlüssel nie ins Repository schreiben**, der Kunde schickt ihn im Chat. Kostenloser Tarif: Suche frei, 2 Code-Abrufe/Tag; Komponenten sind React → nur als Vorlage nutzen. Netzwerk-Freigabe für 21st.dev ist in der Umgebung eingerichtet.
- **Firecrawl** (Recherche/Screenshots anderer Seiten), **Playwright** (Browser-Tests; Chromium vorinstalliert, `require('/opt/node22/lib/node_modules/playwright')`). PostHog-Verbindung schlug bisher fehl (Proxy 403).
- Webfonts (Google Fonts) werden in der Testumgebung blockiert → Screenshots zeigen Ersatzschrift; live ist es korrekt.

## 8. Testen und Ausliefern

- Testgrößen: MacBook 1440×820/900, großer Monitor 2000×1050, iPad 1180×820 und 820×1180, iPhone 390×844. Prüfen: kein seitliches Überlaufen, keine JS-Fehler, Kontrast ≥ 4,5:1, Bedienelemente ≥ 44 px, Video vollständig sichtbar.
- Playwright-Seiten lokal laden, indem alle Requests auf `public/` umgeleitet werden (Host z. B. `http://x.test/site/index.html`).
- **Git:** auf Branch `claude/fd-solutions-landing-l1x6bu` committen, vorher `git fetch origin claude/fd-solutions-landing-l1x6bu && git merge`, dann `git push -u origin claude/fd-solutions-landing-l1x6bu`. Vercel baut automatisch (Projekt „webseite“). Kunde soll in Vercel über **„Visit“** öffnen und mit Cmd+Shift+R neu laden. Keine Pull Requests ohne Auftrag.
- `CLAUDE.md` nach jeder Design-Entscheidung aktualisieren.

## 9. Offene Punkte

1. **Echtes Vorher/Nachher für Roomtours:** Fotos eines echten Inserats + das daraus entstandene Video (mit Erlaubnis des Gastgebers) – stärkster Vertrauensbeweis.
2. **Fotos der Gründer** für „Über uns“ (derzeit Initialen FD/DS).
3. **Echte Kundenstimmen / Google-Bewertungen** (Beispieltexte wie „Ihr Restaurant“, „Super Essen …“ sind Platzhalter).
4. **Endgültige Preise** Website Business/Premium.
5. **Formular-Versand** direkt einrichten (`app/api/inquiry`, Resend-Key oder Webhook) statt mailto.
6. Impressum/Datenschutz mit echten Angaben füllen.
7. Optional: Foto einer echten NFC-Platte im Einsatz (z. B. in einer Rechnungsmappe).
