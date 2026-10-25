# SPIRULI® – Landingpage

Next.js 16 + Tailwind, helles Design mit Algen-Farben und Bricolage Grotesque.

## Aufbau
Hero („Grüne Balance“, Dose steigt ein, freigestellte Zutaten schweben mit Maus-/Scroll-Parallaxe) → Getränk (Dose landet im Rahmen)
→ Manifest (Text füllt sich Wort für Wort) → „Alles drin.“ (angepinnt: die Dose zerfällt beim Scrollen in ihre Zutaten, mit Beschriftungen)
→ Laufband → Zutaten (übereinander gleitende Fotokarten) → Vier Gründe (läuft seitwärts) → „Der Balancer“ (Zoom durch den Schriftzug ins Foto)
→ Nährwerte (dunkle Kacheln) → Fragen → Finale (Zutaten kreisen um die Dose, PZN) → Footer.
Weiches Scrollen mit Lenis. Freigestellte Zutaten liegen in `public/float/`, Fotos in `public/photos/`.

## Die Dose
`components/can/FloatingCan.tsx` zeigt eine einzige Dose (`public/can/spiruli.webp`, freigestelltes Produktfoto).
Sie richtet sich nach den Platzhaltern `CanSlot name="hero"` und `name="intro"`, gleitet beim Scrollen gedämpft
von einem zum anderen und bekommt einen wandernden Lichtreflex. Neues Foto: freistellen (z. B. mit `rembg`),
als WebP mit Transparenz speichern und `--can-aspect` in `app/globals.css` auf Breite / Höhe setzen.

`scripts/render_*.py` (Blender-Renderings) und `scripts/label-export/` sind ältere Werkzeuge für das 3D-Modell und das Etikett.

## Platzhalter
E-Mail (`lib/site.ts`), Impressum/Datenschutz, Nährwerte prüfen (B12 auf der Dose 2 µg vs. Herstellerangabe 0,45 µg/100 ml).
