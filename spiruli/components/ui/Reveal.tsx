"use client";

import { useEffect } from "react";

/** Adds .is-in to [data-reveal] elements once they scroll into view (CSS does the motion). */
export default function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    // Start once the preloader has lifted, so the hero lines play in view.
    const start = () => document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    const html = document.documentElement;
    const mo = new MutationObserver(() => html.classList.contains("is-ready") && (mo.disconnect(), start()));
    if (html.classList.contains("is-ready")) start();
    else mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}
