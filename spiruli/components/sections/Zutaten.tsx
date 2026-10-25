import { ingredients } from "@/lib/site";

const stars = [
  { img: "/props/berries-a.webp", tint: "bg-berry", name: "Holunder", text: "Beerig und samtig – der Grundgeschmack. Laut Hersteller pestizidfrei aus Mitteleuropa." },
  { img: "/props/lemon-a.webp", tint: "bg-citrus", name: "Zitrone & Orange", text: "Frische Säure für einen klaren, spritzigen Abgang." },
  { img: "", tint: "bg-sage", name: "Spirulina", text: "Die Mikroalge liefert natürliche B-Vitamine und Aminosäuren." },
];

/** Light panel: three star ingredients on their own tinted cards, then the full list. */
export default function Zutaten() {
  return (
    <section id="zutaten" className="bg-paper py-28 text-ink sm:py-36">
      <div className="wrap">
        <p data-reveal className="eyebrow text-teal">
          Zutaten
        </p>
        <h2 data-reveal className="display mt-6 max-w-4xl text-6xl sm:text-8xl">
          Neun Zutaten. <em className="text-teal">Nichts zu verstecken.</em>
        </h2>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {stars.map((s, i) => (
            <div key={s.name} data-reveal className={`rounded-3xl p-8 pb-10 ${s.tint}`} style={{ ["--d" as string]: `${i * 0.12}s` }}>
              <div className="grid h-56 place-items-center">
                {s.img ? (
                  <img src={s.img} alt="" loading="lazy" className="max-h-full w-auto max-w-[70%] object-contain drop-shadow-[0_25px_25px_rgba(19,43,46,0.25)]" />
                ) : (
                  // Spirulina has no prop render: a deep algae-green disc with its Latin name.
                  <span className="grid h-40 w-40 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#4f8a3a,#1d4a2a_70%)] text-center font-serif text-lg italic text-cream shadow-[0_25px_40px_-15px_rgba(19,43,46,0.5)]">
                    Spirulina
                    <br />
                    platensis
                  </span>
                )}
              </div>
              <h3 className="display mt-6 text-4xl">{s.name}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-ink/70">{s.text}</p>
            </div>
          ))}
        </div>

        <ol data-reveal className="mt-24 grid border-t border-cream-line sm:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((ing, i) => (
            <li key={ing.name} className="flex items-baseline gap-4 border-b border-cream-line py-4 sm:pr-6">
              <span className="w-6 text-sm tabular-nums text-ink/40">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-medium">{ing.name}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-ink/60">Vegan · glutenfrei · mit Kohlensäure · gesüßt mit Agavensirup</p>
      </div>
    </section>
  );
}
