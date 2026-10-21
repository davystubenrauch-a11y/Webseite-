import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { site, telHref } from "@/lib/site";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("");

/** The two founders as calm contact cards. */
export default function Team() {
  return (
    <section id="team" className="section border-t border-line bg-white/40">
      <div className="container-site">
        <div className="grid-12 gap-y-16">
          <SectionHead
            className="col-span-4 sm:col-span-8 lg:col-span-5"
            eyebrow="Über uns"
            title={
              <>
                Zwei Gründer. <em className="italic text-sage">Ein Ansprechpartner.</em>
              </>
            }
            lead="F&D Solutions sind Florian Dressler und Davy Stubenrauch aus München. Bei uns gibt es keine Hotline: Sie sprechen direkt mit den Menschen, die Ihr Projekt umsetzen."
          />
          <div className="col-span-4 grid gap-5 sm:col-span-8 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {site.founders.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.1} className="card card-hover flex flex-col bg-white/80 p-8">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-taupe/40 bg-taupe-light font-heading text-xl italic text-ink">
                  {initials(f.name)}
                </span>
                <p className="mt-8 font-heading text-2xl text-ink">{f.name}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {f.role} · {site.city}
                </p>
                <div className="mt-8 space-y-2 border-t border-line pt-6 text-sm">
                  <a href={telHref(f.phone)} className="flex items-center gap-3 text-ink-soft transition hover:text-sage">
                    <Icon name="phone" className="h-4 w-4 text-ink-faint" /> {f.phone}
                  </a>
                  <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-ink-soft transition hover:text-sage">
                    <Icon name="mail" className="h-4 w-4 text-ink-faint" /> {site.email}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
