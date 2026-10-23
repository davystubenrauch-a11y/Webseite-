import { useId } from "react";

/**
 * Tone-on-tone botanical wallpaper: leaves, spirulina strands, elderberries
 * and lemon slices, tiled across a colour field.
 */
export default function Pattern({ color, className = "" }: { color: string; className?: string }) {
  const id = useId();
  let helix = "M0 0";
  for (let x = 0; x <= 90; x += 3) helix += ` L${x} ${Math.sin(x / 7) * 9}`;
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width="260" height="260" patternUnits="userSpaceOnUse" patternTransform="rotate(-12) scale(1.25)">
          <g fill={color} stroke={color}>
            {/* leaf */}
            <path d="M20 120 C40 70 90 50 130 52 C120 96 82 128 20 120Z" stroke="none" />
            {/* spirulina strand */}
            <path d={helix} transform="translate(150 40) rotate(28)" fill="none" strokeWidth="9" strokeLinecap="round" />
            {/* elderberries */}
            <path d="M190 150 C185 175 178 190 170 205 M190 165 C200 180 210 192 222 200" fill="none" strokeWidth="4" strokeLinecap="round" />
            {[
              [168, 212, 11], [184, 222, 12], [200, 212, 10], [222, 208, 11], [176, 236, 10], [196, 238, 11], [212, 228, 9],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} stroke="none" />
            ))}
            {/* lemon slice */}
            <g transform="translate(70 200)" stroke="none">
              <circle r="38" />
              {Array.from({ length: 8 }, (_, k) => (
                <path
                  key={k}
                  d={`M0 0 L${Math.cos((k * Math.PI) / 4 - 0.3) * 30} ${Math.sin((k * Math.PI) / 4 - 0.3) * 30} A30 30 0 0 1 ${Math.cos((k * Math.PI) / 4 + 0.3) * 30} ${Math.sin((k * Math.PI) / 4 + 0.3) * 30}Z`}
                  fill="#000"
                  opacity="0.08"
                />
              ))}
            </g>
            {/* small leaf */}
            <path d="M240 40 C230 20 236 4 252 -4 C258 14 254 30 240 40Z" stroke="none" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
