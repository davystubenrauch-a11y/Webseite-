import Icon from "@/components/ui/Icon";
import { LazyNfcStage } from "@/components/three/Lazy";

const LOOK = { theme: "white", lang: "en", business: "" } as const;

const facts = [
  { label: "NFC-Platten", value: "Weiß & Schwarz" },
  { label: "Websites", value: "ab 300 €" },
  { label: "Roomtours", value: "ab 300 €" },
];

/** Blue hero panel: clear message on the left, the slowly turning 3D disc on the right. */
export default function Hero() {
  return (
    <section id="top" className="px-3 pt-20 sm:px-4 sm:pt-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white sm:rounded-[2.5rem]">
        {/* Static decorative circles */}
        <div aria-hidden className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-white/[0.06]" />
        <div aria-hidden className="absolute -bottom-40 right-40 h-[420px] w-[420px] rounded-full bg-sky-300/10" />
        <div aria-hidden className="absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative grid items-center gap-4 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> F&amp;D Solutions · München
            </span>
            <h1 className="mt-6 font-heading text-[clamp(2.3rem,5.2vw,4.2rem)] font-extrabold leading-[1.05] tracking-tight">
              Wir machen Ihr Unternehmen online <span className="text-sky-200">überzeugend.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-100">
              Mehr Google-Bewertungen mit NFC-Platten, moderne Websites und 360°-Roomtours. Persönlich betreut von Florian Dressler
              und Davy Stubenrauch.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#anfrage"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
              >
                Kostenlos anfragen <Icon name="arrow" className="h-4 w-4" />
              </a>
              <a
                href="#leistungen"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Leistungen ansehen
              </a>
            </div>
            <dl className="mt-10 grid max-w-xl gap-2 sm:grid-cols-3 sm:gap-3">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-inset ring-white/15 sm:block"
                >
                  <dt className="text-sm text-blue-100 sm:text-xs">{f.label}</dt>
                  <dd className="font-heading text-base font-bold sm:mt-0.5 sm:text-lg">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            <div aria-hidden className="absolute inset-[10%] rounded-full bg-white/10 ring-1 ring-white/20" />
            <div aria-hidden className="absolute inset-[22%] rounded-full bg-sky-200/20 blur-2xl" />
            <LazyNfcStage className="absolute inset-0" look={LOOK} particles={0} cameraZ={7.4} spin={0.2} />
          </div>
        </div>
      </div>
    </section>
  );
}
