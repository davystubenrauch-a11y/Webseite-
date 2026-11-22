# Pitch-Paket Makler: leere Wohnung virtuell einrichten

Stand 22.11.2026. Ziel: Makler in Solln bestellen regelmäßig Renderings (49 € / 3 für 119 €). Unsere Kosten: 0 € (GPT Image unbegrenzt im Plus-Jahresabo, nur auf higgsfield.ai).

## Makler in Solln (inhabergeführt, Büro vor Ort; Quelle: Gelbe Seiten, Websites)

| Makler | Adresse | Anzeigen |
|---|---|---|
| Hörbrand Immobilien | Grünbauerstr. 1 | ImmoScout24, immowelt |
| Mrozik Immobilien GmbH | Littmannstr. 47 | |
| Dr. Mariacher Immobilien GmbH | Sollner Str. 10 | |
| RB-Immobilien e.K. | Whistlerweg 13 | |
| Duken & v. Wangenheim GmbH | Kirchbachweg 7 | |
| Hoffmann Immobilien | Whistlerweg 39B | |
| Bieler Immobilien | Sollner Str. 43 A (Nähe) | |

Große Ketten (Engel & Völkers, von Poll, Sotheby's) haben eigene Dienstleister und sind keine guten ersten Kunden.

## Schritt 1: Foto finden (10 Min.)
ImmoScout24-App → Ort „München Solln“ (auch Forstenried, Fürstenried, Thalkirchen) → Wohnungen kaufen und mieten → Anzeigen der Makler oben durchsehen → **ein Foto mit leerem Raum** (Wohnzimmer am besten) → Screenshot. Adresse/Titel der Anzeige und den Makler notieren.

## Schritt 2: Rendering (Higgsfield → Bild → GPT Image, High, 2K, Seitenverhältnis Auto, 3 Varianten, Screenshot als Referenz)

Wohnzimmer:
```
Use the uploaded photo as the exact base: exactly the same room from exactly the same camera position. Keep walls, windows, doors, radiators, floor, ceiling, light switches and sockets exactly identical; do not change the architecture. Furnish it realistically for a property listing, matching the style of the apartment: a large light wool rug; a three-seater sofa in warm grey fabric against the longest free wall; a low oval oak coffee table about 40 cm in front of it; one armchair in cognac leather facing the sofa on the same rug; a slim floor lamp beside the sofa; a large potted plant in a corner; one framed print on the wall. Real furniture sizes that fit the room, nothing blocks doors or windows, nothing floats alone in empty space. Keep the original daylight and colors. Professional real-estate photography, true-to-life colors, straight vertical lines. No text, no people, no logos.
```

Schlafzimmer:
```
Use the uploaded photo as the exact base: exactly the same room from exactly the same camera position. Keep walls, windows, doors, radiators, floor and ceiling exactly identical; do not change the architecture. Furnish it realistically as a calm bedroom for a property listing: a double bed with a simple upholstered headboard against the wall opposite the window, white and light grey linen bedding, two small oak bedside tables with lamps, a wool rug under the lower part of the bed, linen curtains at the window. Real furniture sizes, nothing blocks doors or windows. Keep the original daylight. Professional real-estate photography, true-to-life colors, straight vertical lines. No text, no people.
```

Essbereich / Wohnküche:
```
Use the uploaded photo as the exact base: exactly the same room from exactly the same camera position. Keep walls, windows, doors, kitchen units if present, floor and ceiling exactly identical; do not change the architecture. Furnish the free area realistically for a property listing: a solid oak dining table for six near the window, six simple chairs, a linen pendant lamp above the table, a sideboard against a free wall with a vase, a plant in a corner. Real furniture sizes, nothing blocks doors or windows. Keep the original daylight. Professional real-estate photography, true-to-life colors. No text, no people, no food.
```

Prüfen: Fenster, Türen, Heizkörper an derselben Stelle? Möbel passen in den Raum? Sonst neu generieren.

## Schritt 3: Video (Higgsfield → Video → Kling 3.0, 5 s, Seitenverhältnis wie Foto; Start frame = leeres Foto, End frame = Rendering)
```
The empty room gradually becomes the furnished room of the end frame. The furniture appears naturally in place, one piece after the other, while the light stays the same. Camera: very slow steady push-in. Walls, windows, doors and floor stay exactly in place. No shake, no morphing, real-world physics, natural light, subtle film grain.
```

## Schritt 4: „fertig“ an Claude
Claude holt die Ergebnisse aus dem Higgsfield-Verlauf und macht: Vorher/Nachher-Bild, kurzen Film mit Hinweis „virtuell eingerichtet“.

## Schritt 5: Besuch im Maklerbüro (vormittags)
„Grüß Gott, wir sind Florian und Davy von FOAV, aus Solln. Wir richten leere Wohnungen virtuell ein, für Anzeigen und Exposés. Ich hab mir erlaubt, ein Foto aus Ihrer Anzeige in der [Straße] als Beispiel zu nehmen. Darf ich's kurz zeigen?“
Dann: vorher, nachher, Film. Danach fragen: „Wie viele leere Objekte haben Sie im Jahr ungefähr?“
Angebot: 49 € pro Bild, 3 Bilder 119 €, Lieferung in 48 Stunden, Rundgang-Film ab 199 €. Erstes Bild für eine echte Anzeige gratis als Test (Entscheidung der Gründer).

Hinweise für den Makler: Virtuell eingerichtete Bilder in Anzeigen als „virtuell eingerichtet“ kennzeichnen (sonst Irreführungsgefahr). Das Demo-Bild nur zeigen, nicht weitergeben oder posten; das Originalfoto gehört dem Makler bzw. seinem Fotografen.
