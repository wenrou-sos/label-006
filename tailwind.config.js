/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        government: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#172554",
          950: "#0c1929",
        },
        queue: {
          called: "#16a34a",
          serving: "#ca8a04",
          passed: "#dc2626",
          waiting: "#64748b",
        },
      },
      fontSize: {
        "display-2xl": ["12rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-xl": ["8rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-lg": ["6rem", { lineHeight: "1", letterSpacing: "-0.01em" }],
        "display-md": ["4.5rem", { lineHeight: "1.1" }],
        "display-sm": ["3rem", { lineHeight: "1.2" }],
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "flash": "flash 1s ease-in-out 3",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        flash: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
