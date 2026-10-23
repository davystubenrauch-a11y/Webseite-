const facts = ["Vegan", "Fermentiert", "Natürliche B-Vitamine", "18+ Aminosäuren", "Holunder · Zitrus · Algen", "SGS Fresenius geprüft", "PZN 11110571"];

/** Tilted fact band between the hero and the first statement. */
export default function Ticker() {
  return (
    <div aria-label="Fakten" className="relative z-20 -my-6 -rotate-2 overflow-hidden border-y-2 border-ink bg-lime py-3 text-ink">
      <div className="flex w-max animate-[marquee_32s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((k) => (
          <ul key={k} aria-hidden={k === 1} className="flex shrink-0">
            {facts.map((f) => (
              <li key={f} className="mega flex items-center whitespace-nowrap px-6 text-2xl sm:text-3xl">
                {f}
                <span className="ml-12 text-algae">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
