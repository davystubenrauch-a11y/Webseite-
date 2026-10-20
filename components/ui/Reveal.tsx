"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

/** Butter-smooth fade/slide-in when the element scrolls into view. */
export default function Reveal({
  delay = 0,
  y = 28,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Section heading: eyebrow, serif title and optional lead paragraph. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  center = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</span>
      <h2 className="section-title mt-5">{title}</h2>
      {lead && <p className="mt-6 text-base leading-relaxed text-white/65 sm:text-lg">{lead}</p>}
    </Reveal>
  );
}
