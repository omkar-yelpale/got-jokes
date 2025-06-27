/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': '#5B21B6',
        'hot-pink': '#EC4899',
        'navy-dark': '#0F172A',
        'navy-light': '#1E293B',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}