import Icon, { type IconName } from "@/components/ui/Icon";

const team: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "flask",
    title: "Biotechnologen",
    text: "Erforschen Algenkulturen und Fermentationsprozesse und wählen die Rohstoffe aus, die ihren natürlichen Nährstoffgehalt am besten bewahren.",
  },
  {
    icon: "heart",
    title: "Therapeuten",
    text: "Bringen die Perspektive aus der täglichen Praxis ein: Was braucht ein aktiver Körper – und wie muss es schmecken, damit man es gerne trinkt?",
  },
  {
    icon: "barrel",
    title: "Braumeister",
    text: "Übersetzen Wissenschaft in Handwerk. Die Fermentation der Holunder-Zitrus-Algen-Basis folgt traditioneller Braukunst.",
  },
];

const process = [
  { step: "Recherchiert", text: "Jahre der Forschung zu Mikroalgen, Fermentation und natürlichen Vitalstoffen." },
  { step: "Selektiert", text: "Ausgewählte Rohstoffe, geprüft auf Herkunft, Reinheit und Nährstoffprofil." },
  { step: "Gebraut", text: "Schonend fermentiert nach dem Vorbild traditioneller Braukunst." },
  { step: "Zertifiziert", text: "Qualitätsschutz: analysiert und zertifiziert durch SGS Fresenius." },
];

export default function Story() {
  return (
    <section id="story" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">Story &amp; Expertise</span>
            <h2 className="h-section mt-4">Über Jahre entwickelt – von einem Team aus drei Disziplinen.</h2>
            <p className="lead mt-6">
              SPIRULI ist das Ergebnis eines wissenschaftlichen Vermächtnisses: über Jahre recherchiert, selektiert und gebraut von
              einem spezialisierten Team aus Biotechnologen, Therapeuten und Braumeistern.
            </p>
          </div>

          <ul data-reveal-stagger className="grid gap-4">
            {team.map((t) => (
              <li key={t.title} className="card flex gap-5 p-6 transition-shadow duration-300 hover:shadow-lift sm:p-7">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-petrol-50 text-petrol">
                  <Icon name={t.icon} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-petrol-900">{t.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{t.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Process: the line draws as you scroll. */}
        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-4 hidden h-0.5 bg-sand-300 lg:block" />
          <div data-scrub-line className="absolute left-0 right-0 top-4 hidden h-0.5 bg-leaf lg:block" />
          <ol data-reveal-stagger className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.step}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-petrol text-sm font-bold text-white ring-4 ring-sand">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-petrol-900">{p.step}</h3>
                <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
