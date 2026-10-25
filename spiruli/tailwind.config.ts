import type { Config } from "tailwindcss";

/** Light warm sand (the can video's backdrop) with the can's petrol, teal and gold;
 * pale ingredient tints for the cards. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        set: "#214043",
        sand: "#ece6da",
        paper: "#f7f4ee",
        teal: "#11717a",
        sage: "#dde4d0",
        berry: "#e6dbe4",
        citrus: "#f2ebc9",
        night: { DEFAULT: "#132b2e", deep: "#0c1f21" },
        cream: { DEFAULT: "#f2ede2", warm: "#e8e0cf", line: "#d6cab2" },
        ink: "#132b2e",
        gold: { DEFAULT: "#cfae68", soft: "#e6d3a3", deep: "#97773a" },
        leaf: "#9bc55a",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
        float: { "50%": { translate: "0 -14px" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out -2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
