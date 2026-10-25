"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/ticker";
import Badge from "@/components/ui/Badge";
import CountUp from "@/components/ui/CountUp";

/** As listed by the manufacturer (analysis by SGS Fresenius), split into three rows. */
const rows = [
  ["Folsäure", "Vitamin B2", "Niacin", "Vitamin B6", "Vitamin B12", "Vitamin C", "Tryptophan", "Threonin"],
  ["Asparaginsäure", "Serin", "Asparagin", "Glutaminsäure", "Prolin", "Glycin", "Alanin", "Valin", "Methionin"],
  ["Isoleucin", "Leucin", "Tyrosin", "Phenylalanin", "GABA", "Ornithin", "Lysin", "Arginin"],
];
const vitamins = new Set(rows[0].slice(0, 6));
const total = rows.flat().length;

/** Three bands of nutrient names drifting in opposite directions, sped up by scrolling. */
export default function Analytik() {
  const bands = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let last = window.scrollY;
    let v = 0;
    const tick = () => {
      const y = window.scrollY;
      v += (Math.abs(y - last) - v) * 0.1;
      last = y;
      x += 0.5 + v * 0.6;
      bands.current.forEach((b, i) => {
        if (!b) return;
        const half = b.scrollWidth / 2;
        const off = (x * (1 + i * 0.25)) % half;
        b.style.transform = `translate3d(${i % 2 ? off - half : -off}px, 0, 0)`;
      });
    };
    const stop = onFrame(bands.current[0]!.parentElement!.parentElement!, tick);
    return stop;
  }, []);

  return (
    <section className="relative z-10 overflow-hidden bg-algae py-24 text-mist sm:py-32">
      <div className="wrap relative grid items-end gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          <p data-reveal className="label text-fresh">
            Analytisch nachgewiesen
          </p>
          <h2 data-reveal className="headline mt-6 text-6xl sm:text-8xl">
            <CountUp to={total} className="text-fresh" /> Nährstoffe.
            <br />
            Rein pflanzlich.
          </h2>
          <p data-reveal className="mt-8 max-w-xl text-lg leading-relaxed text-mist/80">
            Vitamine der B-Gruppe, Vitamin C und Aminosäuren aus Holunder, Zitrus und Alge. Die begleitende Analytik von SGS Fresenius weist sie im fertigen
            Getränk nach – unter anderem diese:
          </p>
        </div>
        <Badge text="SGS Fresenius · Analysiert · Zertifiziert · " className="h-36 w-36 text-fresh sm:h-44 sm:w-44" />
      </div>

      <div aria-label="Nachgewiesene Nährstoffe" className="mt-16 space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="overflow-hidden">
            <div ref={(el) => void (bands.current[i] = el)} className="flex w-max gap-4 will-change-transform">
              {[...row, ...row].map((n, k) => (
                <span
                  key={k}
                  aria-hidden={k >= row.length}
                  className={`whitespace-nowrap rounded-full px-7 py-4 font-display text-3xl font-extrabold sm:text-5xl ${
                    vitamins.has(n) ? "bg-fresh text-ink" : k % 3 === 0 ? "bg-mist text-ink" : "border border-mist/25 text-mist"
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="wrap mt-8 text-sm text-mist/55">Grün: Vitamine · übrige: Aminosäuren. Herstellerangaben laut Analytik.</p>
    </section>
  );
}
