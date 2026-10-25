"use client";

import { useEffect, useState } from "react";

/**
 * Short intro: the wordmark and a counter on algae green, then the panel
 * lifts like a curtain. Sets <html class="is-ready"> when the page is
 * revealed, which starts the hero animations.
 */
export default function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      html.classList.add("is-ready");
      setGone(true);
      return;
    }
    const can = new Image();
    can.src = "/can/spiruli.webp";
    const loaded = can.decode().catch(() => undefined);
    const t0 = performance.now();
    let raf = 0;
    let ready = false;
    loaded.then(() => (ready = true));
    const step = (t: number) => {
      // Run to 85 on time alone; the last stretch waits for the can image.
      const k = Math.min(1, (t - t0) / 1100);
      const v = ready ? Math.min(100, Math.round(85 * k + 15 * Math.min(1, (t - t0) / 1300))) : Math.round(85 * k);
      setN(v);
      if (v >= 100) {
        setDone(true);
        html.classList.add("is-ready");
        window.setTimeout(() => setGone(true), 1000);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;
  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-algae-deep p-6 text-mist transition-[clip-path] duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] sm:p-10 ${
        done ? "[clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0_0_0_0)]"
      }`}
    >
      <p className="label text-fresh">Der Balancer · Made in Germany</p>
      <div className="flex items-end justify-between gap-6">
        <p className="headline text-[18vw] leading-[0.8] sm:text-[13vw]">Spiruli</p>
        <p className="font-display text-5xl font-extrabold tabular-nums text-fresh sm:text-7xl">{n}</p>
      </div>
      <div className="h-px w-full bg-mist/15">
        <div className="h-full origin-left bg-fresh" style={{ transform: `scaleX(${n / 100})` }} />
      </div>
    </div>
  );
}
