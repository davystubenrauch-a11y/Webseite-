import type { Metadata } from "next";
import ShotsBriefing from "@/components/forms/ShotsBriefing";

export const metadata: Metadata = {
  title: "KI-Shots beauftragen | FOAV",
  description: "Handyfotos hochladen, Stil wählen, bezahlen: Studio-Fotos und Werbeclips für Instagram, TikTok, Website und Google. Ab 199 €, fertig in 48 bis 72 Stunden.",
  alternates: { canonical: "https://foav.de/anfrage/ki-shots" },
};

export default function Page() {
  return <ShotsBriefing />;
}
