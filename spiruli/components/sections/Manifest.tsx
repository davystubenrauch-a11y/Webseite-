"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const text =
  "SPIRULI ist das vegane & natürliche Mehrwertgetränk mit natürlichen B-Vitaminen und essentiellen Aminosäuren – fermentiert aus Holunder, Zitrus und Algen.";
const highlight: Record<string, string> = {
  "vegane": "bg-lime",
  "B-Vitaminen": "bg-citrus-soft",
  "Aminosäuren": "bg-algae-soft",
  "Holunder,": "bg-berry-soft",
  "Zitrus": "bg-citrus-soft",
  "Algen.": "bg-algae-soft",
};

/** Big statement whose words ink in as the visitor scrolls through it. */
export default function Manifest() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-cream py-24 sm:py-36">
      <div className="wrap">
        <p className="font-hand text-2xl font-bold text-algae sm:text-3xl">Was ist eigentlich SPIRULI?</p>
        <p ref={ref} className="mt-4 text-[2.1rem] font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[4.2rem]">
          {text.split(" ").map((w, i) => (
            <span key={i} data-word className="inline">
              <span className={highlight[w] ? `rounded-lg px-1.5 ${highlight[w]}` : ""}>{w}</span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
