const words = ["Spirulina", "Holunder", "Zitrone", "Orange", "Rotalge", "Vegan", "Made in Germany"];

/** Steady, CSS-only ingredient band. */
export default function Marquee() {
  return (
    <div aria-hidden className="overflow-hidden bg-fresh py-5 text-ink">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {words.map((w) => (
              <span key={w} className="headline flex items-center whitespace-nowrap px-6 text-5xl sm:text-6xl">
                {w}
                <span className="ml-12 h-3 w-3 rounded-full bg-ink" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
