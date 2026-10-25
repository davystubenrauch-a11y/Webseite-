const lines = [
  "Zwei Algen.",
  "Holunder, Zitrone, Orange.",
  "Ein Schuss Kohlensäure.",
];

/** The idea in three lines, revealed one after another. */
export default function Statement() {
  return (
    <section id="geschmack" className="bg-set py-28 text-cream sm:py-40">
      <div className="wrap">
        <p data-reveal className="eyebrow text-gold">
          Spirulina-Erfrischungsgetränk
        </p>
        <h2 className="display mt-8 text-[13vw] md:text-[7.2vw]">
          {lines.map((l, i) => (
            <span key={l} data-reveal className="block" style={{ ["--d" as string]: `${i * 0.12}s` }}>
              {i === 0 ? (
                <>
                  Zwei <em className="text-leaf">Algen.</em>
                </>
              ) : (
                l
              )}
            </span>
          ))}
        </h2>
        <div className="mt-16 grid gap-10 border-t border-cream/15 pt-10 md:grid-cols-2">
          <p data-reveal className="max-w-md text-lg leading-relaxed text-cream/75">
            <span className="text-cream">SPIRU</span>lina platensis und <span className="text-cream">LI</span>thothamnium calcareum – die Mikroalge und die Rotalge
            geben SPIRULI seinen Namen.
          </p>
          <p data-reveal className="max-w-md text-lg leading-relaxed text-cream/75" style={{ ["--d" as string]: "0.1s" }}>
            Kein Smoothie, kein Pulver: eine leichte Erfrischung in der Dose, rund 22 kcal pro 100 ml, gesüßt mit Agavensirup.
          </p>
        </div>
      </div>
    </section>
  );
}
