const items = [
  "Vegan",
  "Natürliche B-Vitamine",
  "18+ Aminosäuren",
  "Fermentiert",
  "Holunder · Zitrus · Algen",
  "SGS Fresenius analysiert",
  "PZN 11110571",
];

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-gold/15 bg-petrol-950/60 py-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-[marquee_45s_linear_infinite] gap-14 motion-reduce:animate-none">
        {[...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-14 whitespace-nowrap font-display text-2xl font-light uppercase tracking-[0.2em] text-white/45">
            {it}
            <span className="text-sm text-emerald-bright">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
