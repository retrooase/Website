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
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-hover": "var(--surface-hover)",
        "accent-orange": "var(--accent-orange)",
        "accent-gold": "var(--accent-gold)",
        "accent-yellow": "var(--accent-gold)",
        "accent-teal": "var(--accent-teal)",
        "accent-green": "var(--accent-teal)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        pixel:   ["var(--font-display)", "sans-serif"],
        sans:    ["var(--font-inter)", "sans-serif"],
        mono:    ["var(--font-jetbrains)", "monospace"],
      },
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      borderRadius: {
        DEFAULT: "0.875rem",
        sm: "0.5rem",
        md: "0.875rem",
        lg: "1.25rem",
        xl: "1.75rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        full: "9999px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
        accent: "var(--shadow-accent)",
        glow: "var(--shadow-glow)",
        "neon-orange": "0 0 10px rgba(255,95,46,0.6), 0 0 20px rgba(255,95,46,0.3)",
        "neon-teal":   "0 0 10px rgba(34,211,163,0.6), 0 0 20px rgba(34,211,163,0.3)",
        "neon-gold":   "0 0 10px rgba(240,164,41,0.6), 0 0 20px rgba(240,164,41,0.3)",
      },
      animation: {
        "fade-in":      "fade-in 0.5s var(--ease-smooth) both",
        "slide-up":     "slide-up 0.4s var(--ease-smooth) both",
        "reveal-up":    "reveal-up 0.6s var(--ease-smooth) both",
        "reveal-scale": "reveal-scale 0.5s var(--ease-smooth) both",
        "float":        "float 6s ease-in-out infinite",
        "ticker":       "ticker 35s linear infinite",
        "pulse-ring":   "pulse-ring 1.5s ease-out infinite",
        "glow-pulse":   "glow-pulse 2.5s ease-in-out infinite",
        "bounce-in":    "bounce-in 0.45s var(--ease-spring) both",
        "count-in":     "count-in 0.5s var(--ease-smooth) both",
        "dot-blink":    "dot-blink 1.2s step-end infinite",
        "pixel-blink":  "pixel-blink 1s step-start infinite",
        "glitch":       "glitch 2s infinite",
        "pulse-neon":   "pulse-neon 2s ease-in-out infinite",
        "shine-pass":   "shine-pass 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-up": {
          from: { opacity: "0", transform: "translateY(32px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-scale": {
          from: { opacity: "0", transform: "scale(0.94)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-10px)" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,95,46,0.4)" },
          "50%":       { boxShadow: "0 0 0 8px rgba(255,95,46,0)" },
        },
        "bounce-in": {
          "0%":   { opacity: "0", transform: "scale(0.7)" },
          "60%":  { opacity: "1", transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        "count-in": {
          from: { opacity: "0", transform: "translateY(8px) scale(0.9)" },
          to:   { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "dot-blink": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.2" },
        },
        "pixel-blink": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "10%":  { transform: "translate(-2px, 2px)", filter: "hue-rotate(90deg)" },
          "20%":  { transform: "translate(2px, -2px)", filter: "hue-rotate(-90deg)" },
          "30%":  { transform: "translate(0)" },
          "40%":  { transform: "translate(-1px, 1px)", opacity: "0.8" },
          "50%":  { transform: "translate(1px, -1px)", opacity: "1" },
        },
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 5px #ff5f2e, 0 0 10px #ff5f2e" },
          "50%":       { boxShadow: "0 0 20px #ff5f2e, 0 0 40px #ff5f2e, 0 0 60px #ff5f2e" },
        },
        "shine-pass": {
          "0%":   { transform: "translateX(-150%) skewX(-20deg)", opacity: "0" },
          "10%":  { opacity: "1" },
          "90%":  { opacity: "1" },
          "100%": { transform: "translateX(400%) skewX(-20deg)", opacity: "0" },
        },
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
    },
  },
  plugins: [],
};

export default config;
