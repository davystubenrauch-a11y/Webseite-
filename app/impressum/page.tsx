import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Impressum | F&D Solutions", robots: { index: false } };

// TODO before going live: complete the address in lib/site.ts and check legal form / tax IDs.
export default function Impressum() {
  return (
    <LegalPage title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {site.address.map((l) => (
          <span key={l} className="block">{l}</span>
        ))}
      </p>
      <h2>Vertreten durch</h2>
      <p>{site.founders.map((f) => f.name).join(" und ")}</p>
      <h2>Kontakt</h2>
      <p>
        {site.founders.map((f) => (
          <span key={f.name} className="block">Telefon: {f.phone} ({f.name})</span>
        ))}
        <span className="block">E-Mail: {site.email}</span>
      </p>
      <h2>Umsatzsteuer-ID</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [falls vorhanden ergänzen]</p>
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>{site.founders[0].name}, Anschrift wie oben</p>
      <h2>EU-Streitschlichtung</h2>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>
      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Für Inhalte externer
        Links übernehmen wir keine Haftung; für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
      </p>
      <p className="note">Google und das Google-Logo sind Marken der Google LLC. F&amp;D Solutions steht in keiner Verbindung zu Google.</p>
    </LegalPage>
  );
}
