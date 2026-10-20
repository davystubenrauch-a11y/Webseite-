import { code39 } from "@/lib/code39";

/** Code 39 PZN barcode as crisp SVG. */
export default function PznBarcode({ pzn, className }: { pzn: string; className?: string }) {
  const { bars, width } = code39(`-${pzn}`);
  return (
    <svg viewBox={`0 0 ${width} 40`} preserveAspectRatio="none" className={className} role="img" aria-label={`Barcode PZN ${pzn}`}>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={40} fill="currentColor" />
      ))}
    </svg>
  );
}
