"use client";

import { useEffect, useState } from "react";
import { sections } from "./sections";

/** Id of the section currently crossing the middle of the viewport. */
export function useActiveSection() {
  const [active, setActive] = useState<string>(sections[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}
