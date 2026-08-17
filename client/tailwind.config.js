/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36a9f7',
          500: '#0c8de4',
          600: '#0270c3',
          700: '#03599f',
          800: '#074b83',
          900: '#0c3f6e',
          950: '#082849'
        },
        accent: {
          50: '#fff1f2',
          500: '#f43f5e',
          600: '#e11d48'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
