/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: "#4F46E5",
        secondary: "#9333EA",
        dark: "#111827",
        darkLight: "#1F2937",
        glass: "rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
}
