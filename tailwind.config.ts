import type { Config } from "tailwindcss";

/**
 * F&D Solutions brand palette:
 * deep navy surfaces, metallic gold accents, Google colours reserved for the NFC products.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#080d1a",
          900: "#0f172a",
          800: "#1e293b",
          700: "#273449",
          600: "#334155",
        },
        gold: {
          DEFAULT: "#c5a059",
          bright: "#d4af37",
          soft: "#e6cf94",
          deep: "#8a6a2e",
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
        display: ["var(--font-display)", "var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        rim: "0 0 0 1px rgba(197,160,89,0.35), 0 0 24px -4px rgba(212,175,55,0.35)",
        "rim-lg": "0 0 0 1px rgba(197,160,89,0.5), 0 0 60px -10px rgba(212,175,55,0.55)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        ping2: {
          "0%": { transform: "scale(0.6)", opacity: "0.9" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        ping2: "ping2 2.4s cubic-bezier(0,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
