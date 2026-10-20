# SPIRULI® — Landing Page

Luxury-premium landing page for **SPIRULI® Health & Vitality**: a vegan, fermented functional beverage on a Holunder-Zitrus-Algen base.

**Stack:** Next.js (App Router) · Tailwind CSS · React Three Fiber + drei · GSAP ScrollTrigger · Framer Motion

```bash
cd spiruli
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

When deploying (e.g. Vercel), set the project root directory to `spiruli/`.

## Sections

1. **Hero:** photorealistic, fully procedural 3D can (`components/three/SpiruliCan.tsx`). A lathe-turned aluminium body, neck, lid and pull tab, with a wrap-around label painted on canvas (`lib/drawLabel.ts`). The label has separate colour and PBR maps, so gold ink reads as metal and the petrol lacquer as satin paint. Condensation is a procedural clearcoat normal map (`lib/condensation.ts`). The can auto-rotates 360°, can be dragged with inertia, tilts toward the pointer and snaps to the front or back. Spirulina micro-particles, citrus/water drops and elderberries float around it, lit by an animated procedural studio environment. The toolbar toggles spin, front/back and "Eiskalt" (condensation on/off).
2. **Story & Expertise:** marble section with the biotechnologists / therapists / brewers triad, plus a scroll-drawn process timeline ending in the SGS Fresenius certification.
3. **Flavor Profile:** pinned scroll scene. The can turns once per note (Holunder → Zitrus → Algen) while the light colour and copy change.
4. **Ingredient & Nutrition Matrix:** periodic-table grid of the B-complex, vitamin C, folic acid and 18 amino acids plus GABA. It has filters (B-Komplex, Aminosäuren, Essentiell, BCAA…) and a detail panel. Data lives in `lib/nutrients.ts`.
5. **Medical Grade:** PZN 11110571 seal and a real, scannable Code 39 PZN barcode (`lib/code39.ts`), with a live PZN-8 check-digit verification. Also shows the IFA GmbH listing and the SGS Fresenius quality card.
6. **Bezug:** pharmacy ordering steps, a copy-PZN button and a trade-inquiry CTA.

## Before launch

- `lib/site.ts`: contact email (placeholder `info@spiruli.de`).
- Footer: link Impressum and Datenschutz.
- Health claims in `lib/nutrients.ts` follow the EU register (VO (EU) Nr. 432/2012). They may only be used if a can supplies a significant amount of the nutrient (for beverages, ≥ 7.5 % NRV per 100 ml). Verify each one against the lab analysis.
- Story and flavor copy is a draft. Have it reviewed by the brand team.
