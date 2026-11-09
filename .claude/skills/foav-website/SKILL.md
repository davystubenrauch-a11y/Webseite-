---
name: foav-website
description: FOAV-Handbuch für Kunden-Websites. Verwenden, sobald eine Website oder ein Website-Entwurf für einen FOAV-Kunden (oder einen möglichen Kunden) gebaut, geändert oder geplant wird – auch in einem anderen Repository als diesem. Enthält Ablauf, Pakete, Design-Regeln, Technik, Recht und Übergabe.
---

# FOAV: Kunden-Website bauen

FOAV (foav.de, München, FOAV GbR, Kleinunternehmer § 19 UStG) baut Websites für kleine Betriebe.
Ansprechpartner: Davy Stubenrauch und Florian Dressler, info@foav.de. Antworten an sie: Deutsch, kurz, einfach.

Vor jeder Arbeit: `foav-lernbuch/lernbuch.md` in diesem Repository lesen (Erfahrungen aus früheren Projekten).
Vor jeder Übergabe an den Menschen: Skill `foav-selbstpruefung` vollständig durchlaufen.

## 1. Ablauf

1. **Auftrag klären:** Paket, Branche, Fragebogen (JSON aus der E-Mail `FOAV-…-website.json`), Logo, Fotos.
   Bei einem **Verkaufsentwurf** (Kunde hat noch nicht gekauft): nur die Startseite, siehe Abschnitt 6.
2. **Erst Konzepte, dann Code:** 3 deutlich verschiedene Konzepte vorschlagen – je Stimmung, Farben, Schriftpaar,
   EIN Wow-Moment beim Scrollen, Begründung passend zur Marke. Mensch wählt. Ohne Wahl nicht bauen.
3. **Bauen** (Technik unten), dann **Selbstprüfung** (`foav-selbstpruefung`), mindestens 2 Verbesserungsrunden.
4. **Zeigen:** Screenshots Handy + Computer und eine Liste, was noch fehlt oder vom Kunden kommen muss.
5. **Nach Freigabe:** Cloudflare-Anleitung + Domain-Anleitung für den Kunden, Eintrag ins Lernbuch.

## 2. Pakete (Stand Preise: 399 / 799 / 1.499 €, Hosting inklusive)

| Paket | Umfang |
|---|---|
| Basis 399 € | 3 Seiten (Start, Leistungen, Kontakt), Texte vom Kunden, Kontaktformular, Anruf-/WhatsApp-Knopf, Google-Karte, Öffnungszeiten, Impressum aus Fragebogen, fertig in 5 Tagen |
| Business 799 € | bis 6 Seiten, Texte von FOAV mit lokalen Suchbegriffen, Terminbuchung/Reservierung/Anfrageformular, Google-Bewertungen eingebunden, Galerie, 7 Tage |
| Premium 1.499 € | bis 10 Seiten, DE/EN, Scroll- und 3D-Animationen, individuelle Module, 5 NFC-Platten inklusive, 30 Tage kleine Änderungen, 7 Tage |

Nicht enthalten: Domain (Kunde bucht selbst, ~1 €/Monat), Datenschutzerklärung und AGB (liefert der Kunde; nur Impressum erstellen wir).

## 3. Design-Regeln (gegen „alle Seiten sehen gleich aus“)

- Jede Seite muss nach **genau dieser Marke** aussehen. Prüffrage: Könnte man das Logo austauschen und die Seite passt zu einem Konkurrenten? Dann ist sie zu generisch.
- **Verboten:** Dreier-Kartenreihen mit Icons als Standardmuster, Eyebrow + Überschrift + Untertitel + 3 Karten, lila/blaue Verläufe, Glas-Kacheln überall, Stockfoto-Optik, Effekte ohne Zweck, Emojis als Icons.
- **Ein Helden-Element** pro Startseite: Produktvideo, Raumfahrt (Roomtour) oder starkes echtes Foto. Für Scroll-Wow: Video in Einzelbilder zerlegen (ffmpeg, webp) und per Canvas + GSAP ScrollTrigger beim Scrollen abspielen (Apple-Stil). Lokale Betriebe: Roomtour des Ladens/Lokals als Scroll-Fahrt = FOAV-Alleinstellung.
- Helden-Videos aus Kundenfotos mit **Higgsfield** erzeugen (Produkt dreht/schwebt). Nur Stimmung, nie Dinge, die echt sein müssen.
- Typografie mit Charakter (passendes Schriftpaar, selbst gehostet, keine Google-Fonts-Abrufe – DSGVO).
- Mobil zuerst: jede Animation muss auf 390 px Breite genauso gut wirken; `prefers-reduced-motion` respektieren.
- Vorlage vom Menschen (Link, Screenshot, TikTok) immer ernst nehmen: das Niveau treffen, nicht kopieren.

## 4. Technik

- Statische Seite (HTML/CSS/JS oder Astro/Next mit statischem Export) für **Cloudflare Pages** (kostenlos, FOAV-Konto). Kein Server nötig.
- Kontaktformular: an FOAV-Endpunkt bzw. Resend; nie `mailto` als einziger Weg.
- SEO: Titel und Beschreibung pro Seite mit Ort + Leistung, schema.org `LocalBusiness`, `sitemap.xml`, `robots.txt`, Open-Graph-Bild, saubere Überschriften.
- Bilder als webp/avif, Lazy Loading, Ziel Lighthouse ≥ 90 mobil.
- Fußzeile: kleiner Link „Website von FOAV“ → https://foav.de.

## 5. Recht (nie verhandelbar)

- **Impressum** vollständig aus dem Fragebogen (Name/Rechtsform, Anschrift, Kontakt, Register, USt-IdNr., Kammer, Verantwortlicher § 18 MStV). Fehlt etwas: als offene Frage melden, nichts erfinden.
- **Keine erfundenen Inhalte:** keine Bewertungen, Zahlen, Auszeichnungen, Preise, Öffnungszeiten, Teammitglieder, die nicht vom Kunden stammen.
- KI-Bilder nie für echte Produkte, Gerichte, Räume oder Personen des Kunden ausgeben.
- Nur Fotos, für die der Kunde die Rechte hat (Fragebogen „Bildrechte“).
- Kein Tracking ohne Einwilligung; Schriften und Skripte möglichst selbst hosten.

## 6. Verkaufsentwurf (Kunde hat noch nicht gekauft)

- Nur die Startseite, maximal einige Stunden Aufwand.
- `noindex`, in `robots.txt` gesperrt, nicht ratbarer Link, dezentes Band „Entwurf von FOAV“.
- Nicht als offizielle Seite des Betriebs auftreten (Marke/Name gehören dem Betrieb).
- Inhalte nur aus öffentlichen Angaben; unten „Diese Website ab 399 € – foav.de“.

## 7. Übergabe

- Checkliste für den Menschen: was prüfen, was vom Kunden fehlt.
- Anleitung für den Kunden: Domain mit Cloudflare verbinden (ein DNS-Eintrag, keine Zugangsdaten an FOAV).
- Dem Kunden den optionalen FOAV-Service anbieten (kleine Änderungen, Google-Profil), falls eingeführt.
