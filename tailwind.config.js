
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fff5f5",
          100: "#ffe0e0",
          200: "#ffb3b3",
          300: "#ff7a7a",
          400: "#ff4444",
          500: "#dc2626",   // cor principal
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#450a0a",
        },
        gold: {
          50:  "#fffdf0",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4a017",   // dourado principal
          600: "#b8860b",
          700: "#92700c",
          800: "#78590a",
          900: "#5c4306",
        },
        dark: {
          50:  "#2a2a2a",   // bordas / inputs
          100: "#1f1f1f",   // hover
          200: "#171717",   // card / surface
          300: "#0f0f0f",   // fundo base
          400: "#0a0a0a",   // fundo mais profundo
        },
        ink: {
          100: "#ffffff",
          200: "#f5f5f5",
          300: "#a3a3a3",
          400: "#737373",
          500: "#525252",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "ken-burns": "kenBurns 25s ease-in-out infinite alternate",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        kenBurns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
