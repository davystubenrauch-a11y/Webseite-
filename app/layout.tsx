import type { Metadata, Viewport } from "next";
import { display, sans, serif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://foav.de"),
  title: "FOAV · Websites, KI-Roomtours und NFC-Platten aus München",
  description:
    "FOAV aus München: Websites ab 300 €, KI-Roomtour-Videos ab 300 € und NFC-Platten für Google-Bewertungen 15 € pro Stück. Festpreis, Antwort innerhalb von 24 Stunden.",
  openGraph: {
    title: "FOAV",
    description: "Websites, KI-Roomtours und NFC-Platten für Google-Bewertungen. Persönlich aus München, zum Festpreis.",
    type: "website",
    locale: "de_DE",
  },
};

export const viewport: Viewport = {
  themeColor: "#F9F8F6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${serif.variable} ${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
