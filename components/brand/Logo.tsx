import { useId } from "react";

/**
 * F&D monogram, recreated as vector after the business card:
 * high-contrast serif capitals with the ampersand tucked between F and D.
 */
export function Monogram({
  className = "",
  title = "F&D Solutions",
  tone = "navy",
}: {
  className?: string;
  title?: string;
  /** navy on light backgrounds, gold on the dark business card. */
  tone?: "navy" | "gold";
}) {
  const id = useId().replace(/:/g, "");
  const stops = tone === "gold" ? ["#8a6a2e", "#d4af37", "#f6e7b0", "#c5a059", "#9c7a35"] : ["#0f172a", "#1e293b", "#334155", "#1e293b", "#0f172a"];
  return (
    <svg viewBox="0 0 220 132" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          {[0, 0.3, 0.5, 0.72, 1].map((o, i) => (
            <stop key={o} offset={o} stopColor={stops[i]} />
          ))}
        </linearGradient>
      </defs>
      <g fill={`url(#g${id})`} style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 700 }}>
        <text x="8" y="112" fontSize="138">F</text>
        <text x="112" y="112" fontSize="138">D</text>
        <text x="78" y="112" fontSize="74" stroke={tone === "gold" ? "#1f2633" : "#f8fafc"} strokeWidth="5" paintOrder="stroke">&amp;</text>
      </g>
    </svg>
  );
}

/** Stacked lock-up: monogram over "SOLUTIONS" with a gold rule, as on the card. */
export function LogoStacked({ className = "" }: { className?: string }) {
  return (
    // The lettering scales with the container (cqw), so the lock-up keeps its proportions at any width.
    <div className={`flex flex-col items-center [container-type:inline-size] ${className}`}>
      <Monogram className="h-auto w-[78%]" />
      <span className="mt-1 whitespace-nowrap pl-[0.18em] font-display text-[12cqw] font-medium leading-none tracking-[0.18em] text-slate-700">SOLUTIONS</span>
    </div>
  );
}

/** Compact horizontal lock-up for the navigation bar. */
export function LogoInline({ className = "", href = "#top" }: { className?: string; href?: string }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-3 ${className}`} aria-label="F&D Solutions – zur Startseite">
      <Monogram className="h-9 w-auto transition-transform duration-500 group-hover:scale-105" />
      <span className="hidden border-l border-slate-300 pl-3 font-display text-[13px] font-medium tracking-[0.3em] text-slate-700 sm:block">
        SOLUTIONS
      </span>
    </a>
  );
}
