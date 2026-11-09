---
name: foav-roomtour
description: FOAV-Ablauf für KI-Roomtours (Video-Rundgang aus Handyfotos). Verwenden, wenn aus Kundenfotos eine Roomtour, ein Raum-Clip oder eine Scroll-Raumfahrt für eine Website erstellt werden soll.
---

# FOAV: KI-Roomtour erstellen

Pakete: Basis 349 € (bis 150 m², 48 h), Premium 649 € (bis 300 m², Außenbereich, 3 Kurzclips, Logo/Eckdaten, 72 h), Exklusiv 1.449 € (bis 600 m², 4K, DE/EN, 6 Clips, 5 Werktage).
Grundlage: Fragebogen `/anfrage/roomtour` (JSON per E-Mail) mit Fotos pro Raum, Raumnamen, Reihenfolge, „was darf nicht zu sehen sein“, „was muss exakt bleiben“.

## Ablauf

1. **Fotos prüfen:** pro Raum mind. 3, scharf, Tageslicht, 1×-Kamera. Fehlt etwas → konkrete Nachforderung formulieren, nicht raten.
2. **Clips erzeugen (Higgsfield, MCP verbunden):** pro Raum 1–2 Clips, 5–10 s, ruhige Kamerafahrt.
   Wenn möglich Anfangs- und Endbild aus zwei Fotos desselben Raums. 2–3 Modelle testen (z. B. Kling, Seedance) und das **treueste** wählen.
   Prompt-Grundsatz: „Slow steady camera move through the room, keep all furniture, walls, floors and proportions exactly as in the photo, no new objects, realistic daylight, no people, no text.“
3. **Treue-Prüfung pro Clip (Pflicht):** neue/fehlende Möbel? verzogene Türen/Fenster? Raum größer als echt? falsche Farben/Böden? Alles gegen „was muss exakt bleiben“ prüfen. Fehlerhafte Clips verwerfen.
4. **Schnitt (ffmpeg):** Reihenfolge laut Fragebogen, weiche Übergänge, Raumnamen, Abspann (Name, Logo bei Premium/Exklusiv), Hinweis „mit KI erstellt“ (sofern Kunde nicht ausdrücklich anders entschieden hat und es rechtlich vertretbar ist).
   Ausgabe: 16:9 (1920×1080) und 9:16 (1080×1920), H.264, `-movflags +faststart`, Dateien < 100 MB.
   Musik: nur lizenzfreie Musik mit klarer Lizenz, sonst ohne Ton liefern und Hinweis geben.
5. **Selbstprüfung** (`foav-selbstpruefung`, Abschnitt Inhalt) und Bericht mit 3 Standbildern.

## Kosten im Blick

Pro Roomtour die verbrauchten Higgsfield-Credits notieren und ins Lernbuch schreiben (Ziel: Kosten pro Paket kennen).

## Nie

- Räume schöner/größer darstellen als sie sind, Mängel wegretuschieren, wenn der Kunde „exakt“ verlangt.
- Fremde Videos oder Fotos verwenden.
