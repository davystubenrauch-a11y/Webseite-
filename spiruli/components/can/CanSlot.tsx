/** Placeholder the floating can aligns to (pass its positioning in className); it keeps the can's proportions and casts a soft floor shadow. */
export default function CanSlot({ name, className = "" }: { name: "hero" | "intro"; className?: string }) {
  return (
    <div data-can-slot={name} className={`aspect-[var(--can-aspect)] ${className}`}>
      <div aria-hidden className="absolute -bottom-3 left-1/2 h-6 w-[70%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-xl" />
    </div>
  );
}
