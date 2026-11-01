import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Danke für Ihre Bestellung | foav.de", robots: { index: false } };

export default function Danke() {
  return (
    <LegalPage title="Danke für Ihre Bestellung.">
      <p>Ihre Zahlung ist eingegangen, und Sie bekommen gleich eine Bestätigung per E-Mail.</p>
      <h2>So geht es weiter</h2>
      <p>
        <b>NFC-Platten:</b> Wir verknüpfen jede Platte mit Ihrem Google-Profil und schicken sie Ihnen per Post.
      </p>
      <p>
        <b>KI-Roomtour:</b> Laden Sie jetzt die Fotos Ihrer Räume hoch. 48 Stunden danach bekommen Sie Ihr Video.{" "}
        <a href="/anfrage/roomtour">Fotos hochladen</a>
      </p>
      <p>Fragen? Rufen Sie uns an oder antworten Sie einfach auf die Bestätigungs-E-Mail.</p>
    </LegalPage>
  );
}
