const stats = [
  { n: "22", u: "kcal / 100 ml", t: "Leicht genug für jeden Tag." },
  { n: "9", u: "Zutaten", t: "Alle auf der Dose, nichts versteckt." },
  { n: "2", u: "Algen", t: "Spirulina und die Rotalge Lithothamnium." },
];

/** Dark algae-green break with the brand line and three numbers. */
export default function Welcome() {
  return (
    <section className="relative overflow-hidden bg-algae-deep py-28 text-mist sm:py-40">
      {/* Soft spiral rings, a nod to the spirulina strand. */}
      <svg aria-hidden viewBox="0 0 600 600" className="absolute -right-40 -top-40 w-[720px] text-fresh/10">
        {[280, 230, 180, 130, 80].map((r) => (
          <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="currentColor" strokeWidth="2" />
        ))}
      </svg>
      <div className="wrap relative">
        <p data-reveal className="label text-fresh">
          Willkommen bei SPIRULI
        </p>
        <h2 data-reveal className="headline mt-6 max-w-5xl text-[13vw] sm:text-[8.5vw]">
          Der <span className="text-fresh">Balancer.</span>
        </h2>
        <p data-reveal className="mt-8 max-w-xl text-lg leading-relaxed text-mist/70">
          Für den Schreibtisch, unterwegs oder nach dem Training: ein Erfrischungsgetränk mit Mikroalge, das nicht nach Alge schmeckt – sondern nach Holunder und
          Zitrone.
        </p>
        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-mist/10 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div key={s.u} data-reveal className="bg-algae-deep p-8" style={{ ["--d" as string]: `${i * 0.1}s` }}>
              <p className="font-display text-7xl font-extrabold tracking-tight text-fresh">{s.n}</p>
              <p className="mt-1 font-medium">{s.u}</p>
              <p className="mt-4 text-mist/60">{s.t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
