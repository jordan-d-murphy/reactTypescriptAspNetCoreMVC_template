/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // required for toggling dark mode
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {},
    },
    plugins: [require("tailwindcss-animate")],
  };