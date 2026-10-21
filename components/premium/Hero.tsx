import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { LazyNfcStage } from "@/components/three/Lazy";
import { compatible } from "@/lib/content";

const LOOK = { theme: "white", lang: "en", business: "" } as const;

/** Expressive serif headline on a soft mesh gradient, the 3D disc in a glass frame. */
export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-36 sm:pt-44 lg:pt-48">
      <div aria-hidden className="mesh absolute inset-0 -z-10 animate-drift" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-paper" />

      <div className="container-site">
        <div className="grid-12 items-center gap-y-16">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <Reveal>
              <span className="eyebrow">Digitalagentur · München</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-8 font-heading text-[clamp(2.75rem,6.4vw,5.5rem)] font-medium leading-[1.04] tracking-[0.005em] text-ink">
                Digitale Präsenz, die <em className="italic text-sage">Vertrauen</em> schafft.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-xl text-lg leading-[1.75] text-ink-muted">
                Wir gestalten Websites, 360°-Roomtours und NFC-Platten für Google-Bewertungen. Für Unternehmen, die online so
                überzeugen wollen wie im persönlichen Gespräch.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <a href="#anfrage" className="btn-primary">
                Projekt besprechen <Icon name="arrow" className="h-4 w-4" />
              </a>
              <a href="#leistungen" className="link-arrow">
                Leistungen entdecken
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.25} className="col-span-4 sm:col-span-6 sm:col-start-2 lg:col-span-5 lg:col-start-8">
            <figure className="glass relative overflow-hidden rounded-[2rem] shadow-lift">
              <div className="relative aspect-[4/5]">
                <div aria-hidden className="absolute inset-[14%] rounded-full bg-white/70 blur-2xl" />
                <LazyNfcStage className="absolute inset-0" look={LOOK} cameraZ={8} spin={0.18} />
              </div>
              <figcaption className="flex items-center justify-between border-t border-white/60 px-6 py-4 text-xs text-ink-muted">
                <span>NFC Review Disc · Ø 10 cm</span>
                <span className="text-ink-faint">zum Drehen ziehen</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal delay={0.4} className="mt-24 border-t border-line py-10 lg:mt-32">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-faint">Funktioniert mit</span>
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-3">
              {compatible.map((c) => (
                <li key={c} className="font-heading text-lg italic text-ink-faint transition hover:text-ink-soft">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
