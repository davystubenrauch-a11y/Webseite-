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

Bold colour fields in the drink's palette: algae green, lime, elderberry magenta, citrus and cream. Tone-on-tone botanical wallpaper (`components/ui/Pattern.tsx`), extra-wide Archivo Black headlines and small dense uppercase copy.

**One 3D can for the whole page.** `components/stage/CanStage.tsx` renders the can in a fixed layer above the sections. Each section declares where the can should be through its `data-can` attribute: position, scale and rotation. Scrolling interpolates between those poses, so the can flies, spins and tilts from section to section. On phones, side poses move the can to the screen edge so it never covers content.

## Sections

1. **Hero:** giant "SPIRULI" over the can.
2. **Ein neuer Blick auf Energie:** the can tilts in from the right.
3. **Aus der Alge / In die Dose:** text split around the can.
4. **Zutaten:** cream list beside an elderberry field.
5. **Was drin steckt:** vitamin tiles with EU claims and amino-acid pills.
6. **Team:** "Jahre Forschung. Drei Disziplinen."
7. **Apothekenqualität:** PZN with a scannable barcode, and SGS Fresenius.
8. **Probier's aus:** ordering steps and calls to action.

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
