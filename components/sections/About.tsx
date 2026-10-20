"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Monogram } from "@/components/brand/Logo";
import Icon from "@/components/ui/Icon";
import Reveal, { SectionHead } from "@/components/ui/Reveal";
import { pillars } from "@/lib/content";
import { site, telHref } from "@/lib/site";

export default function About() {
  return (
    <section id="vision" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <SectionHead
            eyebrow="Über uns"
            title={
              <>
                Zwei Gründer, <span className="text-gold">ein Ziel.</span>
              </>
            }
            lead="F&D Solutions sind Florian Dressler und Davy Stubenrauch aus München. Wir helfen kleinen und mittleren Unternehmen dabei, online einen guten Eindruck zu machen: mit mehr Google-Bewertungen, einer modernen Website und Rundgängen, die Räume zeigen, wie sie wirklich sind. Ehrlich beraten, fair bepreist."
          />
          <Reveal delay={0.2}>
            <FounderCard />
          </Reveal>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={0.1 * i} className="glass rim group p-7 transition duration-500 hover:-translate-y-1">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition group-hover:scale-110">
                <Icon name={p.icon} />
              </span>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The business card from the brand assets, rebuilt as a tilting, glossy object. */
function FounderCard() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 150, damping: 18 });
  const glare = useTransform([mx, my] as const, ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.14), transparent 45%)`);

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div style={{ perspective: 1200 }} className="mx-auto max-w-xl">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative aspect-[1.66] w-full overflow-hidden rounded-2xl border border-gold/25 bg-[#1f2633] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)]"
      >
        <div aria-hidden className="card-texture absolute inset-0" />
        <motion.div aria-hidden className="absolute inset-0" style={{ background: glare }} />
        <div className="relative flex h-full flex-col items-center justify-center px-[6%] text-center" style={{ transform: "translateZ(40px)" }}>
          <Monogram className="h-[19%] w-auto" />
          <span className="font-display text-[clamp(0.9rem,3.2vw,1.6rem)] tracking-[0.12em] text-gold">SOLUTIONS</span>
          <span className="mt-[2%] h-px w-[86%] bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="mt-[3%] grid w-full grid-cols-2 divide-x divide-gold/50">
            {site.founders.map((f) => (
              <div key={f.name} className="px-2">
                <p className="font-serif text-[clamp(0.95rem,3.3vw,1.6rem)] font-semibold leading-tight text-white">{f.name}</p>
                <p className="font-serif text-[clamp(0.75rem,2.4vw,1.15rem)] text-gold">{f.role}</p>
                <a href={telHref(f.phone)} className="mt-[4%] inline-flex items-center gap-1.5 text-[clamp(0.65rem,2.1vw,0.95rem)] text-white/85 hover:text-gold-soft">
                  <Icon name="phone" className="h-3.5 w-3.5" /> {f.phone}
                </a>
              </div>
            ))}
          </div>
          <a href={`mailto:${site.email}`} className="mt-[3%] inline-flex items-center gap-2 text-[clamp(0.7rem,2.2vw,1rem)] text-white/85 hover:text-gold-soft">
            <Icon name="mail" className="h-4 w-4" /> {site.email}
          </a>
          <span className="mt-1 inline-flex items-center gap-2 text-[clamp(0.7rem,2.2vw,1rem)] text-white/70">
            <Icon name="pin" className="h-4 w-4" /> {site.city}
          </span>
        </div>
      </motion.div>
      <p className="mt-6 text-center text-sm text-white/45">Ihre Ansprechpartner: persönlich, direkt, verbindlich.</p>
    </div>
  );
}
