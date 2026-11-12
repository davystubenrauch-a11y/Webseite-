# FOAV Social-Video (9:16, 20 s, mit Stimme und Musik)

Ergebnis: `../FOAV-Social-Video-9x16.mp4` (Reels, TikTok, Shorts).
Ablauf: „Ihre Website sieht aus wie 2005?“ → neu (SPIRULI) → Roomtour → NFC → foav.de.

- Bild: `ad.html` (Zeiten in `S`, `render(t)`), `node render.js full <ordner>` → ffmpeg (libx264, crf 20).
- Stimme: Piper „Thorsten“ (deutsch, Lizenz CC0), Modell aus github.com/rhasspy/piper Release v0.0.2 (`voice-de-thorsten-low.tar.gz`), `python3 -m piper --length-scale 0.92`.
  Einsätze: 0,3 s / 3,3 s / 7,7 s / 12,7 s / 16,5 s.
- Musik und Effekte: selbst erzeugt mit `music.py` (keine fremden Rechte).
- Bessere Stimme möglich mit Higgsfield (ca. 1 Credit) oder selbst eingesprochen.
