import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0F141C",
          800: "#151B25",
          700: "#1C232E",
          600: "#252E3C",
        },
        gold: {
          DEFAULT: "#C5A059",
          bright: "#D4AF37",
          soft: "#E6CF94",
        },
        royal: "#2563EB",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        rim: "0 0 0 1px rgba(197,160,89,0.35), 0 0 24px -4px rgba(212,175,55,0.35)",
        "rim-lg": "0 0 0 1px rgba(197,160,89,0.5), 0 0 60px -10px rgba(212,175,55,0.55)",
        royal: "0 10px 40px -10px rgba(37,99,235,0.6)",
      },
      backgroundImage: {
        "gold-metal":
          "linear-gradient(135deg, #8A6A2E 0%, #D4AF37 22%, #F3E2A9 40%, #C5A059 58%, #8A6A2E 80%, #D4AF37 100%)",
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
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
