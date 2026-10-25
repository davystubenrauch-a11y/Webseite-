import CanSlot from "@/components/can/CanSlot";
import { site } from "@/lib/site";

const facts = ["Vegan", "Vitamin B11 · 12 mg", "Vitamin B12 · 2 µg", "SGS Fresenius geprüft", `PZN ${site.pzn}`];

/** Big two-line statement with the can standing in front of it. */
export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16 sm:pt-20">
      <div className="relative flex flex-1 items-center justify-center">
        <h1 className="headline pointer-events-none select-none text-center text-[20.5vw] sm:text-[19vw] lg:text-[15.5vw]">
          <span data-reveal className="block">Grüne</span>
          <span data-reveal className="block text-teal" style={{ ["--d" as string]: "0.1s" }}>
            Balance
          </span>
        </h1>
        <CanSlot name="hero" className="absolute left-1/2 top-1/2 h-[46svh] max-h-[720px] sm:h-[64svh] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="wrap pb-6">
        <p data-reveal className="mx-auto max-w-md text-center text-ink/70">
          Spirulina, Holunder und Zitrone – spritzig, vegan und leicht. <span className="text-ink">Der Balancer.</span> Made in Germany.
        </p>
        <ul className="mt-8 grid grid-cols-2 border-l border-t border-line text-sm sm:grid-cols-5">
          {facts.map((f, i) => (
            <li key={f} className={`border-b border-r border-line px-4 py-4 text-center font-medium ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
