import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-algae-deep text-mist/60">
      <div className="wrap flex flex-col justify-between gap-4 py-10 text-sm md:flex-row md:items-center">
        <p className="font-display font-extrabold tracking-[0.18em] text-mist">SPIRULI®</p>
        <p>Der Balancer · Made in Germany · PZN {site.pzn}</p>
        <nav className="flex gap-6">
          {/* Placeholders: link the legal pages before launch. */}
          <a href="#" className="hover:text-mist">Impressum</a>
          <a href="#" className="hover:text-mist">Datenschutz</a>
          <a href={`mailto:${site.email}`} className="hover:text-mist">Kontakt</a>
        </nav>
      </div>
    </footer>
  );
}
