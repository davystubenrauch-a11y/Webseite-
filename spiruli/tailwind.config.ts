import type { Config } from "tailwindcss";

/** Taken from the can: petrol lacquer, its deep shadow, the gold band, the green brushwork. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        petrol: { DEFAULT: "#0f5257", deep: "#0a3134", night: "#071f21", soft: "#d7e6e3" },
        cream: { DEFAULT: "#f4efe3", warm: "#ebe3d1", line: "#d8cdb5" },
        ink: "#13201f",
        gold: "#c9993f",
        leaf: "#8dbb3c",
        berry: "#5b2e6e",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
};

export default config;
