import type { Metadata, Viewport } from "next";
import { display, hand, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPIRULI® – Natürliche Energie aus Holunder, Zitrus & Algen",
  description:
    "Das vegane & natürliche Mehrwertgetränk mit natürlichen B-Vitaminen und essentiellen Aminosäuren. Fermentierte Holunder-Zitrus-Algen-Basis. In der Apotheke: PZN 11110571.",
  openGraph: {
    title: "SPIRULI® – Natürliche Energie",
    description: "Das vegane & natürliche Mehrwertgetränk mit natürlichen B-Vitaminen und essentiellen Aminosäuren.",
    type: "website",
    images: ["/spiruli-can.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#D4EE6F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${sans.variable} ${hand.variable} ${display.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
