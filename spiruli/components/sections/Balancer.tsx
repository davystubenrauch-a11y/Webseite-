const stats = [
  { n: "22", u: "kcal / 100 ml" },
  { n: "9", u: "Zutaten" },
  { n: "2", u: "Algen" },
  { n: "0", u: "Pulver" },
];

/** Full-bleed product photo with the brand line, slowly drifting as you scroll past. */
export default function Balancer() {
  return (
    <section className="relative z-10 overflow-hidden bg-algae-deep text-mist">
      <div data-reveal className="relative min-h-[100svh]">
        <img data-zoom src="/photos/stimmung.webp" alt="SPIRULI Dose auf Schiefer mit Holunder, Zitrone und Spirulina" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[50%_40%]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-algae-deep via-algae-deep/70 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-algae-deep to-transparent" />
        <div className="wrap relative flex min-h-[100svh] flex-col justify-end pb-16 pt-32">
          <p className="label text-fresh">Willkommen bei SPIRULI</p>
          <h2 className="headline mt-6 max-w-4xl text-[15vw] sm:text-[9vw]">
            Der <span className="text-fresh">Balancer.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-mist/80">
            Für den Schreibtisch, unterwegs oder nach dem Training – eine Erfrischung mit Mikroalge, die nach Holunder und Zitrone schmeckt.
          </p>
          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-mist/15 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.u} className="bg-algae-deep/80 p-5">
                <dt className="font-display text-5xl font-extrabold text-fresh">{s.n}</dt>
                <dd className="mt-1 text-sm text-mist/75">{s.u}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
