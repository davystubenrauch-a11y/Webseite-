import type { Metadata, Viewport } from "next";
import { archivo, display } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPIRULI® – Natürliche Energie",
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
  themeColor: "#1E6B3B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${archivo.variable} ${display.variable}`}>
      <head>
        {/* The can's front frame is the first thing on screen. */}
        <link rel="preload" as="image" href="/can/frame-000.webp" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
