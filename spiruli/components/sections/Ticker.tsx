const items = ["Vegan", "Fermentiert", "Natürliche B-Vitamine", "18+ Aminosäuren", "Holunder · Zitrus · Algen", "SGS Fresenius geprüft", "PZN 11110571"];

export default function Ticker() {
  return (
    <div className="relative z-10 -my-1 -rotate-1 border-y-2 border-ink bg-ink py-4 text-lime">
      <div className="flex w-max animate-marquee gap-10 motion-reduce:animate-none">
        {[...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
            {it}
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-lime" aria-hidden>
              <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
