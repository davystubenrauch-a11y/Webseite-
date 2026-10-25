import { Bricolage_Grotesque, Inter_Tight } from "next/font/google";

/** Characterful, slightly organic grotesque for the big headlines. */
export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-display",
  display: "swap",
});

/** Clean grotesque for text and UI. */
export const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});
