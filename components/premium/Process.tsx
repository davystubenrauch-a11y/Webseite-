import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { process } from "@/lib/content";

/** Four calm steps with large serif numerals. */
export default function Process() {
  return (
    <section id="prozess" className="section">
      <div className="container-site">
        <div className="grid-12">
          <SectionHead className="col-span-4 sm:col-span-8 lg:col-span-6" eyebrow="Ablauf" title="Vom ersten Gespräch zur fertigen Lösung." />
        </div>
        <div className="grid-12 mt-20 gap-y-12 lg:mt-24">
          {process.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="col-span-4 sm:col-span-4 lg:col-span-3">
              <span className="font-heading text-6xl font-normal leading-none text-taupe/70">{String(i + 1).padStart(2, "0")}</span>
              <div className="mt-8 border-t border-ink/15 pt-6">
                <h3 className="font-heading text-2xl font-medium text-ink">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.75] text-ink-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
