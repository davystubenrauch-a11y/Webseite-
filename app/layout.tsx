import type { Metadata, Viewport } from "next";
import { display, sans, serif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://foav.de"),
  title: "FOAV · Websites, KI-Shots und NFC-Platten aus München",
  description:
    "FOAV aus München: Websites ab 399 €, KI-Shots (Studio-Fotos und Werbeclips aus Handyfotos) ab 199 € und NFC-Platten für Google-Bewertungen ab 14,90 €. Festpreis, Antwort innerhalb von 24 Stunden.",
  openGraph: {
    title: "FOAV",
    description: "Websites, KI-Shots und NFC-Platten für Google-Bewertungen. Persönlich aus München, zum Festpreis.",
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
        {/* Vercel Web Analytics: cookieless visitor counts, enabled in the Vercel dashboard */}
        <script defer src="/_vercel/insights/script.js" />
      </body>
    </html>
  );
}
