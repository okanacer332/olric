/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // This is the missing link!
    "./src/app/components/ui/**/*.{js,ts,jsx,tsx}", 
    // Also include the shared package just in case
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0c1844",
          light: "#e0e7ff",
        }
      }
    },
  },
  plugins: [],
}