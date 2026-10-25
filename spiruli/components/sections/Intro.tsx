import Split from "@/components/ui/Split";
import CanSlot from "@/components/can/CanSlot";

/** The can lands in a framed card, with the name on the left and the story on the right. */
export default function Intro() {
  return (
    <section id="getraenk" className="py-24 sm:py-32">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
        <div data-reveal className="order-2 lg:order-1">
          <p className="label text-teal">Veganes Mehrwertgetränk</p>
          <Split className="headline mt-4 text-6xl sm:text-7xl" lines={["Spiruli", <span key="b" className="text-teal">Holunder</span>]} />
          <dl className="mt-8 grid max-w-xs grid-cols-2 gap-y-3 text-sm">
            <dt className="text-ink/55">Inhalt</dt>
            <dd>200 ml Dose</dd>
            <dt className="text-ink/55">Geschmack</dt>
            <dd>Holunder · Zitrus</dd>
            <dt className="text-ink/55">Energie</dt>
            <dd>43 kcal / Dose</dd>
            <dt className="text-ink/55">Gesüßt mit</dt>
            <dd>Agavensirup</dd>
          </dl>
        </div>

        <div className="order-1 mx-auto rounded-[2rem] border border-line bg-paper px-14 pb-14 pt-10 sm:px-20 lg:order-2">
          <CanSlot name="intro" className="relative h-[56svh] max-h-[600px] min-h-[380px]" />
        </div>

        <div data-reveal className="order-3 max-w-md lg:justify-self-end" style={{ ["--d" as string]: "0.1s" }}>
          <p className="label text-ink/55">Das Getränk</p>
          <p className="mt-4 text-xl leading-relaxed">
            Zwei Algen geben SPIRULI seinen Namen: <b>SPIRU</b>lina platensis und <b>LI</b>thothamnium calcareum. Dazu Holunder, Zitrone, Orange und ein Schuss
            Kohlensäure.
          </p>
          <p className="mt-4 leading-relaxed text-ink/65">Kein Smoothie, kein Pulver – eine leichte Erfrischung, die man trinkt, weil sie schmeckt. Am besten gut gekühlt.</p>
          <a href="#shop" className="btn mt-8 bg-ink text-mist hover:bg-teal">
            Jetzt kaufen · ab 35,40 €
          </a>
        </div>
      </div>
    </section>
  );
}
