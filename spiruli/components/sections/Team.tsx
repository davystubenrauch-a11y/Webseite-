import Pattern from "@/components/ui/Pattern";

const team = [
  { no: "01", title: "Biotechnologen", text: "Erforschen Algenkulturen und Fermentation und wählen die Rohstoffe aus." },
  { no: "02", title: "Therapeuten", text: "Bringen die Perspektive aus der Praxis ein: Was braucht ein aktiver Körper?" },
  { no: "03", title: "Braumeister", text: "Übersetzen Wissenschaft in Handwerk – fermentiert wie in der Braukunst." },
];

/** Citrus field: who makes it. The can drifts out to the right. */
export default function Team() {
  return (
    <section
      id="team"
      data-can='{"x":0.72,"y":0.25,"s":0.62,"ry":10.4,"rx":-0.95,"rz":-0.5}'
      className="relative min-h-[100svh] overflow-hidden bg-citrus text-ink"
    >
      <Pattern color="#EDA717" />
      <div className="wrap relative py-28">
        <p className="micro text-ink/70">Wer dahinter steckt</p>
        <h2 data-reveal className="mega mt-4 max-w-4xl text-[12vw] md:text-[7vw]">
          Jahre Forschung.
          <br />
          Drei Disziplinen.
        </h2>
        <div className="dotted mt-12 text-ink/50" />
        <ol data-reveal-stagger className="mt-10 grid gap-10 md:grid-cols-3">
          {team.map((m) => (
            <li key={m.no}>
              <span className="mega text-6xl text-cream [-webkit-text-stroke:2px_#10331F]">{m.no}</span>
              <h3 className="mega mt-4 text-3xl">{m.title}</h3>
              <p className="micro mt-3 max-w-xs text-ink/80">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
