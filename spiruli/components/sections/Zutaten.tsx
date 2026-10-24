import { ingredients } from "@/lib/site";

const facts = ["Vegan", "Glutenfrei", "Mit Kohlensäure", "Gesüßt mit Agavensirup"];

/** The real ingredient list in label order, next to the can render. */
export default function Zutaten() {
  return (
    <section id="zutaten" className="bg-cream-warm py-24 sm:py-32">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div data-reveal className="relative overflow-hidden rounded-2xl bg-petrol-deep">
          <img
            src="/renders/spiruli-4k-1920.jpg"
            alt="SPIRULI Dose, 200 ml"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover object-center"
          />
        </div>

        <div>
          <p data-reveal className="label text-petrol">
            Zutaten
          </p>
          <h2 data-reveal className="headline mt-4 text-5xl text-petrol-deep sm:text-6xl">
            Neun Zutaten. <br />
            Nichts zu verstecken.
          </h2>
          <ol data-reveal-stagger className="mt-10 border-t border-cream-line">
            {ingredients.map((ing, i) => (
              <li key={ing.name} className="flex items-baseline gap-5 border-b border-cream-line py-3.5">
                <span className="w-6 text-sm font-semibold tabular-nums text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-lg font-semibold">{ing.name}</span>
                {ing.note && <span className="text-right text-sm text-ink/55">{ing.note}</span>}
              </li>
            ))}
          </ol>
          <ul className="mt-8 flex flex-wrap gap-2">
            {facts.map((f) => (
              <li key={f} className="rounded-md border border-petrol/30 px-3 py-1.5 text-sm font-semibold text-petrol">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
