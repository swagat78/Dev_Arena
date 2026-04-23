/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e7ff',
          200: '#bbcfff',
          300: '#8db0ff',
          400: '#6b94ff',
          500: '#4f7cff',
          600: '#365ff8',
          700: '#2a4de0',
          800: '#2541b5',
          900: '#243b8e',
        },
      },
      boxShadow: {
        card: '0 20px 40px -24px rgba(79, 124, 255, 0.45)',
        glow: '0 0 60px -12px rgba(79, 124, 255, 0.4)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
