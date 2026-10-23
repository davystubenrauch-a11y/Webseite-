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

`components/three/SpiruliCan.tsx` builds the can in code: a detailed lathe-turned shoulder with a rolled rim and recessed lid, a domed base, a pull tab, and polished aluminium lit by a contrasty studio (`Studio.tsx`).

The label (`lib/drawLabel.ts`) is painted at runtime at 4096 px around the can on desktop. Lacquer gradient, wordmark (letters drawn as paths), copy, gold band, badges, embossed "Premium Formula" seal and PZN line are crisp vector art. Only the painted swoosh comes from the product photo: `scripts/bake-label.py` extracts it, upscales it and unwraps it into `public/label/swoosh*.webp`.

For a sharper swoosh, replace `public/spiruli-can.jpg` with a higher-resolution image (or the designer's artwork). Adjust `CX`, `R`, `TOP` and `BOTTOM` in the script, then run `python3 scripts/bake-label.py` (needs Pillow and NumPy).

## Before launch

- `lib/site.ts`: contact email (placeholder `info@spiruli.de`).
- Footer: link Impressum and Datenschutz.
- Health claims in `lib/nutrients.ts` follow the EU register (VO (EU) Nr. 432/2012). They may only be used if a can supplies a significant amount of the nutrient (for beverages, ≥ 7.5 % NRV per 100 ml). Verify each one against the lab analysis.
- Story and flavor copy is a draft. Have it reviewed by the brand team.
