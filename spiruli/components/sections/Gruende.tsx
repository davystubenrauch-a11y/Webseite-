"use client";

import { useEffect, useRef } from "react";
import CountUp from "@/components/ui/CountUp";
import PznBarcode from "@/components/ui/PznBarcode";
import { site } from "@/lib/site";

const panels = [
  {
    kicker: "Für Veganer",
    title: "B12 aus der Dose",
    text: "Vitamin B12 steckt fast nur in tierischen Lebensmitteln. SPIRULI bringt es laut Etikett mit – zusammen mit B11 (Folsäure).",
    cls: "bg-gold text-ink",
    visual: (
      <div className="flex gap-3">
        {[
          ["B11", "12 mg"],
          ["B12", "2 µg"],
        ].map(([k, v]) => (
          <div key={k} className="grid h-36 w-36 place-items-center rounded-full border-2 border-ink/80 bg-[#d9b872] text-center leading-none sm:h-44 sm:w-44">
            <div>
              <p className="font-display text-5xl font-extrabold">{k}</p>
              <p className="mt-2 text-sm font-semibold">{v}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    kicker: "Leicht",
    title: "Nur 43 kcal pro Dose",
    text: "Gesüßt mit Agavensirup und Fruchtsaft. Etwa 7 g Zucker pro Dose – weniger als die Hälfte einer gleich großen klassischen Limonade.",
    cls: "bg-fresh text-ink",
    visual: (
      <p className="font-display text-[11rem] font-extrabold leading-none tracking-tighter sm:text-[15rem]">
        <CountUp to={43} />
      </p>
    ),
  },
  {
    kicker: "Geprüft",
    title: "Analysiert von SGS Fresenius",
    text: "Der Qualitätsschutzprozess wird von einem unabhängigen Labor analysiert und zertifiziert. Hergestellt in Deutschland.",
    cls: "bg-algae text-mist",
    visual: (
      <div className="grid h-48 w-48 place-items-center rounded-full border border-mist/40 text-center sm:h-56 sm:w-56">
        <div>
          <p className="label text-fresh">Labor&shy;geprüft</p>
          <p className="mt-3 font-display text-3xl font-extrabold">SGS</p>
          <p className="font-display text-xl font-extrabold">Fresenius</p>
        </div>
      </div>
    ),
  },
  {
    kicker: "Überall erhältlich",
    title: "In jeder Apotheke",
    text: `Mit der PZN ${site.pzn} kann jede Apotheke in Deutschland SPIRULI bestellen. Einfach Nummer nennen oder zeigen.`,
    cls: "bg-paper text-ink",
    visual: (
      <div className="w-72 rounded-2xl bg-white p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] sm:w-80">
        <p className="label text-ink/50">PZN</p>
        <p className="mt-1 font-display text-4xl font-extrabold">{site.pzn}</p>
        <PznBarcode pzn={site.pzn} className="mt-4 h-14 w-full text-ink" />
      </div>
    ),
  },
];

/**
 * Four reasons, scrolled sideways: the section pins and the row of panels
 * moves left as you scroll down (desktop). On phones they simply stack.
 */
export default function Gruende() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current!;
    const tr = track.current!;
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const tick = () => {
      if (mq.matches) {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
        tr.style.transform = `translate3d(${-p * (tr.scrollWidth - innerWidth)}px, 0, 0)`;
      } else tr.style.transform = "";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={section} className="relative z-10 bg-mist lg:h-[400vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="wrap pb-10 pt-24 lg:pt-20">
          <p className="label text-teal">Warum SPIRULI</p>
          <h2 className="headline mt-4 text-5xl sm:text-7xl">
            Vier gute <span className="text-teal">Gründe.</span>
          </h2>
        </div>
        <div ref={track} className="flex flex-col gap-4 px-5 pb-24 will-change-transform sm:px-8 lg:w-max lg:flex-row lg:px-12 lg:pb-0">
          {panels.map((p, i) => (
            <article key={p.title} className={`flex shrink-0 flex-col justify-between gap-10 rounded-[2rem] p-8 sm:p-10 lg:h-[62svh] lg:w-[min(46rem,70vw)] ${p.cls}`}>
              <div className="flex items-start justify-between gap-6">
                <p className="label opacity-70">
                  0{i + 1} · {p.kicker}
                </p>
              </div>
              <div className="self-center">{p.visual}</div>
              <div>
                <h3 className="headline text-4xl sm:text-5xl">{p.title}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed opacity-80">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
