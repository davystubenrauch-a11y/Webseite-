import type { Config } from "tailwindcss";

/** The studio set of the can video (#214043) and the can's gold and cream. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        set: "#214043",
        night: { DEFAULT: "#132b2e", deep: "#0c1f21" },
        cream: { DEFAULT: "#f2ede2", warm: "#e8e0cf", line: "#d6cab2" },
        ink: "#132b2e",
        gold: { DEFAULT: "#cfae68", soft: "#e6d3a3" },
        leaf: "#9bc55a",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
