import CanPose from "@/components/stage/CanPose";
import Floaters from "@/components/ui/Floaters";
import { ingredients } from "@/lib/site";

const facts = ["Vegan", "Glutenfrei", "Mit Kohlensäure", "Gesüßt mit Agavensirup"];

/** The real ingredient list in label order, next to the can render. */
export default function Zutaten() {
  return (
    <section id="zutaten" className="relative overflow-hidden bg-cream-warm py-24 sm:py-32">
      <CanPose at="0%" pose={{ x: -0.45, y: 0, s: 1, ry: 9.4, rz: -0.08 }} />
      <CanPose at="55%" pose={{ x: -0.45, y: 0, s: 1, ry: 10.6, rz: 0.06, o: 1 }} />
      <CanPose at="85%" pose={{ x: -0.5, y: 0.2, s: 0.9, ry: 11.2, rz: -0.2, o: 0 }} />
      <Floaters
        className="hidden lg:block"
        items={[
          { src: "lemon-a", x: 10, y: 24, size: 10, depth: 0.3, spin: 40, rotate: 15 },
          { src: "berries-b", x: 40, y: 70, size: 12, depth: -0.2, spin: -20 },
          { src: "leaf-b", x: 38, y: 18, size: 9, depth: 0.15, spin: 25 },
          { src: "lemon-b", x: 6, y: 80, size: 8, depth: 0.45, spin: -30, blur: true },
        ]}
      />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        {/* The flying can sits here. */}
        <div className="hidden min-h-[70vh] lg:block" />

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
