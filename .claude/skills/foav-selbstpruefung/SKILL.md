---
name: foav-selbstpruefung
description: Pflicht-Selbstprüfung für alles, was FOAV einem Kunden oder den Gründern zeigt (Website, Entwurf, Änderung an foav.de, Video, Text). Verwenden, bevor ein Ergebnis gezeigt, committet oder als fertig gemeldet wird. Prüft Optik auf Handy und Computer, Technik, Recht und Inhalte und verbessert in mindestens zwei Runden.
---

# FOAV: Selbstprüfung vor jeder Übergabe

Nichts wird als „fertig“ gemeldet, bevor diese Prüfung gelaufen ist. Ergebnisse ehrlich berichten: was geprüft, was gefunden, was behoben, was offen.

## Runde 1 und 2: Ansehen und kritisieren

1. Seite lokal ausliefern (z. B. `python3 -m http.server`) und mit **Playwright** Screenshots machen
   (Chromium ist vorinstalliert, `require('playwright')`):
   - 1440 × 900 (Computer) und 390 × 844 (Handy, `isMobile: true, hasTouch: true`)
   - pro Seite: erster Bildschirm + ganze Seite in Bildschirm-Schritten
   - bei Scroll-Animationen: mehrere Scroll-Positionen (5 %, 30 %, 60 %, 90 %)
2. Screenshots **selbst ansehen** und wie ein Awwwards-Juror kritisieren:
   - Wirkt es nach genau dieser Marke oder austauschbar?
   - Ist der Wow-Moment klar und auf dem Handy genauso stark?
   - Überlappungen, abgeschnittene Texte, zu kleine Schrift (< 14 px Fließtext mobil), schlechter Kontrast (< 4,5:1), Knöpfe < 44 px?
   - Ist sofort klar: Was bietet der Betrieb, und was soll der Besucher tun?
3. Gefundenes beheben, neu aufnehmen, erneut kritisieren. **Mindestens 2 Runden.**

## Technik-Prüfung (automatisch messen, nicht schätzen)

- JS-Fehler in der Konsole: keine (`page.on('pageerror')`).
- Kein horizontales Überlaufen auf 390 px.
- Alle internen Links und Anker erreichbar, keine 404.
- Bilder: komprimiert (webp/avif), Gesamtgewicht Startseite möglichst < 3 MB, Videos mit Poster.
- Titel, Beschreibung, `og:image`, schema.org, `sitemap.xml`, `robots.txt` vorhanden.
- Formular abschicken testen (Erfolg + Fehlerfall).
- `prefers-reduced-motion`: Seite bleibt bedienbar und vollständig sichtbar.

## Recht und Inhalt

- Impressum vollständig, keine Platzhalter mehr wie [eckige Klammern] – sonst als offen melden.
- Keine erfundenen Bewertungen, Zahlen, Preise, Öffnungszeiten, Personen.
- KI-Inhalte (Roomtour, Bilder) gekennzeichnet, wo nötig.
- Entwürfe: `noindex` gesetzt.
- Texte: Deutsch korrekt, kurz, keine KI-Floskeln (Skill `humanizer`, falls verfügbar).

## Bericht an den Menschen

Kurz, auf Deutsch:
- was gebaut/geändert wurde
- 2–4 Screenshots (Handy + Computer) mitschicken
- was geprüft wurde und was noch offen ist (z. B. „Kunde muss Öffnungszeiten liefern“)

Danach: Erkenntnisse in `foav-lernbuch/lernbuch.md` eintragen.
