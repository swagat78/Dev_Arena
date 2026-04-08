/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e7ff',
          500: '#4f7cff',
          600: '#365ff8',
        },
      },
      boxShadow: {
        card: '0 20px 40px -24px rgba(79, 124, 255, 0.45)',
      },
    },
  },
  plugins: [],
};
