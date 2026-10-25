const words = ["Holunder", "Zitrone", "Spirulina", "Rotalge", "Orange", "Kohlensäure", "Made in Germany"];

/** Steady, CSS-only ingredient band. */
export default function Marquee() {
  return (
    <div aria-hidden className="overflow-hidden border-y border-cream-line bg-cream py-8 text-ink">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {words.map((w) => (
              <span key={w} className="display flex items-center whitespace-nowrap px-8 text-6xl italic sm:text-7xl">
                {w}
                <span className="ml-16 text-2xl not-italic text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
