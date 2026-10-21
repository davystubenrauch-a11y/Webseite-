import Reveal from "@/components/ui/Reveal";
import { testimonials } from "@/lib/content";

/** One featured quote, two supporting ones. */
export default function Testimonials() {
  const [first, ...rest] = testimonials;
  return (
    <section className="section">
      <div className="container-site">
        <div className="grid-12 gap-y-16">
          <Reveal className="col-span-4 sm:col-span-8 lg:col-span-3">
            <span className="eyebrow">Stimmen</span>
          </Reveal>
          <Reveal delay={0.1} className="col-span-4 sm:col-span-8 lg:col-span-9">
            <figure>
              <span aria-hidden className="block font-heading text-7xl leading-none text-taupe/60">&ldquo;</span>
              <blockquote className="-mt-4 font-heading text-[1.75rem] font-normal italic leading-[1.4] text-ink sm:text-[2.4rem] sm:leading-[1.3]">
                {first.quote}
              </blockquote>
              <figcaption className="mt-8 text-sm text-ink-muted">
                <span className="text-ink">{first.name}</span> · {first.role}
              </figcaption>
            </figure>
          </Reveal>
        </div>
        <div className="grid-12 mt-20 gap-y-8">
          {rest.map((t, i) => (
            <Reveal key={t.role} delay={i * 0.08} className={`col-span-4 sm:col-span-4 lg:col-span-4 ${i === 0 ? "lg:col-start-4" : ""}`}>
              <figure className="border-t border-ink/15 pt-6">
                <blockquote className="text-[15px] leading-[1.75] text-ink-soft">„{t.quote}“</blockquote>
                <figcaption className="mt-4 text-xs text-ink-muted">
                  <span className="text-ink">{t.name}</span> · {t.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
