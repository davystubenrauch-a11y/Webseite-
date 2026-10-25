import { site } from "@/lib/site";

const cols = [
  {
    title: "Entdecken",
    links: [
      ["Das Getränk", "#getraenk"],
      ["Zutaten", "#zutaten"],
      ["Nährwerte", "#naehrwerte"],
      ["Fragen", "#fragen"],
    ],
  },
  {
    title: "Kaufen",
    links: [
      [`PZN ${site.pzn}`, "#kaufen"],
      ["Händleranfrage", `mailto:${site.email}`],
    ],
  },
  {
    // Placeholders: link the legal pages before launch.
    title: "Rechtliches",
    links: [
      ["Impressum", "#"],
      ["Datenschutz", "#"],
      ["Kontakt", `mailto:${site.email}`],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-algae-deep text-mist">
      <div className="wrap pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-display text-2xl font-extrabold">Der Balancer.</p>
            <p className="mt-3 max-w-xs text-mist/60">Spirulina-Erfrischungsgetränk mit Holunder und Zitrone. Vegan, Made in Germany.</p>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="label text-fresh">{c.title}</p>
              <ul className="mt-5 space-y-3 text-mist/70">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="transition-colors hover:text-mist">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p aria-hidden className="headline mt-20 select-none whitespace-nowrap text-center text-[25vw] leading-[0.75] text-mist/[0.08]">
          Spiruli
        </p>
        <div className="flex flex-col justify-between gap-2 border-t border-mist/10 py-6 text-sm text-mist/45 sm:flex-row">
          <p>© {new Date().getFullYear()} SPIRULI®. Alle Rechte vorbehalten.</p>
          <p>PZN {site.pzn} · SGS Fresenius geprüft</p>
        </div>
      </div>
    </footer>
  );
}
