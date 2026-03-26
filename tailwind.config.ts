import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      colors: {
        "brand-purple": "#8B5CF6",
        "brand-purple-light": "#A78BFA",
        "brand-dark": "#0A0A1A",
        surface: "#1A1A2E",
        border: "hsl(var(--border))",
      },
      fontFamily: {
        sora: ["var(--font-sora)"],
        inter: ["var(--font-inter)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      fontSize: {
        xs: "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)",
        sm: "clamp(0.875rem, 0.8rem + 0.375vw, 1rem)",
        base: "clamp(1rem, 0.9rem + 0.5vw, 1.125rem)",
        lg: "clamp(1.125rem, 1rem + 0.625vw, 1.25rem)",
        xl: "clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)",
        "2xl": "clamp(1.5rem, 1.3rem + 1vw, 2rem)",
        "3xl": "clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)",
        "4xl": "clamp(2.25rem, 1.75rem + 2.5vw, 3rem)",
        "5xl": "clamp(3rem, 2rem + 5vw, 4rem)",
        "6xl": "clamp(3.75rem, 2.5rem + 6.25vw, 5rem)",
      },
    },
  },
  plugins: [],
};

export default config;
