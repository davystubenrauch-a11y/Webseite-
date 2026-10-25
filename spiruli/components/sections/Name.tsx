import CanPose from "@/components/stage/CanPose";

/** How the name is built: SPIRU from Spirulina, LI from Lithothamnium. */
export default function Name() {
  return (
    <section className="relative bg-cream py-24 sm:py-32">
      <CanPose at="0%" pose={{ x: 0.62, y: -0.02, s: 0.9, ry: 6.6, rz: 0.32 }} />
      <div className="wrap">
        <p data-reveal className="label text-petrol">
          Woher der Name kommt
        </p>
        <div data-reveal className="mt-10 flex flex-wrap items-end gap-x-6 gap-y-8 text-petrol-deep">
          <div>
            <p className="headline text-[18vw] text-petrol md:text-[9rem]">SPIRU</p>
            <p className="mt-3 text-lg font-semibold">Spirulina platensis</p>
            <p className="text-ink/60">Mikroalge, liefert B-Vitamine und Aminosäuren</p>
          </div>
          <p className="headline pb-16 text-6xl text-ink/30">+</p>
          <div>
            <p className="headline text-[18vw] text-berry md:text-[9rem]">LI</p>
            <p className="mt-3 text-lg font-semibold">Lithothamnium calcareum</p>
            <p className="text-ink/60">Rotalge aus dem Meer</p>
          </div>
        </div>
        <p data-reveal className="mt-14 max-w-2xl text-xl leading-relaxed text-ink/80">
          Dazu kommen Holunderbeeren, Zitrone und Orange für den Geschmack und ein Schuss Kohlensäure. Das Ergebnis ist kein Smoothie und kein
          Pulver, sondern eine Erfrischung in der Dose.
        </p>
      </div>
    </section>
  );
}
