const items = [
  "Boutique Hotels",
  "Fine Dining",
  "Dental Clinics",
  "Luxury Rentals",
  "Salons & Spas",
  "Real Estate",
  "Fitness Studios",
  "Private Clinics",
];

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-navy-900/40 py-6 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-14 motion-reduce:animate-none">
        {[...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-14 whitespace-nowrap font-serif text-2xl italic text-white/40">
            {it}
            <span className="text-sm not-italic text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
