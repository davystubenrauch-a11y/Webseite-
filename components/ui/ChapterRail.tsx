"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "@/lib/site";

/** Vertical chapter index that tracks the scroll story. */
export default function ChapterRail() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers = chapters.map((c, i) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(i),
      }),
    );
    const total = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      total.kill();
    };
  }, []);

  return (
    <aside className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block 2xl:right-6" aria-label="Page chapters">
      <div className="relative flex flex-col gap-5 pl-5">
        <span className="absolute left-0 top-0 h-full w-px bg-white/10" />
        <span className="absolute left-0 top-0 w-px bg-gradient-to-b from-gold to-royal" style={{ height: `${progress * 100}%` }} />
        {chapters.map((c, i) => (
          <a key={c.id} href={`#${c.id}`} className="group flex items-center gap-3">
            <span
              className={`font-serif text-sm tabular-nums transition ${i === active ? "text-gold" : "text-white/30 group-hover:text-white/70"}`}
            >
              0{i + 1}
            </span>
            <span
              className={`hidden text-[10px] font-semibold uppercase 2xl:inline tracking-[0.3em] transition-all duration-500 ${
                i === active ? "translate-x-0 text-white opacity-100" : "-translate-x-2 text-white/50 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {c.label}
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}
