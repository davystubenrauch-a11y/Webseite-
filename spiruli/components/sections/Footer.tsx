import Logo from "@/components/ui/Logo";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-sand-300/80 bg-sand">
      <div className="container-page py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Logo />
          <p className="text-sm text-muted">Vegan · Fermentiert · PZN {site.pzn}</p>
          <nav className="flex gap-6 text-sm font-medium text-petrol-900/75">
            {/* Placeholders: link the legal pages before launch. */}
            <a href="#" className="hover:text-petrol">Impressum</a>
            <a href="#" className="hover:text-petrol">Datenschutz</a>
            <a href={`mailto:${site.email}`} className="hover:text-petrol">Kontakt</a>
          </nav>
        </div>
        <p className="mt-8 border-t border-sand-300/80 pt-6 text-xs leading-relaxed text-muted">
          © {new Date().getFullYear()} SPIRULI®. Funktionelle Getränke sind kein Ersatz für eine ausgewogene, abwechslungsreiche Ernährung und eine
          gesunde Lebensweise.
        </p>
      </div>
    </footer>
  );
}
