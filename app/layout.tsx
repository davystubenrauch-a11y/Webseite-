import type { Metadata, Viewport } from "next";
import { display, sans, serif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.foav.de"),
  title: "FOAV – Focus on Aesthetic Value · Websites, KI-Videos und NFC-Platten aus München",
  description:
    "FOAV (Focus on Aesthetic Value) aus München: Websites ab 399 €, KI-Werbevideos ab 199 €, Renderings von Umbau und Sanierung ab 49 € und NFC-Platten für Google-Bewertungen ab 14,90 €. Festpreis, Antwort innerhalb von 24 Stunden.",
  openGraph: {
    title: "FOAV – Focus on Aesthetic Value",
    description: "Websites, KI-Werbevideos, Renderings und NFC-Platten für Google-Bewertungen. Persönlich aus München, zum Festpreis.",
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
