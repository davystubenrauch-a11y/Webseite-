import { useId } from "react";

/** Hand-drawn style ingredient illustrations, outlined in ink like a label print. */
type P = { className?: string };
const ink = "#12343F";

export function Lemon({ className }: P) {
  const segs = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <circle cx="60" cy="60" r="54" fill="#F2A91B" stroke={ink} strokeWidth="4" />
      <circle cx="60" cy="60" r="44" fill="#FFF0C4" stroke={ink} strokeWidth="2.5" />
      {segs.map((a) => (
        <path
          key={a}
          d={`M60 60 L${60 + Math.cos(a - 0.3) * 38} ${60 + Math.sin(a - 0.3) * 38} A38 38 0 0 1 ${60 + Math.cos(a + 0.3) * 38} ${60 + Math.sin(a + 0.3) * 38} Z`}
          fill="#FFD25A"
          stroke={ink}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ))}
      <circle cx="60" cy="60" r="5" fill="#FFF0C4" stroke={ink} strokeWidth="2" />
    </svg>
  );
}

export function Berries({ className }: P) {
  const dots: [number, number, number][] = [
    [40, 70, 13], [62, 66, 14], [84, 72, 12], [50, 92, 12], [73, 91, 13], [62, 112, 11], [30, 94, 10], [94, 94, 10],
  ];
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden>
      <path d="M60 8 C60 30 60 40 62 52 M60 30 C48 40 42 50 40 58 M60 34 C74 44 82 52 84 60" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d="M60 14 C76 4 96 8 104 20 C88 26 72 24 60 14Z" fill="#7BB84A" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      {dots.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#5B2E6E" stroke={ink} strokeWidth="3.5" />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.22} fill="#ECDFF3" />
        </g>
      ))}
    </svg>
  );
}

export function Spiral({ className }: P) {
  // Spirulina: a helical filament.
  let d = "M10 60";
  for (let x = 10; x <= 110; x += 2.5) d += ` L${x} ${60 + Math.sin(x / 6) * 22}`;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <path d={d} fill="none" stroke={ink} strokeWidth="13" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#2F8A4E" strokeWidth="7" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#A8CF3F" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 9" />
    </svg>
  );
}

export function Leaf({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <path d="M18 102 C18 50 52 18 104 16 C104 70 72 102 18 102Z" fill="#7BB84A" stroke={ink} strokeWidth="4" strokeLinejoin="round" />
      <path d="M18 102 C44 76 66 54 92 30 M48 74 L42 52 M62 60 L74 64 M70 50 L64 34" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Bubbles({ className }: P) {
  const b: [number, number, number][] = [[36, 88, 18], [74, 62, 13], [50, 40, 9], [88, 30, 7], [82, 96, 10], [24, 50, 6]];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      {b.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#FBF7EE" stroke={ink} strokeWidth="3.5" />
          <path d={`M${x - r * 0.5} ${y - r * 0.1} A${r * 0.55} ${r * 0.55} 0 0 1 ${x - r * 0.05} ${y - r * 0.55}`} fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/** Curvy section edge, filled with the colour of the section below. */
export function Wave({ fill, className = "", flip = false }: { fill: string; className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={`block h-10 w-full sm:h-16 ${flip ? "rotate-180" : ""} ${className}`} aria-hidden>
      <path d="M0 40 C180 80 360 0 540 30 C720 60 900 80 1080 40 C1260 0 1350 20 1440 36 L1440 80 L0 80Z" fill={fill} />
    </svg>
  );
}

/** Rotating round sticker with text on a circle. */
export function Stamp({ text, className = "", children }: { text: string; className?: string; children?: React.ReactNode }) {
  const id = useId();
  return (
    <div className={`relative grid aspect-square place-items-center rounded-full border-2 border-ink bg-cream ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
        <defs>
          <path id={id} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text fill="#12343F" fontSize="17" fontWeight="700" letterSpacing="3.2">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
