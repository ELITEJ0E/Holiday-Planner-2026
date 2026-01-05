/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          blue: "#0ea5e9",
          green: "#14b8a6"
        }
      }
    }
  },
  plugins: [],
}
