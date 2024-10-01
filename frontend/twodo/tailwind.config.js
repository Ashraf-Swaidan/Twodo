/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',  // White as primary color
        secondary: '#FAFAF9',  // bg-stone-100 as secondary color
        third: '#E5E5E5',
        accent: '#374151'
      },
    },
  },
  plugins: [],
}
