import CopyPzn from "@/components/ui/CopyPzn";
import Pattern from "@/components/ui/Pattern";
import { site } from "@/lib/site";

const steps = ["Apotheke besuchen", `PZN ${site.pzn} nennen`, "Kalt stellen & genießen"];

/** Final green field: the can returns to the centre. */
export default function Kaufen() {
  return (
    <section
      id="kaufen"
      data-can='{"x":0,"y":-0.1,"s":0.66,"ry":18.85,"rx":0.05,"rz":0}'
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-algae text-lime"
    >
      <Pattern color="#237A45" />
      <div className="wrap relative flex flex-1 flex-col py-24">
        <h2 data-reveal className="mega text-center text-[12vw] lg:text-[9rem]">
          Probier&apos;s aus.
        </h2>
        <div className="min-h-[46svh] flex-1" />
        <div className="dotted text-lime/60" />
        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <ol className="flex flex-wrap gap-2">
            {steps.map((s, i) => (
              <li key={s} className="pill bg-lime-soft !py-2.5 text-ink">
                {i + 1}. {s}
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2">
            <CopyPzn className="pill bg-lime text-ink" />
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Händleranfrage SPIRULI")}`} className="pill bg-ink text-lime">
              Händleranfrage →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
