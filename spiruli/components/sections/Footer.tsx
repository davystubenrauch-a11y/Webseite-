import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-petrol-night text-cream/70">
      <div className="wrap flex flex-col justify-between gap-4 py-10 text-sm md:flex-row md:items-center">
        <p className="font-display tracking-[0.25em] text-cream">SPIRULI®</p>
        <p>Der Balancer · Made in Germany · PZN {site.pzn}</p>
        <nav className="flex gap-6">
          {/* Placeholders: link the legal pages before launch. */}
          <a href="#" className="hover:text-cream">Impressum</a>
          <a href="#" className="hover:text-cream">Datenschutz</a>
          <a href={`mailto:${site.email}`} className="hover:text-cream">Kontakt</a>
        </nav>
      </div>
    </footer>
  );
}
