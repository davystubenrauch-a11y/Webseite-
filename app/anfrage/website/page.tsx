import type { Metadata } from "next";
import WebsiteBriefing from "@/components/forms/WebsiteBriefing";

export const metadata: Metadata = {
  title: "Website-Fragebogen | FOAV",
  description: "Fragebogen für Ihre Website: Angaben, Texte und Fotos senden, danach sicher online bezahlen. Fertig in bis zu 7 Tagen.",
  alternates: { canonical: "https://foav.de/anfrage/website" },
};

export default function Page() {
  return <WebsiteBriefing />;
}
