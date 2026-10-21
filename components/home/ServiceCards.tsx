"use client";

import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { configStore } from "@/lib/configStore";
import type { ServiceId } from "@/lib/pricing";

const inquire = (id: ServiceId) => {
  const cur = configStore.get().inquiryServices;
  if (!cur.includes(id)) configStore.set({ inquiryServices: [...cur, id] });
};

/** Static illustration: review disc with a phone leaning on it. */
function NfcArt() {
  return (
    <div className="relative">
      <div className="relative grid h-36 w-36 place-items-center rounded-full bg-white shadow-[0_20px_40px_-20px_rgba(6,95,70,0.5)]">
        <div className="nfc-ring absolute inset-2 rounded-full" />
        <div className="text-center">
          <p className="text-[7px] font-bold tracking-[0.3em] text-slate-700">TAP HERE</p>
          <p className="mt-1 text-lg font-medium tracking-tight">
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
      <div className="absolute -right-10 top-4 h-28 w-14 rotate-12 rounded-[14px] border-[3px] border-slate-800 bg-white p-1 shadow-xl">
        <div className="h-full rounded-[9px] bg-slate-50 p-1">
          <div className="h-1.5 w-6 rounded bg-slate-300" />
          <p className="mt-2 text-center text-[6px] text-google-yellow">★★★★★</p>
          <div className="mx-auto mt-1 h-1 w-8 rounded bg-blue-500" />
        </div>
      </div>
    </div>
  );
}

/** Static illustration: a small modern website in a browser frame. */
function WebArt() {
  return (
    <div className="w-60 overflow-hidden rounded-xl bg-white shadow-[0_20px_40px_-20px_rgba(30,64,175,0.5)]">
      <div className="flex gap-1 bg-slate-100 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <div className="p-3">
        <div className="rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-3">
          <div className="h-2.5 w-24 rounded bg-white/90" />
          <div className="mt-1.5 h-2.5 w-16 rounded bg-white/60" />
          <div className="mt-3 h-4 w-14 rounded-full bg-amber-400" />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {["bg-emerald-200", "bg-blue-200", "bg-amber-200"].map((c) => (
            <div key={c} className="rounded-md border border-slate-100 p-1.5">
              <div className={`h-3 w-3 rounded ${c}`} />
              <div className="mt-1 h-1 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Static illustration: an isometric room with a 360° marker. */
function RoomArt() {
  return (
    <svg viewBox="0 -30 240 190" className="h-44 w-auto drop-shadow-[0_20px_25px_rgba(146,64,14,0.25)]" aria-hidden>
      <polygon points="120,150 20,95 120,40 220,95" fill="#fde7c4" />
      <polygon points="20,95 20,30 120,-25 120,40" fill="#ffffff" />
      <polygon points="120,40 120,-25 220,30 220,95" fill="#f1f5f9" />
      <polygon points="150,20 150,0 190,22 190,42" fill="#bae6fd" />
      <polygon points="58,96 58,82 98,60 98,74" fill="#475569" />
      <polygon points="58,96 98,74 122,87 82,109" fill="#64748b" />
      <polygon points="82,109 122,87 122,100 82,122" fill="#334155" />
      <ellipse cx="140" cy="108" rx="22" ry="11" fill="#c8a27a" />
      <rect x="138" y="108" width="4" height="12" fill="#1e293b" />
      <circle cx="50" cy="70" r="12" fill="#22c55e" />
      <rect x="45" y="78" width="10" height="14" rx="2" fill="#ffffff" />
      <circle cx="175" cy="70" r="16" fill="#f59e0b" />
      <text x="175" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="sans-serif">
        360°
      </text>
    </svg>
  );
}

const cards: {
  id: ServiceId;
  title: string;
  price: string;
  text: string;
  points: string[];
  art: () => React.ReactElement;
  panel: string;
  accent: string;
  button: string;
}[] = [
  {
    id: "nfc",
    title: "NFC Google Review Disc",
    price: "Weiß oder Schwarz",
    text: "Handy an die Platte halten, schon öffnet sich Ihre Google-Bewertung. Mehr Bewertungen, ganz ohne Aufwand.",
    points: ["Ø 10 cm, aus Acryl", "Mit Ihrem Firmennamen", "Keine App nötig"],
    art: NfcArt,
    panel: "bg-gradient-to-br from-emerald-100 to-teal-50",
    accent: "text-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    id: "web",
    title: "Webseiten-Erstellung",
    price: "ab 300 €",
    text: "Eine moderne Website, die auf jedem Gerät gut aussieht, schnell lädt und Kunden überzeugt.",
    points: ["Individuelles Design", "Für Handy optimiert", "Impressum & Datenschutz"],
    art: WebArt,
    panel: "bg-gradient-to-br from-blue-100 to-indigo-50",
    accent: "text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  {
    id: "roomtour",
    title: "Roomtour & 360°-Rundgang",
    price: "ab 300 €",
    text: "Virtuelle Rundgänge und Videos für Immobilien, Ferienwohnungen, Hotels und Gewerbe.",
    points: ["360°-Rundgang", "Walkthrough-Video", "Für Website & Portale"],
    art: RoomArt,
    panel: "bg-gradient-to-br from-amber-100 to-orange-50",
    accent: "text-amber-700",
    button: "bg-amber-500 hover:bg-amber-600",
  },
];

/** The three services as equal, colour-coded cards. */
export default function ServiceCards() {
  return (
    <section id="leistungen" className="bg-white px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Leistungen" title="Drei Leistungen, ein Ziel: mehr Kunden." lead="Einzeln oder als Paket. Sie bekommen alles aus einer Hand und haben immer denselben Ansprechpartner." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08} className="card flex flex-col overflow-hidden">
              <div className={`grid h-56 place-items-center ${c.panel}`}>
                <c.art />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <p className={`text-sm font-bold ${c.accent}`}>{c.price}</p>
                <h3 className="mt-1 font-heading text-xl font-bold text-slate-900">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.text}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <Icon name="check" className={`h-4 w-4 shrink-0 ${c.accent}`} />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href="#anfrage"
                  onClick={() => inquire(c.id)}
                  className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition ${c.button}`}
                >
                  Anfragen <Icon name="arrow" className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
