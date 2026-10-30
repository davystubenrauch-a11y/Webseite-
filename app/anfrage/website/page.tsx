import type { Metadata } from "next";
import WebsiteBriefing from "@/components/forms/WebsiteBriefing";

export const metadata: Metadata = {
  title: "Website-Fragebogen | FOAV",
  description: "Beschreiben Sie Ihre Wunsch-Website in fünf Minuten. Festpreis innerhalb von 24 Stunden, fertig in bis zu 7 Tagen.",
  alternates: { canonical: "https://foav.de/anfrage/website" },
};

export default function Page() {
  return <WebsiteBriefing />;
}
