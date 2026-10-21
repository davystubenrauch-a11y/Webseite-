"use client";

import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { configStore } from "@/lib/configStore";
import { services } from "@/lib/content";
import type { ServiceId } from "@/lib/pricing";
import Panel from "./Panel";

const inquire = (id: ServiceId) => {
  const cur = configStore.get().inquiryServices;
  if (!cur.includes(id)) configStore.set({ inquiryServices: [...cur, id] });
};

/** Small static picture of the disc for the NFC tile. */
function DiscArt() {
  return (
    <div className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full bg-white shadow-soft sm:h-40 sm:w-40">
      <div className="nfc-ring absolute inset-2.5 rounded-full" />
      <div className="text-center text-[#202124]">
        <p className="text-[7px] font-bold tracking-[0.3em]">TAP HERE</p>
        <p className="mt-1 text-xl font-medium tracking-tight">
          <span className="text-google-blue">G</span>
          <span className="text-google-red">o</span>
          <span className="text-google-yellow">o</span>
          <span className="text-google-blue">g</span>
          <span className="text-google-green">l</span>
          <span className="text-google-red">e</span>
        </p>
        <p className="text-[9px] tracking-[0.15em] text-google-yellow">★★★★★</p>
      </div>
    </div>
  );
}

const icons: Record<ServiceId, string> = { nfc: "nfc", web: "web", roomtour: "roomtour" };

/** Services as a bento grid: the NFC disc wide on top, website and roomtour side by side. */
export default function ServiceTiles() {
  const [nfc, web, tour] = services;
  return (
    <Panel id="leistungen" title="Drei Leistungen aus einer Hand." lead="Einzeln oder als Paket, immer mit denselben Ansprechpartnern.">
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal className="card card-hover flex flex-col gap-8 bg-sage-pale p-7 sm:flex-row sm:items-center sm:p-10 md:col-span-2">
          <div className="flex-1">
            <Tile s={nfc} />
          </div>
          <DiscArt />
        </Reveal>
        {[web, tour].map((s, i) => (
          <Reveal key={s.id} delay={0.06 * (i + 1)} className="card card-hover bg-white/80 p-7 sm:p-10">
            <Tile s={s} />
          </Reveal>
        ))}
      </div>
    </Panel>
  );
}

function Tile({ s }: { s: (typeof services)[number] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-paper">
          <Icon name={icons[s.id]} />
        </span>
        <span className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-ink">{s.price}</span>
      </div>
      <h3 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-ink">{s.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{s.text}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {s.features.map((f) => (
          <li key={f} className="rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-ink-soft ring-1 ring-inset ring-line">
            {f}
          </li>
        ))}
      </ul>
      <a href="#anfrage" onClick={() => inquire(s.id)} className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink">
        Anfragen
        <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
      </a>
    </div>
  );
}
