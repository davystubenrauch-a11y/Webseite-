import type { ElementType, ReactNode } from "react";

/** Headline whose lines slide up out of a mask, one after another, when it scrolls into view. */
export default function Split({ as: Tag = "h2", lines, className = "" }: { as?: ElementType; lines: ReactNode[]; className?: string }) {
  return (
    <Tag data-reveal className={`split ${className}`}>
      {lines.map((l, i) => (
        <span key={i}>
          <span style={{ ["--i" as string]: i }}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
