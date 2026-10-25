import type { Config } from "tailwindcss";

/** Light, algae-tinted page; deep algae green and the can's teal for contrast. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mist: "#eef0ea",
        paper: "#f8f9f5",
        line: "#d5dacd",
        ink: "#0d2621",
        algae: { DEFAULT: "#12473c", deep: "#0a2a24" },
        teal: "#11717a",
        fresh: "#b5d66a",
        berry: "#4a2b44",
        citrus: "#f1e7a6",
        gold: "#c9a35a",
      },
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
