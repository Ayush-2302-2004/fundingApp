/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          green: "#00e676",
          greenDim: "#00e67633",
          greenHover: "#00ff88",
        },
        dark: {
          primary: "#0a0e17",
          secondary: "#111827",
          card: "#0f1623",
          border: "#1e2a3a",
          borderLight: "#2a3a4e",
        },
        text: {
          primary: "#e2e8f0",
          secondary: "#64748b",
          muted: "#475569",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
