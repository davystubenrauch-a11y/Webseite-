import Pattern from "@/components/ui/Pattern";

const ingredients = [
  { name: "Holunder", text: "Dunkle, samtige Beerennoten als Fundament.", color: "#9B2F7A" },
  { name: "Zitrus", text: "Frische, die für einen klaren Abgang sorgt.", color: "#F5B423" },
  { name: "Spirulina", text: "Die Mikroalge: natürliche B-Vitamine und Aminosäuren.", color: "#1E6B3B" },
  { name: "Fermentation", text: "Schonend gebraut wie in traditioneller Braukunst.", color: "#10331F" },
];

/** Cream ingredient list on the left, elderberry field with the can on the right. */
export default function Zutaten() {
  return (
    <section id="zutaten" data-can='{"x":0.5,"y":0,"s":0.92,"ry":6.4,"rx":0.15,"rz":-0.15}' className="relative grid min-h-[100svh] md:grid-cols-2">
      <div className="relative flex flex-col justify-between bg-cream px-5 py-24 text-ink sm:px-8 lg:px-12">
        <div>
          <p className="micro text-ink/60">Die Zutaten</p>
          <ul data-reveal-stagger className="mt-8 space-y-6">
            {ingredients.map((i) => (
              <li key={i.name} className="flex items-start gap-4">
                <span className="mt-1 h-7 w-7 shrink-0 rounded-full ring-2 ring-ink/80" style={{ background: i.color }} />
                <div>
                  <p className="mega text-2xl lg:text-3xl">{i.name}</p>
                  <p className="micro mt-1 max-w-xs text-ink/70">{i.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <h2 data-reveal className="mega mt-16 text-[11vw] text-algae md:text-[4.6vw]">
          Vegan.
          <br />
          Fermentiert.
          <br />
          Ehrlich.
        </h2>
      </div>
      <div className="relative min-h-[70svh] overflow-hidden bg-berry">
        <Pattern color="#AE3A8A" />
        <p className="micro absolute bottom-8 right-6 max-w-[12rem] text-right text-cream sm:right-8 lg:right-12">
          Holunder · Zitrus · Algen – die fermentierte Basis von SPIRULI.
        </p>
      </div>
    </section>
  );
}
