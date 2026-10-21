import { Cinzel, Inter, Playfair_Display } from "next/font/google";

/** Display serif for headlines and the F&D monogram. */
export const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

/** Roman capitals for the "SOLUTIONS" lettering, as on the business card. */
export const display = Cinzel({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-display",
  display: "swap",
});

/** Highly legible body and UI sans. */
export const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});
