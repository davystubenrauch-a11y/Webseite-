import Icon, { type IconName } from "@/components/ui/Icon";

const items: { icon: IconName; title: string; text: string }[] = [
  { icon: "leaf", title: "100 % vegan", text: "Rein pflanzlich, auf Basis fermentierter Mikroalgen." },
  { icon: "bolt", title: "Natürliche B-Vitamine", text: "B2, B6, B12, Niacin, Folsäure und Vitamin C." },
  { icon: "dna", title: "18+ Aminosäuren", text: "Inklusive BCAA, Tryptophan, Glutaminsäure und GABA." },
  { icon: "shield", title: "Geprüfte Qualität", text: "Analysiert und zertifiziert durch SGS Fresenius." },
];

export default function Benefits() {
  return (
    <section aria-label="Auf einen Blick" className="border-y border-sand-300/70 bg-white">
      <ul data-reveal-stagger className="container-page grid gap-px py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-12">
        {items.map((it) => (
          <li key={it.title} className="flex gap-4 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf-50 text-leaf-dark">
              <Icon name={it.icon} />
            </span>
            <div>
              <h3 className="font-bold text-petrol-900">{it.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{it.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
