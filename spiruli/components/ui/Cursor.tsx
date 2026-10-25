"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/ticker";

/**
 * Desktop pointer: a small dot that trails the mouse, swells over links and
 * buttons, and shows a word over elements with data-cursor="…". Buttons
 * (.btn) lean magnetically towards the pointer.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = dot.current!;
    el.style.display = "grid";
    document.documentElement.classList.add("has-cursor");
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let cx = x;
    let cy = y;
    let size = 14;
    let target = 14;
    let mag: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      const word = t.closest<HTMLElement>("[data-cursor]");
      const link = t.closest("a, button");
      label.current!.textContent = word?.dataset.cursor ?? "";
      target = word ? 96 : link ? 54 : 14;
      el.classList.toggle("is-link", !!link && !word);
      // Photos tilt towards the pointer.
      const tl = t.closest<HTMLElement>("[data-tilt]");
      if (tilt && tilt !== tl) tilt.style.transform = "";
      tilt = tl;
      if (tl) {
        const r = tl.getBoundingClientRect();
        const px = (x - r.left) / r.width - 0.5;
        const py = (y - r.top) / r.height - 0.5;
        tl.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
      }
      // Magnetic buttons.
      const btn = t.closest<HTMLElement>(".btn");
      if (mag && mag !== btn) mag.style.transform = "";
      mag = btn;
      if (btn) {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(x - r.left - r.width / 2) * 0.25}px, ${(y - r.top - r.height / 2) * 0.35}px)`;
      }
    };
    const leave = () => (target = 0);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    const stop = onFrame(null, () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      size += (target - size) * 0.18;
      el.style.transform = `translate3d(${cx - size / 2}px, ${cy - size / 2}px, 0)`;
      el.style.width = el.style.height = `${size}px`;
    });
    return () => {
      stop();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="cursor pointer-events-none fixed left-0 top-0 z-[90] hidden place-items-center rounded-full bg-fresh text-ink mix-blend-normal"
    >
      <span ref={label} className="label text-[0.65rem]" />
    </div>
  );
}
