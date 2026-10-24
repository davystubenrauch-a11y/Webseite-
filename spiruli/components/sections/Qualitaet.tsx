import PznBarcode from "@/components/ui/PznBarcode";
import { site } from "@/lib/site";

const points = [
  { title: "Made in Germany", text: "Hergestellt in Deutschland." },
  { title: "Holunder aus Mitteleuropa", text: "Laut Hersteller pestizidfrei angebaut." },
  { title: "SGS Fresenius", text: "Der Qualitätsschutzprozess wird von SGS Fresenius analysiert und zertifiziert." },
];

/** Quality: the PZN listing and the checks behind the can. */
export default function Qualitaet() {
  return (
    <section id="qualitaet" className="bg-cream py-24 sm:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p data-reveal className="label text-petrol">
            Qualität
          </p>
          <h2 data-reveal className="headline mt-4 text-5xl text-petrol-deep sm:text-6xl">
            Ein Getränk mit <br />
            Pharmazentralnummer.
          </h2>
          <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed text-ink/75">
            SPIRULI ist unter der PZN {site.pzn} bei der IFA GmbH gelistet. Damit kann jede Apotheke in Deutschland die Dose bestellen.
          </p>
          <ul data-reveal-stagger className="mt-10 border-t border-cream-line">
            {points.map((p) => (
              <li key={p.title} className="grid gap-1 border-b border-cream-line py-5 sm:grid-cols-[14rem_1fr]">
                <p className="font-bold">{p.title}</p>
                <p className="text-ink/70">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="self-center rounded-2xl bg-white p-8 shadow-[0_1px_0_#d8cdb5,0_30px_60px_-40px_rgba(10,49,52,0.5)]">
          <p className="label text-ink/50">Pharmazentralnummer</p>
          <p className="headline mt-2 text-6xl text-petrol-deep">{site.pzn}</p>
          <PznBarcode pzn={site.pzn} className="mt-8 h-20 w-full text-ink" />
          <p className="mt-2 text-center text-sm font-semibold tracking-[0.3em]">PZN - {site.pzn}</p>
          <p className="mt-6 text-sm text-ink/60">Den Barcode in der Apotheke zeigen oder die Nummer nennen.</p>
        </div>
      </div>
    </section>
  );
}
