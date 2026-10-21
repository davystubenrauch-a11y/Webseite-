import Icon, { type IconName } from "@/components/ui/Icon";

const makers: { icon: IconName; title: string; note: string; text: string; bg: string }[] = [
  {
    icon: "flask",
    title: "Biotechnologen",
    note: "forschen",
    bg: "bg-algae-soft",
    text: "Erforschen Algenkulturen und Fermentation und wählen die Rohstoffe aus, die ihren natürlichen Nährstoffgehalt am besten bewahren.",
  },
  {
    icon: "heart",
    title: "Therapeuten",
    note: "verstehen",
    bg: "bg-berry-soft",
    text: "Bringen die Perspektive aus der täglichen Praxis ein: Was braucht ein aktiver Körper – und wie muss es schmecken, damit man es gerne trinkt?",
  },
  {
    icon: "barrel",
    title: "Braumeister",
    note: "brauen",
    bg: "bg-citrus-soft",
    text: "Übersetzen Wissenschaft in Handwerk. Die Fermentation folgt dem Vorbild traditioneller Braukunst.",
  },
];

export default function Makers() {
  return (
    <section className="paper bg-lime py-24 sm:py-32">
      <div className="wrap">
        <div data-reveal className="grid items-end gap-6 lg:grid-cols-2">
          <div>
            <span className="kicker bg-cream">Wer dahinter steckt</span>
            <h2 className="display mt-5 text-5xl sm:text-7xl">Jahre Forschung. Drei Disziplinen.</h2>
          </div>
          <p className="text-xl leading-snug">
            SPIRULI wurde über Jahre recherchiert, selektiert und gebraut – von einem spezialisierten Team aus Biotechnologen, Therapeuten und
            Braumeistern.
          </p>
        </div>

        <ul data-reveal-stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {makers.map((m, i) => (
            <li key={m.title} className={`sticker p-7 transition-transform duration-300 hover:-rotate-1 hover:-translate-y-1 ${m.bg} ${i === 1 ? "md:translate-y-8" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-cream">
                  <Icon name={m.icon} className="h-7 w-7" />
                </span>
                <span className="-rotate-6 font-hand text-3xl font-bold">{m.note}</span>
              </div>
              <h3 className="display mt-8 text-4xl">{m.title}</h3>
              <p className="mt-3 text-lg leading-snug">{m.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
