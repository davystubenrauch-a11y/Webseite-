import CopyPzn from "@/components/ui/CopyPzn";
import { site } from "@/lib/site";
import CanPose from "@/components/stage/CanPose";
import Floaters from "@/components/ui/Floaters";

/** Closing call to action on petrol, with the can render. */
export default function Kaufen() {
  return (
    <section id="kaufen" className="relative overflow-hidden bg-petrol-deep text-cream">
      <CanPose at="0%" pose={{ x: 0.45, y: 0, s: 1, ry: 18.85, rz: -0.08, o: 1 }} />
      <Floaters
        items={[
          { src: "berries-a", x: 64, y: 24, size: 11, depth: 0.2, spin: -20 },
          { src: "lemon-b", x: 88, y: 76, size: 9, depth: -0.2, spin: 35 },
          { src: "leaf-b", x: 92, y: 26, size: 8, depth: 0.3, spin: 20, blur: true },
        ]}
      />
      <div className="wrap relative grid items-center gap-10 py-24 sm:py-28 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="label text-leaf">Probieren</p>
          <h2 className="headline mt-4 text-6xl sm:text-7xl">
            Frag in deiner <br />
            Apotheke.
          </h2>
          <ol className="mt-10 space-y-3 text-lg">
            <li>
              <span className="mr-3 font-bold text-leaf">1</span>Apotheke besuchen oder anrufen
            </li>
            <li>
              <span className="mr-3 font-bold text-leaf">2</span>PZN {site.pzn} nennen
            </li>
            <li>
              <span className="mr-3 font-bold text-leaf">3</span>Kalt stellen und genießen
            </li>
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <CopyPzn className="btn bg-cream text-petrol-deep hover:bg-white" />
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Händleranfrage SPIRULI")}`} className="btn border border-cream/40 text-cream hover:bg-cream/10">
              Händleranfrage
            </a>
          </div>
        </div>
        <div className="h-[50vh] lg:h-[70vh]" />
      </div>
    </section>
  );
}
