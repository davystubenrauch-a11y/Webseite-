export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#hero" className={`group inline-flex items-center gap-3 ${className}`} aria-label="f&d solutions home">
      <span className="relative grid h-10 w-10 place-items-center rounded-full border border-gold/50 bg-navy-800 text-gold shadow-rim transition group-hover:shadow-rim-lg">
        {/* NFC emblem */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="6" cy="12" r="1.6" fill="currentColor" />
          <path d="M10 8a6 6 0 0 1 0 8M14 5a10 10 0 0 1 0 14M18 2.5a14 14 0 0 1 0 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-serif text-2xl font-semibold italic text-gold">f&amp;d</span>
        <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.45em] text-white/70">solutions</span>
      </span>
    </a>
  );
}
