import Reveal from "@/components/ui/Reveal";
import { principles } from "@/lib/content";

/** Short manifesto: one large serif statement and three principles. */
export default function Statement() {
  return (
    <section className="section">
      <div className="container-site">
        <div className="grid-12 gap-y-10">
          <Reveal className="col-span-4 sm:col-span-8 lg:col-span-3">
            <span className="eyebrow">Haltung</span>
          </Reveal>
          <Reveal delay={0.1} className="col-span-4 sm:col-span-8 lg:col-span-9">
            <p className="font-heading text-[1.75rem] font-normal leading-[1.4] text-ink sm:text-4xl sm:leading-[1.35]">
              Gute Gestaltung ist leise. Sie lässt Ihr Unternehmen so wirken, wie es ist:{" "}
              <em className="italic text-sage">sorgfältig, verlässlich und nahbar.</em> Genau dafür arbeiten wir, mit Technik, die man
              nicht sieht, und Menschen, die man erreicht.
            </p>
          </Reveal>
        </div>

        <div className="grid-12 mt-20 gap-y-10 lg:mt-28">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className={`col-span-4 sm:col-span-8 lg:col-span-3 ${i === 0 ? "lg:col-start-4" : ""}`}>
              <div className="border-t border-ink/15 pt-6">
                <span className="font-heading text-sm italic text-taupe">0{i + 1}</span>
                <h3 className="mt-3 font-heading text-2xl font-medium text-ink">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.75] text-ink-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
