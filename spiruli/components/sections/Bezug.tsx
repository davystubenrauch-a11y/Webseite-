import SplitHeading from "@/components/ui/SplitHeading";
import CopyPzn from "@/components/ui/CopyPzn";
import Magnetic from "@/components/ui/Magnetic";
import LazyCanCanvas from "@/components/three/LazyCanCanvas";
import { site } from "@/lib/site";
import { Arrow } from "./Hero";

const steps = [
  { no: "01", title: "PZN nennen", text: `In der Apotheke Ihres Vertrauens einfach die PZN ${site.pzn} angeben.` },
  { no: "02", title: "Bestellen", text: "Die Apotheke bestellt SPIRULI über die PZN beim pharmazeutischen Großhandel." },
  { no: "03", title: "Genießen", text: "Gut gekühlt am besten – fermentiert, vegan und voller natürlicher Vitalstoffe." },
];

export default function Bezug() {
  return (
    <section id="bezug" className="marble-dark relative overflow-hidden py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald/15 blur-[160px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span data-reveal className="eyebrow">
            Bezug
          </span>
          <SplitHeading
            words={["Health", "&", { text: "Vitality", className: "text-gold" }, { text: "in jeder Dose.", className: "font-serif font-medium normal-case italic text-emerald-grad" }]}
            className="mt-6 font-display text-[2.6rem] font-semibold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl"
          />
          <p data-reveal className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
            SPIRULI ist in Apotheken erhältlich. Für Handel, Praxen und Studios beraten wir Sie gerne persönlich.
          </p>

          <ol data-reveal-stagger className="mt-12 grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <li key={s.no} className="glass rim p-6">
                <span className="font-display text-xs font-semibold tracking-[0.3em] text-gold">{s.no}</span>
                <h3 className="mt-6 font-display text-lg font-semibold uppercase tracking-[0.12em] text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.text}</p>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a href={`mailto:${site.email}?subject=${encodeURIComponent("Anfrage SPIRULI")}`} className="btn-gold">
                Händleranfrage
                <Arrow />
              </a>
            </Magnetic>
            <CopyPzn />
          </div>
        </div>

        <div className="relative h-[520px] lg:h-[680px]">
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/15" />
          <LazyCanCanvas className="absolute -inset-x-10 inset-y-0" particles={300} cameraZ={7.9} />
        </div>
      </div>
    </section>
  );
}
