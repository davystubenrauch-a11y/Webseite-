import { LogoStacked } from "@/components/brand/Logo";
import Icon from "@/components/ui/Icon";
import { nav, site, telHref } from "@/lib/site";
import { services } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-slate-50">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <div className="w-40">
            <LogoStacked />
          </div>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-slate-500">NFC-Bewertungsplatten, Websites und Roomtours für Unternehmen. Persönlich betreut aus München.</p>
          <div className="mt-6 flex gap-3">
            {site.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand/50 hover:text-brand"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Navigation">
          {nav.map((n) => (
            <li key={n.id}>
              <a href={`/#${n.id}`} className="footer-link">{n.label}</a>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Leistungen">
          {services.map((s) => (
            <li key={s.id}>
              <a href="/#leistungen" className="footer-link">{s.title}</a>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Kontakt">
          {site.founders.map((f) => (
            <li key={f.name}>
              <a href={telHref(f.phone)} className="footer-link inline-flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 text-brand" /> {f.phone}
              </a>
              <span className="block pl-6 text-xs text-slate-400">{f.name}</span>
            </li>
          ))}
          <li>
            <a href={`mailto:${site.email}`} className="footer-link inline-flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4 text-brand" /> {site.email}
            </a>
          </li>
          <li className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Icon name="pin" className="h-4 w-4 text-brand" /> {site.city}
          </li>
        </FooterCol>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {site.name}. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <a href="/impressum" className="transition hover:text-brand">Impressum</a>
            <a href="/datenschutz" className="transition hover:text-brand">Datenschutz</a>
            <a href="#top" className="transition hover:text-brand">Nach oben ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">{title}</p>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}
