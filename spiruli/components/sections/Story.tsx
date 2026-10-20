import SplitHeading from "@/components/ui/SplitHeading";

const disciplines = [
  {
    no: "01",
    title: "Biotechnologen",
    text: "Erforschen Algenkulturen und Fermentationsprozesse – und wählen aus, welche Rohstoffe ihren natürlichen Nährstoffgehalt am besten bewahren.",
  },
  {
    no: "02",
    title: "Therapeuten",
    text: "Bringen die Perspektive aus der täglichen Praxis ein: Was braucht ein aktiver Körper wirklich – und wie muss es schmecken, damit man es gerne trinkt?",
  },
  {
    no: "03",
    title: "Braumeister",
    text: "Übersetzen Wissenschaft in Handwerk. Die Fermentation der Holunder-Zitrus-Algen-Basis folgt der Sorgfalt traditioneller Braukunst.",
  },
];

const process = [
  { step: "Recherchiert", text: "Jahre der Forschung zu Mikroalgen, Fermentation und natürlichen Vitalstoffen." },
  { step: "Selektiert", text: "Ausgewählte Rohstoffe – geprüft auf Herkunft, Reinheit und Nährstoffprofil." },
  { step: "Gebraut", text: "Schonend fermentiert, damit B-Vitamine und Aminosäuren erhalten bleiben." },
  { step: "Zertifiziert", text: "Qualitätsschutz: analysiert und zertifiziert durch SGS Fresenius." },
];

export default function Story() {
  return (
    <section id="story" className="marble relative overflow-hidden py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute -right-[8vw] top-10 select-none font-display text-[26vw] font-extralight leading-none text-outline-dark" data-parallax="0.25">
        S
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <span data-reveal className="eyebrow !text-gold-deep before:!bg-gold-deep/70">
          Story &amp; Expertise
        </span>
        <SplitHeading
          words={["Jahre", "der", "Forschung.", { text: "Ein", className: "font-serif font-medium italic normal-case text-emerald-deep" }, { text: "Schluck.", className: "font-serif font-medium italic normal-case text-emerald-deep" }]}
          className="mt-6 max-w-5xl font-display text-[2.7rem] font-semibold uppercase leading-[0.95] tracking-tight text-petrol-900 sm:text-7xl lg:text-8xl"
        />
        <p data-reveal className="mt-8 max-w-2xl text-lg leading-relaxed text-stone-700">
          SPIRULI ist kein Trend-Getränk, sondern das Ergebnis eines wissenschaftlichen Vermächtnisses: über Jahre
          recherchiert, selektiert und gebraut von einem spezialisierten Team aus Biotechnologen, Therapeuten und
          Braumeistern.
        </p>

        <div data-reveal-stagger className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-petrol-900/10 bg-petrol-900/10 md:grid-cols-3">
          {disciplines.map((d) => (
            <article key={d.no} className="group relative bg-stone-50/80 p-8 backdrop-blur transition-colors duration-500 hover:bg-petrol-900 sm:p-10">
              <span className="font-display text-sm font-semibold tracking-[0.3em] text-gold-deep transition-colors group-hover:text-gold">{d.no}</span>
              <h3 className="mt-10 font-display text-3xl font-semibold uppercase tracking-wide text-petrol-900 transition-colors group-hover:text-white">
                {d.title}
              </h3>
              <p className="mt-4 leading-relaxed text-stone-700 transition-colors group-hover:text-white/70">{d.text}</p>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gold to-emerald-bright transition-all duration-700 group-hover:w-full" />
            </article>
          ))}
        </div>

        {/* Process timeline: the hairline draws as you scroll. */}
        <div className="relative mt-24">
          <div className="absolute left-0 right-0 top-[11px] h-px bg-petrol-900/10" />
          <div data-scrub-line className="absolute left-0 right-0 top-[11px] h-px bg-gradient-to-r from-gold-deep via-gold to-emerald" />
          <ol data-reveal-stagger className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.step}>
                <span className="grid h-6 w-6 place-items-center rounded-full border border-gold bg-stone-50">
                  <span className={`h-2 w-2 rounded-full ${i === process.length - 1 ? "bg-emerald" : "bg-gold"}`} />
                </span>
                <h4 className="mt-6 font-display text-xl font-semibold uppercase tracking-[0.12em] text-petrol-900">{p.step}</h4>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-700">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
