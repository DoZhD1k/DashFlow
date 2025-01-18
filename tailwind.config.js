/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // включаем режим 'class'
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Можно определить дополнительные цвета, если нужно
        primary: "#8c37f5",
        secondary: "#f63c78",
      },
    },
  },
  plugins: [],
};
