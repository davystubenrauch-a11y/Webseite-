import type { Metadata, Viewport } from "next";
import { display, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPIRULI® – Der Balancer",
  description:
    "Das vegane Erfrischungsgetränk mit Spirulina, Holunder und Zitrone. Spritzig, leicht, Made in Germany. In der Apotheke: PZN 11110571.",
  openGraph: {
    title: "SPIRULI® – Der Balancer",
    description: "Spritzig, leicht und vegan – mit Holunder, Zitrone und der Mikroalge Spirulina.",
    type: "website",
    images: ["/spiruli-can.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#eef0ea",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="preload" as="image" href="/can/spin-00.webp" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
