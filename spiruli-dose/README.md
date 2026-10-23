# SPIRULI® – Dosen-Design (200 ml Slim-Dose)

Neues Etikett-Design für die SPIRULI-Dose, angelehnt an die bisherige grüne Dose:
- vertikales Script-Logo
- blaues Band mit den Badges Vitamin B11, Vegan und Vitamin B12

Neu daran: frisches Limettengrün, eine algengrüne „Flüssigkeits“-Welle mit Spirulina-Fäden, Zutaten-Illustrationen und klar gegliederte Seiten.

## Dateien

| Datei | Inhalt |
| --- | --- |
| `label.svg` | Druckvorlage als Vektor, Schriften eingebettet (166,5 × 95 mm) |
| `label-print.png` | Etikett als Bild, 6660 × 3800 px (ca. 1000 dpi) |
| `label.png` | Etikett, 3330 × 1900 px (Textur für das Mockup) |
| `mockup-hero.png` | Präsentation: drei Dosen (links, vorne, rechts) |
| `mockup-front/left/right/back.png` | Einzelansichten |

## Aufbau rund um die Dose

- **Vorderseite:** Script-Logo „Spiruli®“, „Health & Vitality“, „Natürliche Energie“, Badges B11 · Vegan · B12
- **Linke Seite:** „Algen-Fitness-Getränk“, Beschreibung, Zutaten Holunder · Zitrus · Algen
- **Rechte Seite:** „100 % pflanzlich“-Stempel, SGS-Fresenius-Hinweis, „18+ Aminosäuren“
- **Rückseite (Naht):** Pflichtangaben und PZN-Barcode (Code 39, scannbar)

## Vor dem Druck

- Text in eckigen Klammern ist Platzhalter: Zutaten, Nährwerte, Füllmenge, Hersteller und Pfand-Logo (DPG). Diese Angaben müssen aus Rezeptur und Analyse ergänzt werden.
- Maße (Ø 53 mm, Druckhöhe 95 mm) sind angenommen. Bitte die Stanzkontur (Dieline) des Dosenherstellers verwenden und das Design darauf anpassen.
- Für die Druckerei Schriften in Pfade umwandeln (z. B. in Illustrator). Die Schriften liegen in `fonts/`: Yellowtail und Bricolage Grotesque, beide Open Font License.
- Der SGS-Fresenius-Hinweis ist reiner Text, kein Logo. Das offizielle Prüfzeichen nur mit Lizenz verwenden.

## Neu erzeugen

```bash
python3 build_label.py                      # label.svg
node render.mjs 2 label.png                  # Etikett als PNG (braucht Playwright)
python3 -m http.server 8123 --directory ..   # in einem zweiten Terminal
node render-mockups.mjs                      # Mockups
```
