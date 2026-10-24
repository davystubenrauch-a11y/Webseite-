"use client";

import { useEffect, useRef, useState } from "react";
import LazyCanStage from "@/components/stage/LazyCanStage";

/** Three lines the hero walks through while the can makes one turn. */
const beats = [
  { kicker: "Spirulina-Erfrischungsgetränk", title: ["Der", "Balancer."], text: "Spritzig, leicht und vegan – mit Holunder, Zitrone und der Mikroalge Spirulina. Made in Germany." },
  { kicker: "Zwei Algen, ein Name", title: ["Spirulina", "trifft Rotalge."], text: "Spirulina platensis und Lithothamnium calcareum – daher der Name SPIRULI." },
  { kicker: "200 ml Dose", title: ["Leicht", "und spritzig."], text: "Rund 22 kcal pro 100 ml, gesüßt mit Agavensirup, mit natürlichen B-Vitaminen und Aminosäuren." },
];

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = section.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      progress.current = p;
      setBeat(Math.min(beats.length - 1, Math.floor(p * beats.length * 0.999)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={section} id="top" className="relative h-[280vh] bg-petrol-deep text-cream">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* A soft studio light behind the can, like a product shot. */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_70%_at_68%_45%,#16686d_0%,#0a3134_60%,#071f21_100%)]" />

        <div className="wrap relative grid flex-1 items-center gap-4 pt-16 md:grid-cols-[1fr_0.9fr]">
          <div className="relative order-2 min-h-[16rem] md:order-1 md:min-h-[24rem]">
            {beats.map((b, i) => (
              <div
                key={b.kicker}
                aria-hidden={i !== beat}
                className={`absolute inset-x-0 top-0 transition-all duration-700 ${
                  i === beat ? "translate-y-0 opacity-100" : i < beat ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"
                }`}
              >
                <p className="label text-leaf">{b.kicker}</p>
                {i === 0 ? (
                  <h1 className="headline mt-4 text-[15vw] md:text-[7.5vw]">
                    {b.title[0]} <br />
                    {b.title[1]}
                  </h1>
                ) : (
                  <h2 className="headline mt-4 text-[13vw] md:text-[6.5vw]">
                    {b.title[0]} <br />
                    {b.title[1]}
                  </h2>
                )}
                <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/80">{b.text}</p>
              </div>
            ))}
          </div>
          <div className="relative order-1 h-[46svh] md:order-2 md:h-[82svh]">
            <LazyCanStage progress={progress} className="absolute inset-0" />
          </div>
        </div>

        <div className="wrap relative flex items-center justify-between pb-6 text-sm text-cream/70">
          <div className="flex gap-2" aria-hidden>
            {beats.map((_, i) => (
              <span key={i} className={`h-1 w-8 rounded-full transition-colors ${i <= beat ? "bg-cream" : "bg-cream/25"}`} />
            ))}
          </div>
          <span>Scrollen – die Dose dreht sich</span>
        </div>
      </div>
    </section>
  );
}
