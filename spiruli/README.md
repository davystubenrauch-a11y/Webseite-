# SPIRULI® — Landing Page

Landing page for **SPIRULI® Health & Vitality**: a vegan, fermented functional beverage on a Holunder-Zitrus-Algen base.

**Stack:** Next.js (App Router) · Tailwind CSS · React Three Fiber + drei · GSAP ScrollTrigger · Framer Motion

```bash
cd spiruli
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

When deploying (e.g. Vercel), set the project root directory to `spiruli/`.

## Concept

The page is built on the drink's real facts: "Der Balancer. Made in Germany.", the name from Spirulina + Lithothamnium, the ingredient list and the nutrition panel (`lib/site.ts`). It uses the colours of the can (petrol, cream, a touch of algae green) and one 3D moment: the can turns once while the hero is pinned.

## Sections

1. **Hero:** pinned. The satin 3D can makes one full turn while three statements change.
2. **Name:** SPIRU (Spirulina platensis) + LI (Lithothamnium calcareum).
3. **Zutaten:** all nine ingredients in label order, next to the 4K render.
4. **Nährwerte:** label-style nutrition panel (per 100 ml and per 200 ml can) and a vitamin accordion with EU claims.
5. **Momente:** when people drink it.
6. **Qualität:** PZN with barcode, Made in Germany, elderberries, SGS Fresenius.
7. **Fragen** and **Kaufen**.

## The can

The can is drawn in real time (`components/stage/CanStage.tsx`, three.js), so it stays sharp at any screen size and tumbles freely as you scroll. To look like the Blender render, it uses:
- the same lathe profiles as `scripts/render_can.py`;
- the full label at 4096 px with its PBR map (`public/label/can-color.webp`, `can-pbr.webp`);
- the Blender studio captured as an HDRI (`public/env/studio.hdr`) for the reflections.

Each section sets the can's pose through its `data-can` attribute: position, scale, spin (`ry`), pitch (`rx`), roll (`rz`) and opacity (`o`).

Pipeline after a design change:

1. `python3 scripts/bake-label.py`: extracts the painted swoosh from `public/spiruli-can.jpg`.
2. `node scripts/label-export/export.mjs OUT 2`: paints the label with `lib/drawLabel.ts` at 4096 px. Save `label-color.png` as `public/label/can-color.webp` (saturation +15 %) and `label-pbr.png` (scaled to 2048 px) as `can-pbr.webp`.
3. Optional: Blender (`bpy`, Python 3.11):
   - `scripts/render_can.py -- --mode env` re-captures the studio HDRI;
   - `--mode still` renders the 4K product image `public/renders/spiruli-4k.jpg`.

## Before launch

- `lib/site.ts`: contact email (placeholder `info@spiruli.de`).
- Footer: link Impressum and Datenschutz.
- Health claims in `lib/nutrients.ts` follow the EU register (VO (EU) Nr. 432/2012). They may only be used if a can supplies a significant amount of the nutrient (for beverages, ≥ 7.5 % NRV per 100 ml). Verify each one against the lab analysis.
- Story and flavor copy is a draft. Have it reviewed by the brand team.
