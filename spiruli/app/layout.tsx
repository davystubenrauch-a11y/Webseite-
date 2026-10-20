import type { Metadata, Viewport } from "next";
import { display, serif, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPIRULI® — Health & Vitality",
  description:
    "Das vegane & natürliche Mehrwertgetränk mit natürlichen B-Vitaminen und essentiellen Aminosäuren. Fermentierte Holunder-Zitrus-Algen-Basis.",
  openGraph: {
    title: "SPIRULI® — Health & Vitality",
    description: "Das vegane & natürliche Mehrwertgetränk mit natürlichen B-Vitaminen und essentiellen Aminosäuren.",
    type: "website",
    images: ["/spiruli-can.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1E26",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body className="font-sans">
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
