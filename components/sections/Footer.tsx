import { LogoStacked } from "@/components/brand/Logo";
import Icon from "@/components/ui/Icon";
import { site, telHref } from "@/lib/site";

/** Compact dark footer: contact, legal links and social profiles. */
export default function Footer() {
  return (
    <footer className="bg-ink px-5 py-14 text-paper sm:px-8 lg:px-12 xl:px-16">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="w-24">
          <LogoStacked tone="paper" />
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
          {site.founders.map((f) => (
            <a key={f.name} href={telHref(f.phone)} className="flex items-center gap-2 text-paper/70 transition hover:text-paper">
              <Icon name="phone" className="h-4 w-4 text-taupe" /> {f.phone}
            </a>
          ))}
          <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-paper/70 transition hover:text-paper">
            <Icon name="mail" className="h-4 w-4 text-taupe" /> {site.email}
          </a>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-4 border-t border-paper/10 pt-6 text-xs text-paper/45 sm:flex-row sm:justify-between">
        <span>
          © {new Date().getFullYear()} {site.name} · {site.city}
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
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
    </footer>
  );
}
