/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'apple-blue': '#007AFF',
        'oled-black': '#000000',
      },
      fontFamily: {
        'sf-pro': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'squircle': '20px',
      },
    },
  },
  plugins: [],
}
