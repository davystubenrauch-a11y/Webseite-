const features = [
  {
    no: "01",
    title: "Spirulina",
    latin: "Spirulina platensis",
    text: "Die Mikroalge ist der Kern von SPIRULI. Sie bringt natürliche B-Vitamine und Aminosäuren mit – schmecken tut man sie kaum. Dazu kommt die Rotalge Lithothamnium: das LI im Namen.",
    tags: ["B-Vitamine", "Aminosäuren", "Zwei Algen"],
    img: "/photos/spirulina.webp",
    alt: "Spirulina-Pulver und Presslinge mit Minze auf Schiefer",
    cls: "bg-algae text-mist",
    accent: "text-fresh",
    tag: "border-mist/25",
  },
  {
    no: "02",
    title: "Holunder",
    latin: "Sambucus nigra",
    text: "Gibt den beerigen, samtigen Grundton. Die Beeren sind laut Hersteller pestizidfrei und stammen aus Mitteleuropa.",
    tags: ["Beerig", "Samtig", "Aus Mitteleuropa"],
    img: "/photos/holunder.webp",
    alt: "Dunkle Beeren und Fruchtstücke vor dunklem Hintergrund",
    cls: "bg-berry text-mist",
    accent: "text-[#e7b8dc]",
    tag: "border-mist/25",
  },
  {
    no: "03",
    title: "Zitrone",
    latin: "Citrus limon",
    text: "Frische Säure für einen klaren, spritzigen Abgang – zusammen mit einem Schuss Kohlensäure.",
    tags: ["Frisch", "Spritzig", "Vitamin C"],
    img: "/photos/zitrone.webp",
    alt: "Zitronenscheiben mit Blättern auf dunklem Stein",
    cls: "bg-citrus text-ink",
    accent: "text-[#a88a0c]",
    tag: "border-ink/20",
  },
  {
    no: "04",
    title: "Orange",
    latin: "Citrus sinensis",
    text: "Rundet ab und nimmt der Zitrone die Spitze. Gesüßt wird nur mit Agavensirup – rund 22 kcal pro 100 ml, vegan und glutenfrei.",
    tags: ["Fruchtig", "Agavensirup", "22 kcal / 100 ml"],
    img: "/photos/orange.webp",
    alt: "Orangenspalten mit Blättern auf dunklem Stein",
    cls: "bg-[#f6dcc2] text-ink",
    accent: "text-[#c8611b]",
    tag: "border-ink/20",
  },
];

/**
 * The ingredients as full-height cards that stack: each one sticks to the top
 * and the next slides over it (pure CSS, so it stays smooth). On phones they simply follow each other.
 */
export default function Features() {
  return (
    <section id="zutaten" className="relative">
      {features.map((f, i) => (
        <article key={f.no} className={`relative flex items-center overflow-hidden py-20 lg:sticky lg:top-0 lg:min-h-[100svh] lg:py-24 ${f.cls}`} style={{ zIndex: i + 1 }}>
          <div className={`wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div data-reveal className="overflow-hidden rounded-[2rem]">
              <img data-zoom src={f.img} alt={f.alt} loading="lazy" className="aspect-[3/4] max-h-[76svh] w-full object-cover" />
            </div>
            <div>
              <p data-reveal className={`font-display text-8xl font-extrabold sm:text-9xl ${f.accent}`}>{f.no}</p>
              <p data-reveal className="mt-6 text-sm italic opacity-70">
                {f.latin}
              </p>
              <h2 data-reveal className="headline mt-3 text-6xl sm:text-8xl">
                {f.title}
              </h2>
              <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed opacity-80">
                {f.text}
              </p>
              <ul data-reveal className="mt-8 flex flex-wrap gap-2">
                {f.tags.map((t) => (
                  <li key={t} className={`rounded-full border px-4 py-2 text-sm font-medium ${f.tag}`}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
