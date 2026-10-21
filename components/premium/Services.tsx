"use client";

import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { configStore } from "@/lib/configStore";
import { services } from "@/lib/content";
import type { ServiceId } from "@/lib/pricing";

const inquire = (id: ServiceId) => {
  const cur = configStore.get().inquiryServices;
  if (!cur.includes(id)) configStore.set({ inquiryServices: [...cur, id] });
};

/** Editorial service list: one row per service on the 12-column grid. */
export default function Services() {
  return (
    <section id="leistungen" className="section border-t border-line bg-white/40">
      <div className="container-site">
        <div className="grid-12">
          <SectionHead
            className="col-span-4 sm:col-span-8 lg:col-span-7"
            eyebrow="Leistungen"
            title={
              <>
                Drei Leistungen. <em className="italic text-sage">Ein Anspruch.</em>
              </>
            }
            lead="Einzeln oder als Paket, immer aus einer Hand und mit denselben Ansprechpartnern."
          />
        </div>

        <div className="mt-20 border-t border-ink/15 lg:mt-24">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06}>
              <article className="group grid-12 gap-y-6 border-b border-ink/15 py-12 transition-colors duration-500 hover:bg-white/60 lg:py-14">
                <div className="col-span-4 sm:col-span-8 lg:col-span-4">
                  <span className="font-heading text-sm italic text-taupe">{s.index}</span>
                  <h3 className="mt-2 font-heading text-[1.85rem] font-medium leading-tight text-ink lg:text-[2.1rem]">{s.title}</h3>
                </div>
                <div className="col-span-4 sm:col-span-5 lg:col-span-5">
                  <p className="text-base leading-[1.75] text-ink-muted">{s.text}</p>
                  <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-ink-soft">
                        <span className="h-1 w-1 rounded-full bg-sage" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-4 flex flex-col justify-between gap-6 sm:col-span-3 lg:col-span-2 lg:col-start-11 lg:items-end lg:text-right">
                  <p className="text-sm text-ink-muted">
                    <span className="block text-[11px] uppercase tracking-[0.22em] text-ink-faint">{s.id === "nfc" ? "Farben" : "Preis"}</span>
                    <span className="mt-1 block font-heading text-xl text-ink">{s.price}</span>
                  </p>
                  <a href="#anfrage" onClick={() => inquire(s.id)} className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                    Anfragen
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 transition duration-300 group-hover:translate-x-1 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                      <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
