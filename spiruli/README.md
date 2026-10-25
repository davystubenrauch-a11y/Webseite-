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

The page is built on the drink's real facts: "Der Balancer. Made in Germany.", the name from Spirulina + Lithothamnium, the ingredient list and the nutrition panel (`lib/site.ts`). It uses the colours of the can: petrol, cream, a touch of algae green.

**Movement:**
- One photoreal can travels through the page and turns as you scroll.
- Rendered ingredients float around it at different depths.
- A band of ingredient words slides with the scroll.

## Sections

1. **Hero:** pinned. The can makes one turn while three statements change.
2. **Name:** SPIRU (Spirulina platensis) + LI (Lithothamnium calcareum).
3. **Band:** ingredient words sliding sideways.
4. **Zutaten:** all nine ingredients in label order. The can and props float on the left.
5. **Nährwerte:** label-style nutrition panel (per 100 ml and per can) and a vitamin accordion with EU claims.
6. **Momente:** when people drink it.
7. **Qualität:** PZN with barcode, Made in Germany, elderberries, SGS Fresenius.
8. **Fragen** and **Kaufen**.

## The can

The can is a 60-frame 360° turntable rendered with Blender Cycles (`public/can/`). `components/stage/CanSequence.tsx` plays it back: scroll picks the frame and moves, scales and tilts the image. Each section places `<CanPose>` anchors (`components/stage/CanPose.tsx`) with position, scale, spin, roll and opacity. On phones, the can only appears in the hero.

The label covers the whole can: the front design is repeated on the back.

Pipeline after a design change:

1. `python3 scripts/bake-label.py`: extracts the painted swoosh from `public/spiruli-can.jpg`.
2. `node scripts/label-export/export.mjs OUT 3`: paints the 6144 px label with `lib/drawLabel.ts`.
3. Render with Blender (the `bpy` package, Python 3.11):
   `python3.11 scripts/render_can.py -- --label OUT/label-color.png --pbr OUT/label-pbr.png --out FRAMES --frames 60 --size 1000x2000 --samples 48`.
   This takes about 2.5 min per frame on 4 CPU cores. Use `--first`/`--last` to split the work.
4. `python3 scripts/pack-frames.py FRAMES --height 1800`: writes WebP files to `public/can/`.

The ingredient props (`public/props/`) come from `scripts/render_props.py`.

## Before launch

- `lib/site.ts`: contact email (placeholder `info@spiruli.de`).
- Footer: link Impressum and Datenschutz.
- Health claims in `lib/nutrients.ts` follow the EU register (VO (EU) Nr. 432/2012). They may only be used if a can supplies a significant amount of the nutrient (for beverages, ≥ 7.5 % NRV per 100 ml). Verify each one against the lab analysis.
- Story and flavor copy is a draft. Have it reviewed by the brand team.
