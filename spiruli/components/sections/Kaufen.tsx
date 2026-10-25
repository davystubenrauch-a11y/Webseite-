import CopyPzn from "@/components/ui/CopyPzn";
import PznBarcode from "@/components/ui/PznBarcode";
import Split from "@/components/ui/Split";
import { site } from "@/lib/site";

/** Closing: how to get it, with the can and the PZN as a scannable card. */
export default function Kaufen() {
  return (
    <section id="kaufen" className="relative overflow-hidden bg-teal py-24 text-mist sm:py-32">
      <svg aria-hidden viewBox="0 0 600 600" className="absolute -right-56 -bottom-72 w-[820px] text-mist/[0.08]">
        {[290, 240, 190, 140, 90].map((r) => (
          <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="wrap relative grid items-center gap-16 lg:grid-cols-[1.15fr_0.6fr_1fr] lg:gap-10">
        <div>
          <p data-reveal className="label text-fresh">
            Probieren
          </p>
          <Split className="headline mt-6 text-6xl sm:text-8xl lg:text-7xl xl:text-8xl" lines={["Frag in", "deiner", <span key="c" className="text-fresh">Apotheke.</span>]} />
          <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-mist/85">
            SPIRULI ist unter der Pharmazentralnummer {site.pzn} bei der IFA GmbH gelistet – jede Apotheke in Deutschland kann es bestellen. Der
            Qualitätsschutzprozess wird von SGS Fresenius analysiert und zertifiziert.
          </p>
          <div data-reveal className="mt-10 flex flex-wrap gap-3">
            <CopyPzn className="btn bg-fresh text-ink hover:bg-mist" />
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Händleranfrage SPIRULI")}`} className="btn border border-mist/40 text-mist hover:border-mist">
              Händleranfrage →
            </a>
          </div>
        </div>
        <div data-reveal className="hidden lg:block" style={{ ["--d" as string]: "0.1s" }}>
          <img src="/can/spiruli.webp" alt="" loading="lazy" className="mx-auto w-40 rotate-[8deg] drop-shadow-[0_40px_40px_rgba(0,0,0,0.35)] xl:w-48" />
        </div>
        <div data-reveal className="rounded-[1.75rem] bg-paper p-8 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
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
