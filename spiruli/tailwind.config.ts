import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        petrol: {
          950: "#06141A",
          900: "#0A1E26",
          800: "#0F2A34",
          700: "#163845",
          600: "#1F4A59",
        },
        gold: {
          DEFAULT: "#C9A55A",
          bright: "#E2C47A",
          soft: "#F1E2B5",
          deep: "#8E6E2E",
        },
        emerald: {
          DEFAULT: "#2FA35B",
          bright: "#6CC04A",
          deep: "#14653A",
        },
        stone: {
          50: "#F6F3EE",
          100: "#EDE8E0",
          200: "#DCD5CA",
          400: "#9C958A",
          700: "#4A4640",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        rim: "0 0 0 1px rgba(201,165,90,0.35), 0 0 24px -4px rgba(226,196,122,0.35)",
        "rim-lg": "0 0 0 1px rgba(201,165,90,0.5), 0 0 60px -10px rgba(226,196,122,0.55)",
        emerald: "0 10px 40px -10px rgba(47,163,91,0.6)",
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
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spinSlow 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
