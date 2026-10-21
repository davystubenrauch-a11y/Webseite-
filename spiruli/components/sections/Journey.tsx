"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Berries, Bubbles, Lemon, Spiral } from "@/components/ui/Illustrations";

const cards = [
  {
    no: "01",
    title: "Holunder",
    bg: "bg-berry-soft",
    accent: "text-berry",
    Art: Berries,
    note: "die Basis",
    text: "Dunkle, samtige Beerennoten geben SPIRULI seine Tiefe – fruchtig und leicht herb.",
  },
  {
    no: "02",
    title: "Zitrus",
    bg: "bg-citrus-soft",
    accent: "text-citrus",
    Art: Lemon,
    note: "die Frische",
    text: "Lebendige Zitrusnoten heben alles an und sorgen für einen klaren, erfrischenden Abgang.",
  },
  {
    no: "03",
    title: "Spirulina",
    bg: "bg-algae-soft",
    accent: "text-algae",
    Art: Spiral,
    note: "der Kern",
    text: "Die Mikroalge liefert natürliche B-Vitamine und ein breites Spektrum an Aminosäuren.",
  },
  {
    no: "04",
    title: "Fermentation",
    bg: "bg-cream-200",
    accent: "text-petrol",
    Art: Bubbles,
    note: "das Handwerk",
    text: "Schonend fermentiert nach dem Vorbild traditioneller Braukunst – so entsteht die Holunder-Zitrus-Algen-Basis.",
  },
];

/** Ingredient story: pinned and scrolled sideways on desktop, swipeable on mobile. */
export default function Journey() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} id="zutaten" className="overflow-hidden bg-cream py-16 lg:flex lg:h-[100svh] lg:items-center lg:py-0">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 lg:w-max lg:snap-none lg:overflow-visible lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-[10vw]"
      >
        <div className="flex w-[80vw] shrink-0 snap-start flex-col justify-center sm:w-[60vw] lg:w-[34rem]">
          <span className="kicker w-fit">Die Zutaten</span>
          <h2 className="display mt-5 text-6xl sm:text-7xl lg:text-8xl">
            Vier Dinge.
            <br />
            <span className="text-algae">Ein Getränk.</span>
          </h2>
          <p className="mt-5 max-w-sm text-lg">Was in SPIRULI steckt – und warum. Scrollen Sie weiter.</p>
          <span className="mt-3 font-hand text-2xl text-ink/60">→ scroll</span>
        </div>

        {cards.map(({ no, title, bg, accent, Art, note, text }) => (
          <article key={no} className={`sticker flex w-[80vw] shrink-0 snap-start flex-col p-7 sm:w-[60vw] lg:h-[72svh] lg:w-[30rem] ${bg}`}>
            <div className="flex items-start justify-between">
              <span className="text-lg font-extrabold">{no}</span>
              <span className={`-rotate-6 font-hand text-3xl font-bold ${accent}`}>{note}</span>
            </div>
            <div className="grid flex-1 place-items-center py-6">
              <Art className="h-40 w-40 transition-transform duration-500 hover:rotate-12 hover:scale-110 lg:h-56 lg:w-56" />
            </div>
            <h3 className="display text-5xl lg:text-6xl">{title}</h3>
            <p className="mt-3 text-lg leading-snug">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
