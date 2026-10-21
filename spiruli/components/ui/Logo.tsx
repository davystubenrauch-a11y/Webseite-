export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#hero" className={`inline-flex items-baseline gap-0.5 font-display text-xl font-semibold tracking-[0.18em] text-petrol ${className}`} aria-label="SPIRULI – zum Seitenanfang">
      SPIRULI
      <sup className="text-[10px] tracking-normal text-leaf-dark">®</sup>
    </a>
  );
}
