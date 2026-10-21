import { Cinzel, Cormorant_Garamond, Manrope } from "next/font/google";

/** Serif used only for the F&D monogram (and the name on the disc artwork). */
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
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

/** Manrope for headlines and body text. */
export const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
