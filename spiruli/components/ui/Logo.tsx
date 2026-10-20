export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#hero" className={`group inline-flex items-baseline gap-0.5 font-display text-xl font-light tracking-[0.32em] text-white ${className}`} aria-label="SPIRULI – zum Seitenanfang">
      <span className="transition-colors duration-500 group-hover:text-gold-soft">SPIRULI</span>
      <sup className="text-[10px] tracking-normal text-gold">®</sup>
    </a>
  );
}
