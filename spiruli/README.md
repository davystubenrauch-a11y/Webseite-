# SPIRULI® – Landingpage

Next.js 16 + Tailwind, helles Design mit Algen-Farben und Bricolage Grotesque.

## Aufbau
Hero → Getränk (Dose landet im Rahmen) → „Alles drin.“ (Dose zerfällt in ihre Zutaten) → Zutaten (Fotokarten) → Shop
→ So entsteht SPIRULI → Analytisch nachgewiesen → Vier Gründe → Nährwerte → Fragen → Apotheke/PZN → Footer.
Weiches Scrollen mit Lenis; Scroll-Animationen laufen über eine gemeinsame Schleife (`lib/ticker.ts`), nur solange ihr Abschnitt sichtbar ist.
Lade-Intro (`Preloader.tsx`). Shop mit 12er/24er-Tray (2,95 € je Dose) und Warenkorb (`lib/cart.tsx`, `components/shop/`); Bestellungen gehen bis zur Anbindung eines Zahlungsanbieters per E-Mail raus.

## Die Dose
`components/can/FloatingCan.tsx` zeigt eine einzige Dose (`public/can/spiruli.webp`, freigestelltes Produktfoto).
Sie richtet sich nach den Platzhaltern `CanSlot name="hero"` und `name="intro"`, gleitet beim Scrollen gedämpft
von einem zum anderen und bekommt einen wandernden Lichtreflex. Neues Foto: freistellen (z. B. mit `rembg`),
als WebP mit Transparenz speichern und `--can-aspect` in `app/globals.css` auf Breite / Höhe setzen.

`scripts/render_*.py` (Blender-Renderings) und `scripts/label-export/` sind ältere Werkzeuge für das 3D-Modell und das Etikett.

## Platzhalter
E-Mail (`lib/site.ts`), Impressum/Datenschutz, Nährwerte prüfen (B12 auf der Dose 2 µg vs. Herstellerangabe 0,45 µg/100 ml).
