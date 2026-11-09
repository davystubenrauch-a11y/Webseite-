# FOAV-Lernbuch

Neueste Einträge oben. Regeln, die immer gelten, stehen ganz unten.

## Einträge

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
