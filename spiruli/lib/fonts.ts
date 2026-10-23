import { Archivo, Josefin_Sans } from "next/font/google";

/** Variable Archivo: extra-wide black for headlines, normal width for text. */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** Geometric face of the SPIRULI wordmark (navigation logo). */
export const display = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-display",
  display: "swap",
});
