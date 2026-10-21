import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";

const steps = [
  { title: "Kostenloses Gespräch", text: "Sie erzählen uns, was Sie brauchen. Telefonisch oder per Nachricht.", icon: "phone", color: "bg-blue-600" },
  { title: "Festpreis-Angebot", text: "Sie bekommen ein klares Angebot. Ohne versteckte Kosten.", icon: "check", color: "bg-emerald-500" },
  { title: "Umsetzung", text: "Wir gestalten, bauen und filmen. Sie sehen Zwischenstände und geben Feedback.", icon: "spark", color: "bg-amber-500" },
  { title: "Übergabe", text: "Alles läuft, Sie wissen, wie es funktioniert, und wir bleiben erreichbar.", icon: "star", color: "bg-indigo-500" },
];

/** Four-step timeline of how a project runs. */
export default function Process() {
  return (
    <section id="ablauf" className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead center eyebrow="Ablauf" title="So arbeiten wir zusammen." lead="Vier Schritte, klar und überschaubar, egal ob NFC-Platte, Website oder Roomtour." />
        <div className="relative mt-12 grid gap-6 md:grid-cols-4">
          <span aria-hidden className="absolute left-0 right-0 top-6 hidden h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-indigo-200 md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="relative">
              <div>
                <span className={`relative grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ${s.color}`}>
                  <Icon name={s.icon} />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Schritt {i + 1}</p>
                <h3 className="mt-1 font-heading text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
