/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        fira: ["Fira Code", "monospace"],
      },
      colors: {
        bg: "#0a0a0f",
        surface: "#12121a",
        border: "rgba(255,255,255,0.08)",
        agent: {
          ceo: "#6366f1",
          dev: "#3b82f6",
          finance: "#10b981",
          marketing: "#f59e0b",
          risk: "#ef4444",
          legal: "#8b5cf6",
          synthesis: "#22d3ee",
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.4s ease forwards",
        "fade-in": "fade-in 0.4s ease forwards",
        "scale-up": "scale-up 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
        ticker: "ticker 35s linear infinite",
        shimmer: "shimmer 1.8s infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%,100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.4, transform: "scale(0.7)" },
        },
        "fade-in-up": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "scale-up": {
          from: { opacity: 0, transform: "scale(0.85)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
