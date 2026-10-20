import { Cormorant_Garamond, Josefin_Sans, Manrope } from "next/font/google";

/** Geometric display face, close to the wordmark on the can. */
export const display = Josefin_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
