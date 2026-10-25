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
          <div key={k} className="grid h-32 w-32 place-items-center rounded-full border-2 border-ink/80 bg-[#d9b872] text-center leading-none sm:h-36 sm:w-36">
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
      <p className="font-display text-[9rem] font-extrabold leading-none tracking-tighter sm:text-[11rem]">
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

/** Four reasons in a 2 × 2 grid. */
export default function Gruende() {
  return (
    <section className="relative z-10 bg-mist py-24 sm:py-32">
      <div className="wrap">
        <p data-reveal className="label text-teal">
          Warum SPIRULI
        </p>
        <h2 data-reveal className="headline mt-4 text-5xl sm:text-7xl">
          Vier gute <span className="text-teal">Gründe.</span>
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {panels.map((p, i) => (
            <article
              key={p.title}
              data-reveal
              style={{ ["--d" as string]: `${(i % 2) * 0.08}s` }}
              className={`flex min-h-[26rem] flex-col justify-between gap-8 rounded-[2rem] p-8 sm:p-10 ${p.cls}`}
            >
              <p className="label opacity-70">
                0{i + 1} · {p.kicker}
              </p>
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
