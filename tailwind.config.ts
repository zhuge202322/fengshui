import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f1e7",
          100: "#ece2cc",
          200: "#c8b58a",
          300: "#a88a4d",
          400: "#8b6a2c",
          500: "#5b3a1a",
          600: "#3a2410",
          700: "#241608",
          800: "#140d05",
          900: "#0a0603",
        },
        gold: {
          DEFAULT: "#c9a233",
          50: "#fff8e1",
          100: "#fbeec1",
          200: "#f0d98a",
          300: "#e0bf5b",
          400: "#c9a233",
          500: "#a67c1b",
          600: "#7d5a10",
        },
        crimson: {
          DEFAULT: "#8b1a1a",
          deep: "#5e0e0e",
        },
        jade: {
          DEFAULT: "#1f6b50",
          light: "#3fa17a",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "'Noto Serif SC'", "serif"],
        display: ["'Cinzel'", "'Cormorant Garamond'", "serif"],
        sans: ["'Inter'", "'Noto Sans SC'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "mystic-radial":
          "radial-gradient(ellipse at top, rgba(201,162,51,0.18), transparent 60%), radial-gradient(ellipse at bottom, rgba(139,26,26,0.18), transparent 60%)",
        "scroll-paper":
          "linear-gradient(180deg, #1a0f08 0%, #0a0603 40%, #0a0603 60%, #1a0f08 100%)",
        "gold-shine":
          "linear-gradient(120deg, #7d5a10 0%, #e0bf5b 35%, #fff8e1 50%, #e0bf5b 65%, #7d5a10 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(201,162,51,0.25), 0 0 80px rgba(139,26,26,0.15)",
        inset_gold: "inset 0 0 0 1px rgba(201,162,51,0.4)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        spinSlow: "spinSlow 60s linear infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
