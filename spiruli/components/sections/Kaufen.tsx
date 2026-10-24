import CopyPzn from "@/components/ui/CopyPzn";
import { site } from "@/lib/site";

/** Closing call to action on petrol, with the can render. */
export default function Kaufen() {
  return (
    <section id="kaufen" className="relative overflow-hidden bg-petrol-deep text-cream">
      <div className="wrap grid items-center gap-10 py-24 sm:py-28 lg:grid-cols-[1.2fr_1fr]">
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
        <img src="/renders/hero-can.webp" alt="SPIRULI Dose" loading="lazy" className="mx-auto h-[60vh] max-h-[640px] w-auto" />
      </div>
    </section>
  );
}
