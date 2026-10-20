import Logo from "@/components/ui/Logo";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-petrol-950">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <p aria-hidden className="select-none text-center font-display text-[17vw] font-extralight leading-none tracking-[0.08em] text-outline lg:text-[15vw]">
          SPIRULI
        </p>
        <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 text-sm text-white/45 md:flex-row md:items-center">
          <Logo />
          <p>Vegan · Fermentiert · PZN {site.pzn}</p>
          <nav className="flex gap-6">
            {/* Placeholders: link the legal pages before launch. */}
            <a href="#" className="hover:text-gold">Impressum</a>
            <a href="#" className="hover:text-gold">Datenschutz</a>
            <a href={`mailto:${site.email}`} className="hover:text-gold">Kontakt</a>
          </nav>
        </div>
        <p className="mt-6 text-xs text-white/30">
          © {new Date().getFullYear()} SPIRULI®. Nahrungsergänzungen und funktionelle Getränke sind kein Ersatz für eine ausgewogene, abwechslungsreiche Ernährung und
          eine gesunde Lebensweise.
        </p>
      </div>
    </footer>
  );
}
