export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`inline-flex items-baseline gap-0.5 font-display text-2xl font-semibold tracking-[0.16em] text-ink ${className}`} aria-label="SPIRULI – zum Seitenanfang">
      SPIRULI
      <sup className="text-xs tracking-normal">®</sup>
    </a>
  );
}
