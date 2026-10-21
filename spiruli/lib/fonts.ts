import { Josefin_Sans, Manrope } from "next/font/google";

/** Geometric face of the SPIRULI wordmark; used for the logo and the can label. */
export const display = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-display",
  display: "swap",
});

export const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
