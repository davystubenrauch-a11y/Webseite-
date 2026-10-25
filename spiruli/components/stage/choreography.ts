"use client";

import { useEffect, useRef } from "react";

/**
 * Pose of the can for a section, read from its data-can attribute.
 * x, y: position as a fraction of the half viewport (y up), s: scale,
 * ry / rx / rz: rotation in radians (spin, pitch, roll), o: opacity.
 */
/**
 * Pose of the can for a section, read from its data-can attribute.
 * x, y: position as a fraction of the half viewport (y up), s: scale,
 * ry / rx / rz: rotation in radians (spin, pitch, roll), o: opacity.
 */
export type Pose = { x: number; y: number; s: number; ry: number; rx: number; rz: number; o: number };
export const ZERO: Pose = { x: 0, y: 0, s: 1, ry: 0, rx: 0, rz: 0, o: 1 };
export const KEYS = ["x", "y", "s", "ry", "rx", "rz", "o"] as const;

const ease = (t: number) => t * t * (3 - 2 * t);

/** Collects section anchors and turns the scroll position into a target pose. */
export function useChoreography() {
  const target = useRef<Pose>({ ...ZERO, y: 1.6 });

  useEffect(() => {
    let anchors: { top: number; pose: Pose }[] = [];
    const measure = () => {
      const mobile = window.innerWidth < 768;
      anchors = [...document.querySelectorAll<HTMLElement>("[data-can]")].map((el) => {
        const p = { ...ZERO, ...JSON.parse(el.dataset.can!) } as Pose;
        // Narrow screens: the hero's centred poses sit higher and smaller above
        // the text; side poses (content sections) fade out so nothing is covered.
        if (mobile) {
          if (Math.abs(p.x) >= 0.4) Object.assign(p, { x: Math.sign(p.x) * 1.2, y: 0.6, s: p.s * 0.55, o: 0 });
          else Object.assign(p, { x: 0, y: p.y + 0.3, s: p.s * 0.62 });
        }
        return { top: el.getBoundingClientRect().top + window.scrollY, pose: p };
      });
      update();
    };
    const update = () => {
      if (!anchors.length) return;
      const y = window.scrollY;
      let i = 0;
      while (i < anchors.length - 1 && y >= anchors[i + 1].top) i++;
      const a = anchors[i];
      const b = anchors[Math.min(i + 1, anchors.length - 1)];
      const span = b.top - a.top;
      const t = span > 0 ? ease(Math.min(1, Math.max(0, (y - a.top) / span))) : 0;
      for (const k of KEYS) target.current[k] = a.pose[k] + (b.pose[k] - a.pose[k]) * t;
    };

    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    document.fonts?.ready.then(measure);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  return target;
}

