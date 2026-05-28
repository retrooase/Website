import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // rgb() format for background to support opacity modifiers (bg-background/95 etc.)
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        "accent-orange": "var(--accent-orange)",
        "accent-yellow": "var(--accent-yellow)",
        "accent-green": "var(--accent-green)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        border: "var(--border)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
      },
      fontFamily: {
        pixel: ["var(--font-press-start)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      boxShadow: {
        "neon-orange": "0 0 10px #ff6b35, 0 0 20px #ff6b35, 0 0 40px #ff6b3580",
        "neon-yellow": "0 0 10px #ffcc02, 0 0 20px #ffcc02, 0 0 40px #ffcc0280",
        "neon-green": "0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff1480",
        "pixel": "4px 4px 0 var(--border)",
        "pixel-orange": "4px 4px 0 #ff6b35",
      },
      animation: {
        "glitch": "glitch 2s infinite",
        "float": "float 6s ease-in-out infinite",
        "scanline": "scanline 8s linear infinite",
        "ticker": "ticker 30s linear infinite",
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "pixel-blink": "pixel-blink 1s step-start infinite",
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "10%": { transform: "translate(-2px, 2px)", filter: "hue-rotate(90deg)" },
          "20%": { transform: "translate(2px, -2px)", filter: "hue-rotate(-90deg)" },
          "30%": { transform: "translate(0)" },
          "40%": { transform: "translate(-1px, 1px)", opacity: "0.8" },
          "50%": { transform: "translate(1px, -1px)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 5px #ff6b35, 0 0 10px #ff6b35" },
          "50%": { boxShadow: "0 0 20px #ff6b35, 0 0 40px #ff6b35, 0 0 60px #ff6b35" },
        },
        "pixel-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
