import type { Metadata, Viewport } from "next";
import { display, sans, serif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "F&D Solutions | NFC Review Cards, High-End Websites & KI-Roomtours aus München",
  description:
    "F&D Solutions aus München: smarte NFC Google-Bewertungskarten und Aufsteller, maßgeschneiderte High-End-Websites und KI-gestützte 3D-Roomtours für Immobilien, Hotels und Gewerbe.",
  openGraph: {
    title: "F&D Solutions",
    description: "Vertrauen, automatisiert. Zukunft, gebaut.",
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
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
