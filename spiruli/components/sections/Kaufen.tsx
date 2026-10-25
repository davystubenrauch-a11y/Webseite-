import CopyPzn from "@/components/ui/CopyPzn";
import PznBarcode from "@/components/ui/PznBarcode";
import { site } from "@/lib/site";

/** Closing: how to get it, with the PZN as a scannable card. */
export default function Kaufen() {
  return (
    <section id="kaufen" className="bg-teal py-24 text-mist sm:py-32">
      <div className="wrap grid items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p data-reveal className="label text-fresh">
            Probieren
          </p>
          <h2 data-reveal className="headline mt-6 text-6xl sm:text-8xl">
            Frag in deiner <span className="text-fresh">Apotheke.</span>
          </h2>
          <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-mist/85">
            SPIRULI ist unter der Pharmazentralnummer {site.pzn} bei der IFA GmbH gelistet – jede Apotheke in Deutschland kann es bestellen. Der
            Qualitätsschutzprozess wird von SGS Fresenius analysiert und zertifiziert.
          </p>
          <div data-reveal className="mt-10 flex flex-wrap gap-3">
            <CopyPzn className="btn bg-fresh text-ink hover:bg-mist" />
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Händleranfrage SPIRULI")}`} className="btn border border-mist/40 text-mist hover:border-mist">
              Händleranfrage
            </a>
          </div>
        </div>
        <div data-reveal className="rounded-3xl bg-paper p-8 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
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
