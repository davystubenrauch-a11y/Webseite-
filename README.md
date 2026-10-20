# f&d solutions — landing page

Luxury-tech landing page for **f&d solutions**: smart NFC Google review cards, custom website development and Airbnb property walkthroughs.

**Stack:** Next.js (App Router) · Tailwind CSS · React Three Fiber + drei · GSAP ScrollTrigger · Framer Motion

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Sections

1. **Hero:** photorealistic 3D round review card (`components/three/ReviewCard.tsx`). Matte navy body, brushed gold rim, Google "G", gold NFC waves and a real, scannable QR code. It idles in a 360° spin, tilts toward the pointer with spring physics, can be dragged to spin with inertia, and picks up live reflections from an animated procedural studio environment. Gold and blue particles drift off the rim. Scrolling drives the card's exit transform.
2. **Live Card Studio:** typing a company name re-engraves the 3D card in real time. You can also pick the headline, metal finish (gold / champagne / platinum) and batch size, and flip the card to see the back.
3. **Review ROI Calculator:** sliders for monthly clients, spend, rating and existing reviews. It projects review growth, rating and revenue lift. The assumptions live in `lib/roi.ts` and are shown in the UI.
4. **Services:** service pillars, an interactive browser mockup (pointer tilt, desktop/mobile, brand themes, Lighthouse rings) and a cinematic 3D Airbnb walkthrough with hotspot nodes and an auto-tour.
5. **Contact & Booking:** month calendar, time slots, service selection and a form. On confirm it offers an `.ics` calendar download and a pre-filled email to the agency.

## Customise

- `lib/site.ts`: agency email and the URL encoded in the card's QR code.
- `lib/cardStore.ts`: card defaults and metal finishes.
- `lib/drawCard.ts`: the canvas artwork for the card faces. Colour and PBR (roughness/metalness) maps are painted from the same layout, so the gold ink reads as metal.
- `tailwind.config.ts`: brand palette (`navy`, `gold`, `royal`).

Booking has no backend. The confirmation step produces an `.ics` file and a `mailto:` link. To store bookings server-side, connect a form endpoint or a scheduling API (Cal.com, Calendly).

Marketing figures in the hero and services sections (e.g. "9.4×", "+31% booking rate") are placeholders. Replace them with your own data.
