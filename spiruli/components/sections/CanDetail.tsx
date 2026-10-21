import LazyCanCanvas from "@/components/three/LazyCanCanvas";
import CanControls from "@/components/ui/CanControls";
import { Wave } from "@/components/ui/Illustrations";

const left = [
  { k: "Vegan", t: "100 % pflanzlich – erkennbar am Vegan-Siegel auf dem Goldband." },
  { k: "B-Vitamine", t: "Natürlicher B-Komplex aus der Algenbasis, darunter Vitamin B12 (2 µg)." },
];
const right = [
  { k: "18+ Aminosäuren", t: "Von Tryptophan bis zu den BCAA Leucin, Isoleucin und Valin." },
  { k: "PZN 11110571", t: "In jeder Apotheke in Deutschland bestellbar." },
];

function Callout({ k, t, side }: { k: string; t: string; side: "l" | "r" }) {
  return (
    <li className={`relative flex items-center gap-4 ${side === "l" ? "lg:flex-row-reverse lg:text-right" : ""}`}>
      <span className="hidden h-0.5 w-12 shrink-0 bg-ink lg:block" />
      <div className="sticker w-full bg-cream p-5">
        <p className="text-xl font-extrabold">{k}</p>
        <p className="mt-1 leading-snug text-ink/80">{t}</p>
      </div>
    </li>
  );
}

export default function CanDetail() {
  return (
    <section id="dose" className="relative bg-petrol-soft">
      <Wave fill="#DCEBEE" className="absolute -top-10 left-0 sm:-top-16" />
      <div className="wrap py-20 sm:py-28">
        <div data-reveal className="text-center">
          <span className="kicker bg-cream">Die Dose</span>
          <h2 className="display mt-5 text-5xl sm:text-7xl">Alles drauf. Alles drin.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg">Ziehen Sie die Dose zum Drehen – oder schauen Sie sich die Rückseite an.</p>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_1.1fr_1fr]">
          <ul data-reveal-stagger className="order-2 grid gap-5 lg:order-1">
            {left.map((c) => (
              <Callout key={c.k} {...c} side="l" />
            ))}
          </ul>
          <div className="relative order-1 h-[60svh] min-h-[420px] lg:order-2">
            <div aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[85%] max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-ink/25 bg-cream/60" />
            <LazyCanCanvas className="absolute -inset-x-12 inset-y-0" particles={50} cameraZ={8.2} />
            <div className="absolute inset-x-0 bottom-0 flex justify-center">
              <CanControls />
            </div>
          </div>
          <ul data-reveal-stagger className="order-3 grid gap-5">
            {right.map((c) => (
              <Callout key={c.k} {...c} side="r" />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
