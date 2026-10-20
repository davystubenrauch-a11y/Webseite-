import { Cinzel, Cormorant_Garamond, Manrope } from "next/font/google";

/** Editorial serif for headlines and the F&D monogram. */
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

/** Roman capitals for the "SOLUTIONS" lettering, as on the business card. */
export const display = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});

/** Clean UI sans. */
export const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
