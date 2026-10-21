import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { testimonials } from "@/lib/content";
import { site, telHref } from "@/lib/site";

const avatarColors = ["from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600"];

/** Founders as contact cards, followed by short customer quotes. */
export default function Team() {
  return (
    <section id="team" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          eyebrow="Team"
          title="Zwei Gründer aus München."
          lead="Bei uns gibt es keine Hotline. Sie sprechen direkt mit den Menschen, die Ihr Projekt umsetzen."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {site.founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1} className="card card-hover flex flex-col gap-6 p-7 sm:flex-row sm:items-center">
              <span className={`grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br text-2xl font-extrabold text-white ${avatarColors[i]}`}>
                {f.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </span>
              <div className="flex-1">
                <p className="font-heading text-xl font-bold text-slate-900">{f.name}</p>
                <p className="text-sm text-slate-500">
                  {f.role} · {site.city}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={telHref(f.phone)} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-brand hover:text-white">
                    <Icon name="phone" className="h-4 w-4" /> {f.phone}
                  </a>
                  <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-brand hover:text-white">
                    <Icon name="mail" className="h-4 w-4" /> E-Mail
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.role} delay={i * 0.08} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-amber-400" aria-label="5 von 5 Sternen">
                ★★★★★
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">„{t.quote}“</p>
              <p className="mt-4 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{t.name}</span> · {t.role}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
