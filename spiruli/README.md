# SPIRULI® – Landingpage

Next.js 16 + Tailwind. Kein Echtzeit-3D mehr: Die Dose wird in Blender (Cycles) vorgerendert,
damit sie fotorealistisch aussieht und auf jedem Gerät flüssig läuft.

## Aufbau
Hero (Video-Schleife der Dose) → Geschmack → Details (Makros) → Zutaten → Laufband → Packshot → Nährwerte → Fragen → Kaufen (PZN) → Footer.
Animationen nur per CSS (`data-reveal`, `data-zoom`, Marquee) über einen IntersectionObserver (`components/ui/Reveal.tsx`).

## Medien neu rendern
Voraussetzung: Python 3.11 mit `bpy` (Blender 5), `ffmpeg`.

1. Etikett exportieren: `node scripts/label-export/export.mjs` (malt `lib/drawLabel.ts`, 6144 px).
2. Szenen rendern (`scripts/render_scenes.py`, nutzt `render_can.py` + `render_props.py`):
   - `--mode video` – halbe Drehung, 96 Bilder, nahtlos (Vorder- und Rückseite gleich)
   - `--mode macro` – Wortmarke, Siegel, Goldband
   - `--mode packshot` – breites Studiobild
3. Video kodieren:
   `ffmpeg -framerate 24 -i video-%04d.png -c:v libx264 -crf 22 -pix_fmt yuv420p public/media/can-loop.mp4`
   und dasselbe mit `-c:v libvpx-vp9 -b:v 0 -crf 36` nach `can-loop.webm`.

## Platzhalter
E-Mail (`lib/site.ts`), Impressum/Datenschutz, Nährwerte prüfen (B12 auf der Dose 2 µg vs. Herstellerangabe 0,45 µg/100 ml).
