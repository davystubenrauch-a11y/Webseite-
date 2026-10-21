import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { principles, testimonials } from "@/lib/content";
import { site, telHref } from "@/lib/site";
import Panel from "./Panel";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("");

/** Founders, principles and customer quotes. */
export default function TeamPanel() {
  return (
    <Panel
      id="team"
      title="Zwei Gründer. Kein Callcenter."
      lead="F&D Solutions sind Florian Dressler und Davy Stubenrauch aus München. Sie sprechen direkt mit den Menschen, die Ihr Projekt umsetzen."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {site.founders.map((f, i) => (
          <Reveal key={f.name} delay={i * 0.06} className="card card-hover bg-white/80 p-7">
            <div className="flex items-center gap-4">
              <span className={`grid h-14 w-14 place-items-center rounded-2xl text-lg font-extrabold ${i ? "bg-taupe-light text-ink" : "bg-sage text-paper"}`}>{initials(f.name)}</span>
              <div>
                <p className="font-heading text-lg font-extrabold text-ink">{f.name}</p>
                <p className="text-sm text-ink-muted">
                  {f.role} · {site.city}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={telHref(f.phone)} className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink ring-1 ring-inset ring-line transition hover:ring-ink/30">
                <Icon name="phone" className="h-4 w-4 text-sage" /> {f.phone}
              </a>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink ring-1 ring-inset ring-line transition hover:ring-ink/30">
                <Icon name="mail" className="h-4 w-4 text-sage" /> E-Mail
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {principles.map((p) => (
          <div key={p.title} className="rounded-2xl border border-line p-6">
            <p className="font-heading font-extrabold text-ink">{p.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 space-y-4">
        {testimonials.map((t, i) => (
          <Reveal key={t.role} delay={i * 0.06}>
            <figure className={`rounded-[1.75rem] p-7 sm:p-9 ${i === 0 ? "bg-ink text-paper" : "border border-line bg-white/70"}`}>
              <p className={`text-sm tracking-[0.2em] ${i === 0 ? "text-taupe" : "text-sage"}`}>★★★★★</p>
              <blockquote className={`mt-4 font-heading font-bold leading-snug ${i === 0 ? "text-2xl sm:text-[1.7rem]" : "text-lg text-ink"}`}>„{t.quote}“</blockquote>
              <figcaption className={`mt-5 text-sm ${i === 0 ? "text-paper/60" : "text-ink-muted"}`}>
                {t.name} · {t.role}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Panel>
  );
}
