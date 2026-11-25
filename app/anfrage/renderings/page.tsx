import type { Metadata } from "next";
import RenderBriefing from "@/components/forms/RenderBriefing";

export const metadata: Metadata = {
  title: "Renderings beauftragen | FOAV",
  description: "Handyfoto hochladen, Wunsch beschreiben, bezahlen: fotorealistische Renderings von leerer Wohnung, Umbau oder Sanierung. 1 Bild 49 €, 3 Bilder 119 €, Rundgang-Film 199 €.",
  alternates: { canonical: "https://www.foav.de/anfrage/renderings" },
};

export default function Page() {
  return <RenderBriefing />;
}
