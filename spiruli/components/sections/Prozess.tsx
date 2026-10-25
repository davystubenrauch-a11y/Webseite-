"use client";

import { useEffect, useRef } from "react";
import Split from "@/components/ui/Split";

const steps = [
  {
    title: "Erforscht",
    text: "Ein Team aus Biotechnologen, Therapeuten und Braumeistern hat die Zutaten über Jahre erforscht, diskutiert und ausgewählt.",
  },
  {
    title: "Fermentiert",
    text: "SPIRULI ist ein fermentiertes, verzehrfertiges Getränk auf Holunder-Zitrus-Algen-Basis – mit fermentiertem Gerstenmalz.",
  },
  {
    title: "Schonend verarbeitet",
    text: "Von der Produktion bis zur Dose schützen die Verfahren wichtige Aminosäuren und Vitamine, statt sie zu zerstören.",
  },
  {
    title: "Analysiert",
    text: "Die begleitende Analytik über SGS Fresenius weist die Inhaltsstoffe im fertigen Getränk nach.",
  },
];

/** Four steps on a line that fills as you scroll; each step lights up when the line reaches it. */
export default function Prozess() {
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ol = list.current!;
    const items = Array.from(ol.querySelectorAll<HTMLLIElement>("li"));
    let raf = 0;
    const tick = () => {
      const r = ol.getBoundingClientRect();
      const mark = innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
      fill.current!.style.transform = `scaleY(${p})`;
      items.forEach((li) => li.classList.toggle("is-on", li.getBoundingClientRect().top < mark));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative z-10 bg-paper py-24 sm:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p data-reveal className="label text-teal">
            So entsteht SPIRULI
          </p>
          <Split className="headline mt-6 text-6xl sm:text-8xl" lines={["Jahre", "Arbeit.", <span key="c" className="text-teal">Eine Dose.</span>]} />
          <p data-reveal className="mt-8 max-w-sm text-lg leading-relaxed text-ink/70">
            Ernährungsphysiologische Vorteile mit modernem Lifestyle verbinden – und dabei schmecken. Das war der Anspruch.
          </p>
        </div>
        <ol ref={list} className="relative">
          <div aria-hidden className="absolute bottom-0 left-[1.6rem] top-0 w-px bg-line sm:left-[2.1rem]" />
          <div ref={fill} aria-hidden className="absolute bottom-0 left-[1.6rem] top-0 w-px origin-top bg-teal sm:left-[2.1rem]" style={{ transform: "scaleY(0)" }} />
          {steps.map((s, i) => (
            <li key={s.title} className="group relative flex gap-6 pb-16 last:pb-0 sm:gap-10">
              <span className="relative z-10 grid h-[3.2rem] w-[3.2rem] shrink-0 place-items-center rounded-full border border-line bg-paper font-display text-lg font-extrabold text-ink/40 transition-all duration-500 group-[.is-on]:border-teal group-[.is-on]:bg-teal group-[.is-on]:text-mist sm:h-[4.2rem] sm:w-[4.2rem] sm:text-2xl">
                0{i + 1}
              </span>
              <div className="pt-1 opacity-35 transition-opacity duration-700 group-[.is-on]:opacity-100 sm:pt-3">
                <h3 className="headline text-4xl sm:text-6xl">{s.title}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/70">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
