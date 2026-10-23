# SPIRULI® – Dosen-Design (200 ml Slim-Dose)

Version 2: ein ruhiges, hochwertiges Health-Drink-Design.
- **Farben:** weicher Verlauf von Creme über Mint zu tiefem Algengrün.
- **Logo:** einfarbiges Script-Logo „Spiruli®“, senkrecht wie auf der bisherigen Dose.
- **Illustrationen:** feine Linien – Holunder, Zitrone, Spirulina-Faden.
- **Schrift:** edle Serifenschrift (Fraunces) mit klarer Sans (Manrope).
- **Badges:** minimalistisch, Vitamin B11 · Vegan · Vitamin B12.

Die erste, buntere Version liegt in `v1/`.

## Dateien

| Datei | Inhalt |
| --- | --- |
| `label.svg` | Druckvorlage als Vektor, Schriften eingebettet (166,5 × 95 mm) |
| `label-print.png` | Etikett als Bild, 6660 × 3800 px (ca. 1000 dpi) |
| `label.png` | Etikett, 3330 × 1900 px (Textur für das Mockup) |
| `mockup-hero.png` | Präsentation: zwei Dosen mit Kondenswasser, Zitronenscheiben, Holunder und Blättern |
| `mockup-front/left/right/back.png` | Einzelansichten |

## Aufbau rund um die Dose

- **Vorderseite:** Script-Logo, „Health & Vitality“, Botanik, „Natürliche Energie“, Badges B11 · Vegan · B12
- **Linke Seite:** „Natürliche Energie aus der Alge.“, Produktbeschreibung, „Fermentiert aus“ Holunder · Zitrus · Spirulina
- **Rechte Seite:** „Was drin ist“ (B-Komplex, Vitamin C & Folsäure, 18+ Aminosäuren, vegan), SGS-Fresenius-Hinweis, PZN
- **Rückseite (Naht):** Pflichtangaben und PZN-Barcode (Code 39, scannbar)

## Vor dem Druck

- Text in eckigen Klammern ist Platzhalter: Zutaten, Nährwerte, Füllmenge, Hersteller und Pfand-Logo (DPG). Diese Angaben müssen aus Rezeptur und Analyse ergänzt werden.
- Maße (Ø 53 mm, Druckhöhe 95 mm) sind angenommen. Bitte die Stanzkontur (Dieline) des Dosenherstellers verwenden und das Design darauf anpassen.
- Für die Druckerei Schriften in Pfade umwandeln (z. B. in Illustrator). Die Schriften liegen in `fonts/`: Yellowtail, Fraunces und Manrope, alle Open Font License.
- Der SGS-Fresenius-Hinweis ist reiner Text, kein Logo. Das offizielle Prüfzeichen nur mit Lizenz verwenden.

## Neu erzeugen

```bash
python3 build_label.py                      # label.svg
node render.mjs 2 label.png                  # Etikett als PNG (braucht Playwright)
python3 -m http.server 8123 --directory ..   # in einem zweiten Terminal
node render-mockups.mjs                      # Mockups
```
