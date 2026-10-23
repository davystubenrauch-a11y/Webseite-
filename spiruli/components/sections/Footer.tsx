import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative z-40 bg-algae-deep text-lime">
      <div className="wrap flex flex-col justify-between gap-4 py-8 md:flex-row md:items-center">
        <p className="micro">SPIRULI® · Vegan · Fermentiert · PZN {site.pzn}</p>
        <nav className="micro flex gap-5">
          {/* Placeholders: link the legal pages before launch. */}
          <a href="#" className="hover:underline">Impressum</a>
          <a href="#" className="hover:underline">Datenschutz</a>
          <a href={`mailto:${site.email}`} className="hover:underline">Kontakt</a>
        </nav>
      </div>
      <p className="wrap micro pb-8 !text-[0.6rem] text-lime/60">
        Funktionelle Getränke sind kein Ersatz für eine ausgewogene, abwechslungsreiche Ernährung und eine gesunde Lebensweise.
      </p>
    </footer>
  );
}
