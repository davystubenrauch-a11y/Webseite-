import type { Metadata } from "next";
import ShotsBriefing from "@/components/forms/ShotsBriefing";

export const metadata: Metadata = {
  title: "KI-Werbevideo beauftragen | FOAV",
  description: "Handyfotos hochladen, Stimmung wählen, bezahlen: kurze Werbefilme für Cafés, Restaurants, Läden und Immobilien. Ab 199 €, fertig in 48 bis 72 Stunden.",
  alternates: { canonical: "https://www.foav.de/anfrage/ki-shots" },
};

export default function Page() {
  return <ShotsBriefing />;
}
