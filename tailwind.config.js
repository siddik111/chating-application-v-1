/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
       'roboto' : ['Roboto Serif','serif'],
       'Poppins': ['Poppins','sans-serif']
      },
      colors: {
        'primary': '#F4CE14',
        'secondary': '#F5F7F8',
        'third': '#495E57',
        'fourth': '#45474B',
      },
      // container: {
      //   width:'1170px'
      // }
    },
  },
  plugins: [],
}