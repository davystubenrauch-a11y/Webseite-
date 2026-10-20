import type { Metadata, Viewport } from "next";
import { serif, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "f&d solutions — Smart Review Cards, Websites & Airbnb Walkthroughs",
  description:
    "Elite agency for smart NFC Google review cards, high-converting custom websites and immersive Airbnb property walkthroughs.",
  openGraph: {
    title: "f&d solutions",
    description: "Elevate your online reputation & digital presence.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F141C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
