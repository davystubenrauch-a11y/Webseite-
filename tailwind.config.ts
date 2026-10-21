import type { Config } from "tailwindcss";

/**
 * F&D Solutions palette (three main colours + one accent):
 *  - paper  #F9F8F6  warm off-white background
 *  - ink    #1C1B19  warm near-black for text and the dark band
 *  - sage   #4A5D52  deep sage green, the single accent for actions and highlights
 *  - taupe  #A39382  quiet secondary note (dividers, small details)
 * Google colours appear only on the NFC product itself.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        paper: "#F9F8F6",
        sand: "#F2EFEA",
        line: "#E4DED5",
        ink: {
          DEFAULT: "#1C1B19",
          soft: "#3A3833",
          muted: "#6B665E",
          faint: "#9C968C",
        },
        obsidian: "#121212",
        sage: {
          DEFAULT: "#4A5D52",
          dark: "#3A4A41",
          light: "#E7ECE6",
          pale: "#F1F4F0",
        },
        taupe: {
          DEFAULT: "#A39382",
          light: "#ECE6DE",
        },
        // `brand` is the accent alias used by shared components (wizard, legal pages).
        brand: {
          DEFAULT: "#4A5D52",
          dark: "#3A4A41",
          light: "#E7ECE6",
        },
        google: {
          blue: "#4285F4",
          red: "#EA4335",
          yellow: "#FBBC05",
          green: "#34A853",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        heading: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28,27,25,0.04), 0 24px 48px -32px rgba(28,27,25,0.18)",
        lift: "0 1px 2px rgba(28,27,25,0.05), 0 32px 64px -36px rgba(28,27,25,0.28)",
        ring: "0 0 0 4px rgba(74,93,82,0.14)",
      },
      maxWidth: {
        site: "78rem",
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%,-3%,0) scale(1.06)" },
        },
      },
      animation: {
        drift: "drift 24s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
