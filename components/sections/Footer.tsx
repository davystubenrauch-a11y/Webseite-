import { LogoStacked } from "@/components/brand/Logo";
import Icon from "@/components/ui/Icon";
import { nav, site, telHref } from "@/lib/site";
import { services } from "@/lib/content";

/** Dark closing band: a quiet invitation, contact details and the legal links. */
export default function Footer({ base = "/" }: { base?: string }) {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-site pb-10 pt-24 sm:pt-32">
        <div className="grid-12 gap-y-16">
          <div className="col-span-4 sm:col-span-8 lg:col-span-6">
            <p className="font-heading text-4xl font-medium leading-[1.15] sm:text-5xl">
              Lassen Sie uns über <em className="italic text-taupe">Ihr Projekt</em> sprechen.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href={`${base}#anfrage`} className="inline-flex items-center justify-center gap-2.5 rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink transition hover:bg-white">
                Anfrage starten <Icon name="arrow" className="h-4 w-4" />
              </a>
              <a href={`mailto:${site.email}`} className="inline-flex items-center justify-center rounded-full border border-paper/20 px-7 py-3.5 text-sm font-medium text-paper transition hover:border-paper/50">
                {site.email}
              </a>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-3 lg:col-span-2 lg:col-start-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-paper/45">Seite</p>
            <ul className="mt-6 space-y-3">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`${base}#${n.id}`} className="text-sm text-paper/70 transition hover:text-paper">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-5 lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-paper/45">Kontakt</p>
            <ul className="mt-6 space-y-4 text-sm">
              {site.founders.map((f) => (
                <li key={f.name}>
                  <a href={telHref(f.phone)} className="text-paper/70 transition hover:text-paper">
                    {f.phone}
                  </a>
                  <span className="block text-xs text-paper/40">{f.name}</span>
                </li>
              ))}
              <li className="text-paper/70">{site.city}</li>
            </ul>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-8 border-t border-paper/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-28">
            <LogoStacked tone="paper" />
          </div>
          <div className="flex flex-col gap-4 text-xs text-paper/45 sm:items-end">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {services.map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span>© {new Date().getFullYear()} {site.name}</span>
              <a href="/impressum" className="transition hover:text-paper">
                Impressum
              </a>
              <a href="/datenschutz" className="transition hover:text-paper">
                Datenschutz
              </a>
              {site.social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="transition hover:text-paper">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
