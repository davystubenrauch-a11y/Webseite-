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

The can on the page is photoreal: a 360° turntable pre-rendered with Blender Cycles and played back as an image sequence (`components/stage/CanSequence.tsx`, 60 frames in `public/can/`). Scrolling picks the frame and moves, scales and tilts the image between the per-section poses.

Pipeline to re-render after a design change:

1. `python3 scripts/bake-label.py`: extracts the painted swoosh from `public/spiruli-can.jpg` into `public/label/`.
2. `node scripts/label-export/export.mjs OUT 3`: paints the full label with `lib/drawLabel.ts` at 6144 px (wordmark, copy, band, badges, seal and back panel are vector art) and writes `label-color.png` and `label-pbr.png`.
3. Render with Blender (the `bpy` package, Python 3.11):
   `python3.11 scripts/render_can.py -- --label OUT/label-color.png --pbr OUT/label-pbr.png --out FRAMES --frames 60 --size 800x1600 --samples 64`.
   Use `--mode still` for a 4K hero image.
4. `python3 scripts/pack-frames.py FRAMES`: crops the frames and writes WebP files to `public/can/`.

For a sharper swoosh, use a higher-resolution source image or the designer's artwork in step 1.

## Before launch

- `lib/site.ts`: contact email (placeholder `info@spiruli.de`).
- Footer: link Impressum and Datenschutz.
- Health claims in `lib/nutrients.ts` follow the EU register (VO (EU) Nr. 432/2012). They may only be used if a can supplies a significant amount of the nutrient (for beverages, ≥ 7.5 % NRV per 100 ml). Verify each one against the lab analysis.
- Story and flavor copy is a draft. Have it reviewed by the brand team.
