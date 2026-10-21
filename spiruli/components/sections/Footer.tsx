import Logo from "@/components/ui/Logo";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-cream">
      <div className="wrap py-12">
        <p aria-hidden className="select-none text-center font-display text-[18vw] font-semibold leading-none tracking-[0.08em] text-ink lg:text-[14rem]">
          SPIRULI
        </p>
        <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t-2 border-ink pt-8 md:flex-row md:items-center">
          <Logo />
          <p className="font-semibold">Vegan · Fermentiert · PZN {site.pzn}</p>
          <nav className="flex gap-6 font-semibold">
            {/* Placeholders: link the legal pages before launch. */}
            <a href="#" className="hover:underline">Impressum</a>
            <a href="#" className="hover:underline">Datenschutz</a>
            <a href={`mailto:${site.email}`} className="hover:underline">Kontakt</a>
          </nav>
        </div>
        <p className="mt-6 text-sm text-ink/60">
          © {new Date().getFullYear()} SPIRULI®. Funktionelle Getränke sind kein Ersatz für eine ausgewogene, abwechslungsreiche Ernährung und eine
          gesunde Lebensweise.
        </p>
      </div>
    </footer>
  );
}
