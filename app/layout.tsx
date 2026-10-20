import type { Metadata, Viewport } from "next";
import { display, sans, serif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "F&D Solutions | NFC-Bewertungsplatten, Websites & Roomtours aus München",
  description:
    "F&D Solutions aus München: smarte runde NFC Google-Bewertungsplatten, moderne Websites ab 300 € und 360°-Roomtours ab 300 € für Immobilien, Hotels und Gewerbe.",
  openGraph: {
    title: "F&D Solutions",
    description: "Google-Bewertungen per NFC, Websites ab 300 € und 360°-Roomtours aus München.",
    type: "website",
    locale: "de_DE",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
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
