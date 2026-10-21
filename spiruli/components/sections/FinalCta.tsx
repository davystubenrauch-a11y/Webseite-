import CopyPzn from "@/components/ui/CopyPzn";
import { Berries, Lemon, Spiral } from "@/components/ui/Illustrations";
import { site } from "@/lib/site";
import { Arrow } from "./Hero";

const steps = ["In die Apotheke gehen", `PZN ${site.pzn} nennen`, "Kalt stellen & genießen"];

export default function FinalCta() {
  return (
    <section id="kaufen" className="paper relative overflow-hidden bg-lime py-24 sm:py-32">
      <Lemon className="absolute -left-10 top-10 w-32 rotate-12 opacity-90 sm:w-44" />
      <Berries className="absolute -right-6 bottom-8 w-28 -rotate-12 sm:w-40" />
      <Spiral className="absolute right-[12%] top-8 hidden w-32 lg:block" />

      <div className="wrap relative text-center">
        <span className="kicker bg-cream">Jetzt probieren</span>
        <h2 className="display mx-auto mt-6 max-w-5xl text-6xl uppercase sm:text-8xl lg:text-9xl">Frag in deiner Apotheke.</h2>

        <ol data-reveal-stagger className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="sticker flex items-center gap-4 bg-cream p-5 text-left">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-lg font-extrabold text-lime">{i + 1}</span>
              <span className="text-lg font-bold leading-tight">{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <CopyPzn className="!bg-cream" />
          <a href={`mailto:${site.email}?subject=${encodeURIComponent("Händleranfrage SPIRULI")}`} className="btn-ink">
            Händleranfrage
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
