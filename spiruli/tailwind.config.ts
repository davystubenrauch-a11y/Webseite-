import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Petrol from the can: text, buttons, structure.
        petrol: {
          DEFAULT: "#134A5A",
          900: "#0E2F3A",
          700: "#1B5A6C",
          100: "#E3EEF0",
          50: "#F1F6F7",
        },
        // Algae green: accents and highlights.
        leaf: {
          DEFAULT: "#3E9B4F",
          dark: "#2C7A3B",
          light: "#7DBE4A",
          50: "#EEF6EB",
        },
        sand: {
          DEFAULT: "#F7F5F0",
          200: "#EFEBE3",
          300: "#E3DDD2",
        },
        muted: "#5B6B70",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,47,58,0.04), 0 12px 32px -16px rgba(14,47,58,0.18)",
        lift: "0 2px 4px rgba(14,47,58,0.05), 0 24px 48px -20px rgba(14,47,58,0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
