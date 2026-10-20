"use client";

import { motion } from "framer-motion";
import WebMockup from "./WebMockup";
import AirbnbPreview from "./AirbnbPreview";
import { Arrow } from "./Hero";

const pillars = [
  {
    no: "I",
    title: "Smart Review Cards",
    copy: "NFC + QR cards in matte navy and brushed metal. One tap opens your Google review form — no app, no friction.",
    points: ["Custom engraving", "Works on every phone", "Lifetime link updates"],
  },
  {
    no: "II",
    title: "Website Development",
    copy: "Bespoke, lightning-fast sites engineered to convert — from first scroll to booked appointment.",
    points: ["Next.js & headless CMS", "Core Web Vitals 95+", "Conversion copywriting"],
  },
  {
    no: "III",
    title: "Airbnb Walkthroughs",
    copy: "Cinematic video and interactive 3D tours that sell the stay before guests ever arrive.",
    points: ["4K gimbal cinematography", "3D dollhouse tours", "Listing-ready edits"],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative overflow-x-clip py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <span className="eyebrow" data-reveal>
            04 — Agency Services
          </span>
          <h2 className="section-title mt-5" data-reveal>
            Three disciplines. <span className="text-gold italic">One standard</span> of excellence.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3" data-reveal-stagger>
          {pillars.map((p) => (
            <motion.article
              key={p.no}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="glass rim group p-7"
            >
              <span className="font-serif text-4xl italic text-gold/80">{p.no}</span>
              <h3 className="mt-6 font-serif text-2xl font-semibold text-white">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{p.copy}</p>
              <ul className="mt-6 space-y-2 border-t border-white/10 pt-5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-sm text-white/75">
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <div className="mt-24 grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-serif text-6xl italic text-white/10" data-parallax="0.3">
              II
            </p>
            <h3 className="mt-2 font-serif text-3xl font-semibold text-white sm:text-4xl" data-reveal>
              Websites that <span className="text-gold italic">close</span> the deal.
            </h3>
            <p className="mt-5 text-white/60" data-reveal>
              Try it: tilt the browser, switch between desktop and mobile, swap brand themes and tap the CTA. Every
              build ships with perfect-score performance budgets, accessible components and analytics wired to revenue.
            </p>
            <a href="#contact" className="btn-glass mt-8" data-reveal>
              Start a website project <Arrow />
            </a>
          </div>
          <div className="glass rim p-4 sm:p-6" data-reveal>
            <WebMockup />
          </div>
        </div>

        <div className="mt-28 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass rim order-2 p-4 sm:p-6 lg:order-1" data-reveal>
            <AirbnbPreview />
          </div>
          <div className="order-1 lg:order-2">
            <p className="font-serif text-6xl italic text-white/10" data-parallax="0.3">
              III
            </p>
            <h3 className="mt-2 font-serif text-3xl font-semibold text-white sm:text-4xl" data-reveal>
              Walkthroughs guests <span className="text-gold italic">feel</span>.
            </h3>
            <p className="mt-5 text-white/60" data-reveal>
              Click a glowing node to fly through the space, or press play for the cinematic auto-tour. We deliver the
              same experience as 4K film, interactive 3D and listing-optimised stills.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm" data-reveal-stagger>
              {[
                ["+31%", "booking rate"],
                ["2.4×", "listing views"],
                ["48h", "turnaround"],
                ["4K", "HDR delivery"],
              ].map(([v, l]) => (
                <li key={l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="block font-serif text-2xl font-semibold text-white">{v}</span>
                  <span className="text-white/50">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
