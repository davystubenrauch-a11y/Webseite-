"use client";

import { LogoInline } from "@/components/brand/Logo";
import Icon from "@/components/ui/Icon";
import { site, telHref } from "@/lib/site";
import { sections } from "./sections";
import { useActiveSection } from "./useActiveSection";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("");

/**
 * Left column of the split layout. On desktop it stays fixed while the content scrolls:
 * brand, message, actions, a live section index and the founders. On mobile it is the intro.
 */
export default function Sidebar() {
  const active = useActiveSection();

  return (
    <aside className="flex flex-col justify-between gap-10 px-5 pb-14 pt-28 sm:px-8 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:gap-6 lg:px-12 lg:py-8 xl:px-14">
      <div className="hidden lg:block">
        <LogoInline />
      </div>

      <div>
        <span className="eyebrow">Digitalagentur aus München</span>
        <h1 className="mt-6 font-heading text-[2.6rem] font-extrabold leading-[1.04] tracking-tight text-ink sm:text-5xl xl:text-[3.6rem]">
          Mehr Vertrauen.
          <br />
          <span className="text-sage">Mehr Kunden.</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
          NFC-Platten für Google-Bewertungen, Websites und 360°-Roomtours. Persönlich betreut, fair bepreist.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#anfrage" className="btn-primary">
            Projekt anfragen <Icon name="arrow" className="h-4 w-4" />
          </a>
          <a href={telHref(site.founders[1].phone)} className="btn-secondary">
            <Icon name="phone" className="h-4 w-4" /> Anrufen
          </a>
        </div>

        {/* Live section index (desktop) */}
        <nav aria-label="Inhalt" className="mt-10 hidden lg:block [@media(max-height:760px)]:hidden">
          <ol className="space-y-1">
            {sections.map((s, i) => {
              const on = active === s.id;
              return (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={`group flex items-center gap-4 py-1 text-sm transition ${on ? "text-ink" : "text-ink-faint hover:text-ink-muted"}`}>
                    <span className="w-6 font-semibold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`h-px transition-all duration-500 ${on ? "w-10 bg-sage" : "w-5 bg-line group-hover:w-8"}`} />
                    <span className={on ? "font-semibold" : ""}>{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <div className="flex -space-x-2">
          {site.founders.map((f, i) => (
            <span
              key={f.name}
              className={`grid h-10 w-10 place-items-center rounded-full border-2 border-paper text-xs font-bold ${i ? "bg-taupe-light text-ink" : "bg-sage text-paper"}`}
            >
              {initials(f.name)}
            </span>
          ))}
        </div>
        <div className="text-sm leading-snug">
          <p className="font-semibold text-ink">Florian &amp; Davy</p>
          <a href={`mailto:${site.email}`} className="text-ink-muted transition hover:text-sage">
            {site.email}
          </a>
        </div>
      </div>
    </aside>
  );
}
