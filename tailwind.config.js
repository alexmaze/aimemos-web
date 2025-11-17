/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      boxShadow: {
        'apple': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 10px 40px 0 rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'apple': '12px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
