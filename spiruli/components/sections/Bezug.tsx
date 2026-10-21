import CopyPzn from "@/components/ui/CopyPzn";
import Icon, { type IconName } from "@/components/ui/Icon";
import LazyCanCanvas from "@/components/three/LazyCanCanvas";
import { site } from "@/lib/site";
import { Arrow } from "./Hero";

const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: "pharmacy", title: "PZN nennen", text: `In Ihrer Apotheke einfach die PZN ${site.pzn} angeben.` },
  { icon: "cart", title: "Bestellen", text: "Die Apotheke bestellt SPIRULI über den pharmazeutischen Großhandel." },
  { icon: "can", title: "Genießen", text: "Am besten gut gekühlt – fermentiert, vegan, natürlich." },
];

export default function Bezug() {
  return (
    <section id="bezug" className="bg-petrol-50 py-20 sm:py-28">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div data-reveal>
            <span className="eyebrow">Bezug</span>
            <h2 className="h-section mt-4">Erhältlich in Ihrer Apotheke.</h2>
            <p className="lead mt-4 max-w-xl">Für Handel, Praxen und Studios beraten wir Sie gerne persönlich.</p>
          </div>

          <ol data-reveal-stagger className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="card p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-petrol-50 text-petrol">
                    <Icon name={s.icon} />
                  </span>
                  <span className="text-sm font-bold text-sand-300">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-bold text-petrol-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Anfrage SPIRULI")}`} className="btn-primary">
              Händleranfrage
              <Arrow />
            </a>
            <CopyPzn />
          </div>
        </div>

        <div className="relative h-[460px] lg:h-[600px]">
          <div aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          <LazyCanCanvas className="absolute -inset-x-10 inset-y-0" cameraZ={7.9} />
        </div>
      </div>
    </section>
  );
}
