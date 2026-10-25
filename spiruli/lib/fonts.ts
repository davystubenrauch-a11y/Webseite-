import { Instrument_Serif, Inter_Tight, Josefin_Sans } from "next/font/google";

/** Elegant display serif for the big statements. */
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

/** Clean grotesque for text and UI. */
export const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

/** Geometric face of the SPIRULI wordmark (navigation logo). */
export const display = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-display",
  display: "swap",
});
