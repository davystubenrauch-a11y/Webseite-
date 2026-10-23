import type { Config } from "tailwindcss";

/** Flat, saturated colour fields taken from the drink: algae, lime, elderberry, citrus. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        algae: { DEFAULT: "#1E6B3B", tone: "#237A45", deep: "#14502B" },
        lime: { DEFAULT: "#D7F25A", tone: "#CBE84B", soft: "#EAF8A6" },
        berry: { DEFAULT: "#9B2F7A", tone: "#AE3A8A" },
        citrus: { DEFAULT: "#F5B423", tone: "#EDA717" },
        cream: { DEFAULT: "#F4EEDF", tone: "#ECE4CF" },
        ink: "#10331F",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        marquee: { to: { transform: "translateX(-50%)" } },
      },
      animation: {
        "spin-slow": "spin 16s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
