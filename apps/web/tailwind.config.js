/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          900: "#050507",
          800: "#0c0c0e",
          700: "#111114",
          600: "#1a1a1f",
          500: "#2d2d35",
        },
        accent: {
          green:  "#6ee7b7",
          blue:   "#3b82f6",
          purple: "#c4b5fd",
          pink:   "#f9a8d4",
          cyan:   "#67e8f9",
          yellow: "#fbbf24",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in":    "fadeIn 0.5s ease forwards",
        "slide-up":   "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "bounce-dot": "bounceDot 1.2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        bounceDot: { "0%,100%": { transform: "translateY(0)", opacity: .4 }, "50%": { transform: "translateY(-4px)", opacity: 1 } },
      },
    },
  },
  plugins: [],
};
