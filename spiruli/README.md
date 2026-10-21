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

1. **Hero (lime):** giant "Natürliche Energie." headline with the 3D can floating between the words. Ingredient illustrations drift with the pointer, and a rotating "Dreh mich!" sticker invites visitors to drag the can.
2. **Ticker:** tilted band with the key facts.
3. **Manifest:** the product statement in large type; its words ink in as you scroll.
4. **Zutaten:** horizontal ingredient journey (Holunder, Zitrus, Spirulina, Fermentation). It is pinned and scrolled sideways on desktop and swipeable on mobile.
5. **Die Dose:** the 3D can with four callouts (vegan, B vitamins, amino acids, PZN), plus spin/back/"Eiskalt" controls.
6. **Nährstoffe:** vitamin accordion with the EU claims, and an amino-acid chip cloud with filters (Essentiell, BCAA).
7. **Wer dahinter steckt:** biotechnologists, therapists, master brewers.
8. **Geprüft & gelistet:** PZN ticket with a scannable barcode and check-digit maths, plus the SGS Fresenius stamp.
9. **FAQ** and a final **"Frag in deiner Apotheke"** call to action.

The 3D can (`components/three/SpiruliCan.tsx`) uses the real artwork, unwrapped from the product photo by `scripts/bake-label.py` into `public/label/`.

## Design

Colour blocks taken from the ingredients: lime, elderberry, citrus and algae on cream, anchored by the can's petrol (`tailwind.config.ts`). Bricolage Grotesque for text, Caveat for handwritten notes, Josefin Sans for the SPIRULI wordmark. Ink outlines and offset "sticker" shadows give the page a printed, crafted feel.

## Updating the can artwork

Replace `public/spiruli-can.jpg` with a straight-on photo or render of the can. Adjust `CX`, `R`, `TOP` and `BOTTOM` in `scripts/bake-label.py` to the can's position in the image, then run `python3 scripts/bake-label.py` (needs Pillow and NumPy). A high-resolution flat label file from the designer gives the sharpest result.

## Before launch

- `lib/site.ts`: contact email (placeholder `info@spiruli.de`).
- Footer: link Impressum and Datenschutz.
- Health claims in `lib/nutrients.ts` follow the EU register (VO (EU) Nr. 432/2012). They may only be used if a can supplies a significant amount of the nutrient (for beverages, ≥ 7.5 % NRV per 100 ml). Verify each one against the lab analysis.
- Story and flavor copy is a draft. Have it reviewed by the brand team.
