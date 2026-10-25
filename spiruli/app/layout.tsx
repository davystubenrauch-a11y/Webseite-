import type { Metadata, Viewport } from "next";
import { archivo, display } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPIRULI® – Der Balancer",
  description:
    "Das vegane & natürliche Mehrwertgetränk mit natürlichen B-Vitaminen und essentiellen Aminosäuren. Fermentierte Holunder-Zitrus-Algen-Basis. In der Apotheke: PZN 11110571.",
  openGraph: {
    title: "SPIRULI® – Der Balancer",
    description: "Das vegane & natürliche Mehrwertgetränk mit natürlichen B-Vitaminen und essentiellen Aminosäuren.",
    type: "website",
    images: ["/spiruli-can.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A3134",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${archivo.variable} ${display.variable}`}>
      <head>
        {/* The can's label and studio light are needed first. */}
        <link rel="preload" as="image" href="/can/frame-000.webp" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
