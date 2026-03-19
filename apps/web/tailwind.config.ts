import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0F",
        surface: "#111118",
        card: "#16161F",
        card2: "#1C1C28",
        border: "#1E1E2E",
        divider: "#2A2A3E",
        accent: "#6C5CE7",
        accent2: "#00D2FF",
        gold: "#F9A825",
        green: "#00C896",
        red: "#FF4757",
        white: "#FFFFFF",
        offwhite: "#E8E8F0",
        muted: "#7A7A9D",
        muted2: "#4A4A6A",
      },
      backgroundColor: {
        "accent-dim": "rgba(108,92,231,0.15)",
        "accent2-dim": "rgba(0,210,255,0.12)",
        "gold-dim": "rgba(249,168,37,0.12)",
        "green-dim": "rgba(0,200,150,0.15)",
        "red-dim": "rgba(255,71,87,0.15)",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        dm: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        btn: "10px",
        card: "16px",
      },
      boxShadow: {
        accent: "0 0 20px rgba(108,92,231,0.35)",
        "accent-sm": "0 0 10px rgba(108,92,231,0.25)",
        accent2: "0 0 20px rgba(0,210,255,0.25)",
        gold: "0 0 20px rgba(249,168,37,0.25)",
        green: "0 0 20px rgba(0,200,150,0.25)",
      },
      animation: {
        ticker: "ticker 55s linear infinite",
        shimmer: "shimmer 1.5s infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "count-up": "countUp 0.8s ease-out",
        pulse2: "pulse2 2s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
