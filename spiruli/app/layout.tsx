import type { Metadata, Viewport } from "next";
import { display, sans, serif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPIRULI® – Der Balancer",
  description:
    "Das vegane & natürliche Mehrwertgetränk mit Spirulina, Holunder und Zitrone. Spritzig, leicht, Made in Germany. In der Apotheke: PZN 11110571.",
  openGraph: {
    title: "SPIRULI® – Der Balancer",
    description: "Spritzig, leicht und vegan – mit Holunder, Zitrone und der Mikroalge Spirulina.",
    type: "website",
    images: ["/media/poster.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#214043",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <head>
        <link rel="preload" as="image" href="/media/poster.jpg" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
