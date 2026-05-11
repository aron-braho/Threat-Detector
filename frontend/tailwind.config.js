/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use this key in your AppStyles.js as 'font-space'
        space: ["'Space Grotesk'", "sans-serif"],
      },
    },
  },
  plugins: [],
}