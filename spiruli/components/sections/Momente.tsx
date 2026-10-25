const moments = [
  { time: "07:30", title: "Auf dem Weg", text: "Statt dem zweiten Kaffee: kalt, spritzig, 43 kcal." },
  { time: "13:00", title: "Am Schreibtisch", text: "Für die Pause zwischendurch: Holunder und Zitrone, wenig Zucker." },
  { time: "18:30", title: "Nach dem Training", text: "Kalt aus dem Kühlschrank – vegan, mit Aminosäuren aus der Alge." },
];

import CanPose from "@/components/stage/CanPose";
import Floaters from "@/components/ui/Floaters";

/** When people drink it: a simple day line on petrol. */
export default function Momente() {
  return (
    <section className="relative overflow-hidden bg-petrol text-cream">
      <CanPose at="0%" pose={{ x: 0.62, y: 0.05, s: 0.85, ry: 14, rz: 0.22, o: 1 }} />
      <CanPose at="45%" pose={{ x: 0.62, y: 0, s: 0.85, ry: 15, rz: 0.1, o: 1 }} />
      <CanPose at="90%" pose={{ x: 0.66, y: 0.2, s: 0.8, ry: 15.6, rz: 0.3, o: 0 }} />
      <Floaters
        items={[
          { src: "leaf-a", x: 86, y: 20, size: 9, depth: 0.25, spin: 30 },
          { src: "lemon-a", x: 92, y: 78, size: 8, depth: -0.15, spin: -25, rotate: 30 },
        ]}
      />
      <div className="wrap relative py-24 sm:py-32">
        <p data-reveal className="label text-leaf">
          Wann SPIRULI passt
        </p>
        <h2 data-reveal className="headline mt-4 max-w-3xl text-5xl sm:text-6xl">
          Für den Alltag gemacht, nicht fürs Regal.
        </h2>
        <ol data-reveal-stagger className="mt-16 grid gap-10 border-t border-cream/20 pt-10 md:w-[62%] md:grid-cols-3">
          {moments.map((m) => (
            <li key={m.time}>
              <p className="font-display text-4xl font-light tracking-wider text-cream/60">{m.time}</p>
              <h3 className="mt-4 text-2xl font-bold">{m.title}</h3>
              <p className="mt-2 max-w-xs leading-relaxed text-cream/75">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
