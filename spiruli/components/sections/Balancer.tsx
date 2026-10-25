import CountUp from "@/components/ui/CountUp";
import Split from "@/components/ui/Split";

const stats = [
  { n: 22, u: "kcal / 100 ml" },
  { n: 9, u: "Zutaten" },
  { n: 2, u: "Algen" },
  { n: 0, u: "Pulver" },
];

/** Dark brand moment: the line and numbers next to the full product photo. */
export default function Balancer() {
  return (
    <section className="relative z-10 overflow-hidden bg-algae-deep py-24 text-mist sm:py-32">
      <svg aria-hidden viewBox="0 0 600 600" className="absolute -left-60 -top-60 w-[760px] text-fresh/[0.07]">
        {[290, 240, 190, 140, 90].map((r) => (
          <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <div>
          <p data-reveal className="label text-fresh">
            Willkommen bei SPIRULI
          </p>
          <Split className="headline mt-6 text-[17vw] sm:text-[10vw] lg:text-[7.5vw]" lines={["Der", <span key="b" className="text-fresh">Balancer.</span>]} />
          <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-mist/75">
            Für den Schreibtisch, unterwegs oder nach dem Training – eine Erfrischung mit Mikroalge, die nach Holunder und Zitrone schmeckt. Entwickelt und
            abgefüllt in Deutschland.
          </p>
          <dl data-reveal className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-mist/15 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.u} className="bg-algae-deep p-5">
                <dt className="font-display text-5xl font-extrabold text-fresh">
                  <CountUp to={s.n} />
                </dt>
                <dd className="mt-1 text-sm text-mist/70">{s.u}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure data-reveal className="relative overflow-hidden rounded-[2rem] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)]">
          <img data-zoom src="/photos/stimmung.webp" alt="SPIRULI Dose auf Schiefer mit Holunder, Zitrone und Spirulina" loading="lazy" className="aspect-[3/4] w-full object-cover" />
          <figcaption className="label absolute bottom-5 left-5 rounded-full bg-black/35 px-3 py-1.5 text-white backdrop-blur-sm">SPIRULI · 200 ml</figcaption>
        </figure>
      </div>
    </section>
  );
}
