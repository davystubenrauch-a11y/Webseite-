import CopyPzn from "@/components/ui/CopyPzn";
import PznBarcode from "@/components/ui/PznBarcode";
import Split from "@/components/ui/Split";
import { site } from "@/lib/site";

/** Ingredients circling the can on a slowly turning ring (each one counter-turns to stay upright). */
const orbit = [
  { src: "/float/zitrone.webp", w: "w-14 sm:w-20" },
  { src: "/float/pulver.webp", w: "w-24 sm:w-36" },
  { src: "/float/orange.webp", w: "w-14 sm:w-20" },
  { src: "/float/holunder.webp", w: "w-16 sm:w-24" },
  { src: "/float/algenbund.webp", w: "w-24 sm:w-36" },
  { src: "/float/tabletten.webp", w: "w-12 sm:w-16" },
];

/** Finale: the can with its ingredients in orbit, the call to action and the PZN. */
export default function Kaufen() {
  return (
    <section id="kaufen" className="relative overflow-hidden bg-teal pb-24 pt-24 text-mist sm:pb-32 sm:pt-32">
      <div className="wrap relative text-center">
        <p data-reveal className="label text-fresh">
          Probieren
        </p>
        <Split className="headline mx-auto mt-6 text-[15vw] sm:text-[11vw] lg:text-[9vw]" lines={["Probier den", <span key="b" className="text-fresh">Balancer.</span>]} />
      </div>

      <div className="relative mx-auto my-10 grid aspect-square w-[min(92vw,640px)] place-items-center">
        <div aria-hidden className="absolute inset-[6%] rounded-full border border-mist/20" />
        <div aria-hidden className="absolute inset-[22%] rounded-full border border-mist/10" />
        <div className="absolute inset-0 animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
          {orbit.map((o, i) => {
            const a = (i / orbit.length) * 360;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `translate(-50%, -50%) rotate(${a}deg) translateY(calc(-1 * min(40vw, 280px))) rotate(${-a}deg)` }}
              >
                <img src={o.src} alt="" loading="lazy" className={`${o.w} animate-[spin_40s_linear_infinite_reverse] drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)] motion-reduce:animate-none`} />
              </div>
            );
          })}
        </div>
        <img
          data-reveal
          src="/can/spiruli.webp"
          alt="SPIRULI Dose"
          loading="lazy"
          className="relative h-[62%] drop-shadow-[0_50px_50px_rgba(0,0,0,0.45)]"
          style={{ aspectRatio: "var(--can-aspect)" }}
        />
      </div>

      <div className="wrap relative grid items-center gap-10 lg:grid-cols-2">
        <div data-reveal>
          <p className="max-w-md text-lg leading-relaxed text-mist/85">
            SPIRULI ist unter der Pharmazentralnummer {site.pzn} bei der IFA GmbH gelistet – jede Apotheke in Deutschland kann es bestellen. Der
            Qualitätsschutzprozess wird von SGS Fresenius analysiert und zertifiziert.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CopyPzn className="btn bg-fresh text-ink hover:bg-mist" />
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Händleranfrage SPIRULI")}`} className="btn border border-mist/40 text-mist hover:border-mist">
              Händleranfrage →
            </a>
          </div>
        </div>
        <div data-reveal className="rounded-[1.75rem] bg-paper p-8 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] lg:justify-self-end lg:w-[28rem]">
          <p className="label text-ink/50">Pharmazentralnummer</p>
          <p className="mt-3 font-display text-6xl font-extrabold tracking-tight">{site.pzn}</p>
          <PznBarcode pzn={site.pzn} className="mt-8 h-20 w-full text-ink" />
          <p className="mt-2 text-center text-sm font-semibold tracking-[0.3em]">PZN - {site.pzn}</p>
          <p className="mt-6 text-sm text-ink/60">In der Apotheke zeigen oder die Nummer nennen.</p>
        </div>
      </div>
    </section>
  );
}
