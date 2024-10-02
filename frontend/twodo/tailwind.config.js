/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");


module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',  // White as primary color
        secondary: '#FAFAF9',  // bg-stone-100 as secondary color
        third: '#E5E5E5',
        accent: '#374151',
        
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
    }),
  ]
}
