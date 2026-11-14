import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Seite nicht gefunden | FOAV", robots: { index: false } };

// Shown for every address that does not exist, in the same look as the legal pages.
export default function NotFound() {
  return (
    <LegalPage title="Diese Seite gibt es nicht.">
      <p>Vielleicht hat sich die Adresse geändert. Hier geht es weiter:</p>
      <ul>
        <li><a href="/">Startseite</a></li>
        <li><a href="/websites">Websites</a></li>
        <li><a href="/ki-shots">KI-Shots</a></li>
        <li><a href="/nfc-platten">NFC-Platten</a></li>
        <li><a href="/shop">Shop</a></li>
      </ul>
    </LegalPage>
  );
}
