import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold:    { 100: "#fbeec1", 300: "#e0bf5b", 500: "#c9a233", 700: "#7d5a10" },
        ink:     { 50: "#f6f1e7", 200: "#c8b58a", 700: "#241608", 900: "#0a0603" },
        crimson: { DEFAULT: "#8b1a1a", deep: "#5e0e0e" },
      },
      fontFamily: {
        serif:   ["'Cormorant Garamond'", "'Noto Serif SC'", "serif"],
        display: ["'Cinzel'", "'Cormorant Garamond'", "serif"],
        sans:    ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
