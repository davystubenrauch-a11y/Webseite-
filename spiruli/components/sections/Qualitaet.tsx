import PznBarcode from "@/components/ui/PznBarcode";
import { site } from "@/lib/site";

/** Cream field, typographic: PZN and SGS Fresenius. The can steps aside to the left. */
export default function Qualitaet() {
  return (
    <section
      id="qualitaet"
      data-can='{"x":-0.68,"y":-0.15,"s":0.7,"ry":12.6,"rx":0.9,"rz":0.3}'
      className="relative min-h-[100svh] overflow-hidden bg-cream text-ink"
    >
      <div className="wrap relative grid gap-10 py-28 md:grid-cols-[0.75fr_1.25fr]">
        <div className="hidden md:block" />
        <div>
          <p className="micro text-ink/70">Geprüft &amp; gelistet</p>
          <h2 data-reveal className="mega mt-4 text-[12vw] md:text-[6.5vw]">
            Apotheken&shy;qualität.
          </h2>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <div data-reveal className="rounded-3xl border-2 border-ink bg-white p-6">
              <p className="micro text-ink/60">Pharmazentralnummer</p>
              <p className="mega mt-2 text-5xl">{site.pzn}</p>
              <p className="mt-3 text-sm leading-relaxed">
                Gelistet bei der IFA GmbH (Informationsstelle für Arzneispezialitäten) – in jeder Apotheke in Deutschland bestellbar.
              </p>
              <PznBarcode pzn={site.pzn} className="mt-5 h-14 w-full text-ink" />
              <p className="micro mt-2 text-center tracking-[0.3em]">PZN - {site.pzn}</p>
            </div>
            <div data-reveal className="flex flex-col justify-between rounded-3xl bg-algae p-6 text-lime">
              <div>
                <p className="micro text-lime/70">Qualitätsschutz</p>
                <p className="mega mt-2 text-4xl">SGS Fresenius</p>
                <p className="mt-3 text-sm leading-relaxed text-lime-soft">
                  Der Qualitätsschutzprozess von SPIRULI wird von SGS Fresenius analysiert und zertifiziert.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {["Analysiert", "Zertifiziert", "Vegan"].map((l) => (
                  <span key={l} className="pill bg-lime text-ink">
                    ✓ {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
