"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { onFrame } from "@/lib/ticker";

/** Inertial page scrolling (and smooth in-page anchor jumps); off for reduced motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
    const stop = onFrame(null, (t) => lenis.raf(t));
    return () => {
      stop();
      lenis.destroy();
    };
  }, []);
  return null;
}
