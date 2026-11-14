# FOAV Story-Video (9:16, 28,6 s) – sieht erst nicht wie Werbung aus

Ergebnis: `../FOAV-Story-Video-9x16.mp4`.

**Geschichte (erfunden, im Abspann gekennzeichnet):** Lisa sucht am Samstag ein Café. Das beste ist 300 m entfernt, aber die alte Website
schreckt sie ab → sie frühstückt woanders. Zurückspulen. Gleiche Bäckerei, neue Website → sie reserviert. Schluss: „Und wie viele Gäste verliert DEINE Website?“

- **Stimme:** Higgsfield `elevenlabs_v4`, Stimme „Chloe“ (hell, 267 Hz; „Nora“ klang den Gründern zu alt). Jede Zeile einzeln erzeugt → `stimme.wav`, Zeiten in `times.js`.
- **Beispiel-Websites:** `demo/alt.html` (echt wirkende Seite von 2014) und `demo/neu.html` (modern, gleiche Bäckerei „Morgenduft“, erfunden). Fotos mit Higgsfield erzeugt (gpt_image_2_6).
- **Effekte:** Tippen mit Fingerpunkt, Zoom auf winzige Schrift, Abdunkeln, Zurückspulen mit 360°-Drehung, Lichtblitz, 3D-Kippen, echte Bewegungsunschärfe.
- Kein Preis im Video (Geschichte statt Angebot); Preis gehört in den Beitragstext.

    node render.js full <ordner> 90 ; python3 music.py musik.wav ; ffmpeg … tmix (siehe ../film/README.md)
