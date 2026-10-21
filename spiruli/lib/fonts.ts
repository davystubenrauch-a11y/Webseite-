import { Bricolage_Grotesque, Caveat, Josefin_Sans } from "next/font/google";

/** Characterful grotesque for headlines and body. */
export const sans = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

/** Handwritten notes, used sparingly for an authentic, crafted feel. */
export const hand = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-hand",
  display: "swap",
});

/** Geometric face of the SPIRULI wordmark; used for the logo and the can label. */
export const display = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-display",
  display: "swap",
});
