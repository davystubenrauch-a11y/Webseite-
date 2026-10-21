import type { Config } from "tailwindcss";

/** Palette taken from the ingredients: lime, elderberry, citrus, algae — anchored by the can's petrol. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12343F",
        petrol: { DEFAULT: "#134A5A", soft: "#DCEBEE" },
        lime: { DEFAULT: "#D4EE6F", deep: "#A8CF3F" },
        cream: { DEFAULT: "#FBF7EE", 200: "#F2EBDD", 300: "#E4DBC8" },
        berry: { DEFAULT: "#5B2E6E", soft: "#ECDFF3" },
        citrus: { DEFAULT: "#F2A91B", soft: "#FFF0C4" },
        algae: { DEFAULT: "#2F8A4E", soft: "#DDEFD9" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
        spin: { to: { transform: "rotate(360deg)" } },
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "spin-slow": "spin 18s linear infinite",
        bob: "bob 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
