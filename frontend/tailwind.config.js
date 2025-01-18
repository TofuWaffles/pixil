/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      "primary-main": "#dda25e",
      "primary-light": "#f0d6b6",
      "primary-dark": "#d17f2f",
      "primary-contrast": "#000000",
      "secondary-main": "#b2cf33",
      "secondary-light": "#c6e558",
      "secondary-dark": "#93a121",
      "secondary-contrast": "#000000",
      "background-main": "#fefae0",
      "background-dark": "#fbf1b8"
    },
    fontFamily: {
      // Add your font families here if needed
    },
    extend: {},
  },
  plugins: [],
}

