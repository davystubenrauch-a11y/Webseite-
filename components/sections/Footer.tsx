import { LogoStacked } from "@/components/brand/Logo";
import Icon from "@/components/ui/Icon";
import { nav, site, telHref } from "@/lib/site";
import { services } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-navy-950/80">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <div className="w-40">
            <LogoStacked />
          </div>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">{site.claim} NFC-Bewertungssysteme, High-End-Websites und KI-Roomtours für Unternehmen, die überzeugen wollen.</p>
          <div className="mt-6 flex gap-3">
            {site.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 transition hover:border-gold/50 hover:text-gold-soft"
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
                <Icon name="phone" className="h-4 w-4 text-gold" /> {f.phone}
              </a>
              <span className="block pl-6 text-xs text-white/35">{f.name}</span>
            </li>
          ))}
          <li>
            <a href={`mailto:${site.email}`} className="footer-link inline-flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4 text-gold" /> {site.email}
            </a>
          </li>
          <li className="inline-flex items-center gap-2 text-sm text-white/55">
            <Icon name="pin" className="h-4 w-4 text-gold" /> {site.city}
          </li>
        </FooterCol>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-white/40 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {site.name}. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <a href="/impressum" className="transition hover:text-gold-soft">Impressum</a>
            <a href="/datenschutz" className="transition hover:text-gold-soft">Datenschutz</a>
            <a href="#top" className="transition hover:text-gold-soft">Nach oben ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">{title}</p>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}
