import type { Metadata } from "next";
import NfcBriefing from "@/components/forms/NfcBriefing";

export const metadata: Metadata = {
  title: "NFC-Platten mit Logo bestellen | FOAV",
  description: "NFC-Platten für Google-Bewertungen mit Ihrem Logo: Logo hochladen, Vorschau freigeben, Platten erhalten. 29,90 € pro Stück, ab 10 Stück 24,90 €.",
  alternates: { canonical: "https://foav.de/anfrage/nfc" },
};

export default function Page() {
  return <NfcBriefing />;
}
