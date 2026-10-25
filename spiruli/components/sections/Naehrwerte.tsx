import { ingredients, nutrition } from "@/lib/site";

const facts = [
  { n: "43", u: "kcal pro Dose" },
  { n: "7,2 g", u: "Zucker pro Dose" },
  { n: "< 0,02 g", u: "Fett pro Dose" },
  { n: "100 %", u: "vegan & glutenfrei" },
];

/** The plain facts: four key numbers, the nutrition table and the ingredient list. */
export default function Naehrwerte() {
  return (
    <section id="naehrwerte" className="relative z-10 bg-paper py-24 sm:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-2 [&>*]:min-w-0">
        <div>
          <p data-reveal className="label text-teal">
            Nährwerte & Zutaten
          </p>
          <h2 data-reveal className="headline mt-4 text-5xl sm:text-7xl">
            Leicht, <span className="text-teal">nicht leer.</span>
          </h2>
          <dl data-reveal className="mt-10 grid grid-cols-2 gap-3">
            {facts.map((f) => (
              <div key={f.u} className="rounded-2xl bg-mist p-5">
                <dt className="whitespace-nowrap font-display text-3xl font-extrabold sm:text-4xl">{f.n}</dt>
                <dd className="mt-1 text-sm text-ink/65">{f.u}</dd>
              </div>
            ))}
          </dl>
          <p data-reveal className="mt-8 font-semibold">Zutaten</p>
          <p data-reveal className="mt-2 leading-relaxed text-ink/70">
            {ingredients.map((i) => i.name).join(", ")}.
          </p>
        </div>

        <div data-reveal className="self-start rounded-3xl border border-line bg-white p-6 sm:p-8">
          <div className="flex items-end justify-between border-b-2 border-ink pb-3">
            <p className="font-display text-2xl font-extrabold">Nährwerte</p>
            <p className="text-xs text-ink/55">je 100 ml · je Dose (200 ml)</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {nutrition.map((n) => (
                <tr key={n.name} className="border-b border-line last:border-0">
                  <td className={`py-3 ${n.sub ? "pl-4 text-ink/55" : ""}`}>{n.name}</td>
                  <td className="whitespace-nowrap py-3 pl-3 text-right tabular-nums">{n.per100}</td>
                  <td className="whitespace-nowrap py-3 pl-4 text-right tabular-nums text-ink/60">{n.perCan}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-ink/45">Laut veröffentlichter Produktinformation. Maßgeblich ist die Angabe auf der Dose.</p>
        </div>
      </div>
    </section>
  );
}
