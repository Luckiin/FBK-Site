
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vermelho FBK — cor principal
        brand: {
          50:  "#fff5f5",
          100: "#ffe0e0",
          200: "#ffb3b3",
          300: "#ff7a7a",
          400: "#ff4d4d",
          500: "#e31e24",   // vermelho FBK (logo)
          600: "#c01820",
          700: "#9b121a",
          800: "#7a0d13",
          900: "#4d060a",
        },
        // Azul cobalto FBK — cor secundária (do logo)
        cobalt: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#93c5fd",
          300: "#60a5fa",
          400: "#3b82f6",
          500: "#1a56db",   // azul FBK (logo)
          600: "#1447b0",
          700: "#103888",
          800: "#0d2d6e",
          900: "#091e4a",
        },
        // Dourado — estrela e detalhes FBK
        gold: {
          50:  "#fffdf0",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4a017",   // dourado FBK
          600: "#b8860b",
          700: "#92700c",
          800: "#78590a",
          900: "#5c4306",
        },
        // Fundo — azul marinho escuro (como o fundo circular do logo FBK)
        dark: {
          50:  "#1e2d45",   // bordas / separadores
          100: "#172038",   // hover states
          200: "#111829",   // cards / surfaces
          300: "#0c1220",   // fundo base
          400: "#07101a",   // fundo mais profundo
        },
        // Texto — cinza com leve toque azulado (condizente com o marinho)
        ink: {
          100: "#ffffff",
          200: "#eef2ff",
          300: "#a8b8d8",
          400: "#6b82a6",
          500: "#4a5870",
          600: "#2e3b52",
          700: "#1a2438",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        heading: ["Oswald", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "ken-burns": "kenBurns 25s ease-in-out infinite alternate",
        "fade-in":   "fadeIn 0.6s ease-out forwards",
        "slide-up":  "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        kenBurns: {
          "0%":   { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
