import Reveal from "@/components/ui/Reveal";
import { LazyNfcStage } from "@/components/three/Lazy";

const LOOK = { theme: "white", lang: "en", business: "" } as const;

const facts = [
  { value: "300 €", label: "Websites ab" },
  { value: "300 €", label: "Roomtours ab" },
  { value: "24 h", label: "Antwortzeit" },
];

/** First block of the right column: the 3D disc on a large tinted stage plus key facts. */
export default function Overview() {
  return (
    <section id="start" className="px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28 lg:pt-10 xl:px-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sage-light via-sand to-taupe-light">
          <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/50 blur-3xl" />
          <div className="relative aspect-[4/3] min-h-[340px] sm:aspect-[16/10]">
            <LazyNfcStage className="absolute inset-0" look={LOOK} cameraZ={7.6} spin={0.2} />
          </div>
          <div className="absolute left-5 top-5 rounded-full bg-paper/80 px-4 py-2 text-xs font-semibold text-ink backdrop-blur sm:left-8 sm:top-8">
            NFC Review Disc · Weiß &amp; Schwarz
          </div>
          <p className="absolute bottom-5 right-5 text-xs text-ink-muted sm:bottom-8 sm:right-8">zum Drehen ziehen</p>
        </div>
      </Reveal>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
        {facts.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.06} className="rounded-2xl border border-line bg-white/70 px-4 py-5 sm:px-6">
            <p className="text-xs text-ink-muted">{f.label}</p>
            <p className="mt-1 font-heading text-xl font-extrabold text-ink sm:text-2xl">{f.value}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
