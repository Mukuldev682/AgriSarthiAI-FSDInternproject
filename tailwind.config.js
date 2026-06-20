/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f0fdf0",
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        soil: {
          50: "#fdf8f0",
          100: "#faefd8",
          200: "#f5dba8",
          400: "#d97706",
          500: "#b45309",
          600: "#92400e",
        },
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
      },
      fontFamily: {
        display: ["'Baloo 2'", "cursive"],
        body: ["'Noto Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
