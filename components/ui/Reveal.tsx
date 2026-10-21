"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

/** Soft fade-in as the element scrolls into view. */
export default function Reveal({
  delay = 0,
  y = 18,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Section heading: eyebrow, serif title and optional lead, always left-aligned. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  dark = false,
  className = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <span className={`eyebrow ${dark ? "!text-paper/60" : ""}`}>{eyebrow}</span>
      <h2 className={`section-title mt-6 ${dark ? "!text-paper" : ""}`}>{title}</h2>
      {lead && <p className={`mt-6 max-w-xl text-base leading-[1.75] sm:text-lg ${dark ? "text-paper/65" : "text-ink-muted"}`}>{lead}</p>}
    </Reveal>
  );
}
