import type { Metadata } from "next";
import RoomtourBriefing from "@/components/forms/RoomtourBriefing";

export const metadata: Metadata = {
  title: "Roomtour beauftragen | FOAV",
  description: "Fotos Raum für Raum hochladen und eine KI-Roomtour erhalten. 300 € bis 150 m², fertig in bis zu 48 Stunden.",
  alternates: { canonical: "https://foav.de/anfrage/roomtour" },
};

export default function Page() {
  return <RoomtourBriefing />;
}
