/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Dynamic class names (e.g. `bg-${color}-500/10`) used by MetricCard and
  // the demo dashboards (Arcones/Buzones/Acopios/Camiones). Tailwind's JIT
  // can't see these statically, so we safelist the color families used.
  safelist: [
    { pattern: /(bg|text|border)-(emerald|blue|amber|rose|gray|purple|brand-gold)-(200|300|400|500|600)(\/(10|20|30))?/ },
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#D4A24E",
          dark: "#0B1120",
          darker: "#050914",
          surface: "#1F2937",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
