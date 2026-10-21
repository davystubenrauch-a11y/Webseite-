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

## Sections

1. **Hero:** photorealistic 3D can (`components/three/SpiruliCan.tsx`). The aluminium body, neck, lid and pull tab are built in code. The front artwork is the real can design: `scripts/bake-label.py` unwraps it from the product photo (`public/spiruli-can.jpg`), removes the baked-in studio lighting, and writes a colour texture plus a PBR map (`public/label/`), so the gold ink renders as metal. The back of the label and the gold band are painted in `lib/drawLabel.ts`. The can auto-rotates 360°, can be dragged with inertia, tilts toward the pointer and snaps to the front or back. "Eiskalt" adds condensation. Spirulina micro-particles, citrus drops and elderberries float around it.
2. **Benefits:** vegan, natural B vitamins, 18+ amino acids, tested quality.
3. **Story & Expertise:** biotechnologists, therapists and master brewers, plus a scroll-drawn process timeline ending in the SGS Fresenius certification.
4. **Flavor Profile:** pinned scroll scene. The can turns once per note (Holunder → Zitrus → Algen) while the light colour and copy change.
5. **Ingredient & Nutrition Matrix:** periodic-table grid of the B-complex, vitamin C, folic acid and 18 amino acids plus GABA. It has filters (B-Komplex, Aminosäuren, Essentiell, BCAA…) and a detail panel. Data lives in `lib/nutrients.ts`.
6. **Medical Grade:** PZN 11110571 seal and a real, scannable Code 39 PZN barcode (`lib/code39.ts`), with a live PZN-8 check-digit verification. Also shows the IFA GmbH listing and the SGS Fresenius quality card.
7. **Bezug:** pharmacy ordering steps, a copy-PZN button and a trade-inquiry CTA.

## Design

Light, calm look: warm off-white background, petrol from the can for text and buttons, algae green as the accent (`tailwind.config.ts`). Manrope for all text; Josefin Sans only for the SPIRULI wordmark.

## Updating the can artwork

Replace `public/spiruli-can.jpg` with a straight-on photo or render of the can. Adjust `CX`, `R`, `TOP` and `BOTTOM` in `scripts/bake-label.py` to the can's position in the image, then run `python3 scripts/bake-label.py` (needs Pillow and NumPy). A high-resolution flat label file from the designer gives the sharpest result.

## Before launch

- `lib/site.ts`: contact email (placeholder `info@spiruli.de`).
- Footer: link Impressum and Datenschutz.
- Health claims in `lib/nutrients.ts` follow the EU register (VO (EU) Nr. 432/2012). They may only be used if a can supplies a significant amount of the nutrient (for beverages, ≥ 7.5 % NRV per 100 ml). Verify each one against the lab analysis.
- Story and flavor copy is a draft. Have it reviewed by the brand team.
