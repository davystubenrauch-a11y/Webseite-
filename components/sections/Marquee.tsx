const items = ["NFC Review Cards", "Theken-Stands", "High-End Webentwicklung", "KI-Roomtours", "360° Walkthroughs", "Made in München", "5-Sterne-Automatisierung"];

/** Endless gold ticker between hero and content. */
export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-navy-950/40 py-5" aria-hidden>
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-sm tracking-[0.3em] text-white/45">
            {t.toUpperCase()}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
