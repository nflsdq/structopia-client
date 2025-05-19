/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#b3e0ff',
          200: '#80cbff',
          300: '#4db5ff',
          400: '#26a0ff',
          500: '#007bff', // Main primary
          600: '#0062cc',
          700: '#004a99',
          800: '#003166',
          900: '#001933',
        },
        secondary: {
          50: '#fff5e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb84d',
          400: '#ffa31a',
          500: '#ff8c00', // Main secondary
          600: '#cc7000',
          700: '#995400',
          800: '#663800',
          900: '#331c00',
        },
        accent: {
          50: '#f2e6ff',
          100: '#d9b3ff',
          200: '#c080ff',
          300: '#a64dff',
          400: '#8c1aff',
          500: '#7300e6', // Main accent
          600: '#5c00b8',
          700: '#45008a',
          800: '#2e005c',
          900: '#17002e',
        },
        success: {
          50: '#e6ffee',
          100: '#b3ffcd',
          200: '#80ffad',
          300: '#4dff8c',
          400: '#1aff6c',
          500: '#00cc44', // Main success
          600: '#009933',
          700: '#007326',
          800: '#004d1a',
          900: '#00260d',
        },
        warning: {
          50: '#fff9e6',
          100: '#ffeeb3',
          200: '#ffe380',
          300: '#ffd84d',
          400: '#ffcd1a',
          500: '#ffc200', // Main warning
          600: '#cc9b00',
          700: '#997500',
          800: '#664e00',
          900: '#332700',
        },
        error: {
          50: '#ffe6e6',
          100: '#ffb3b3',
          200: '#ff8080',
          300: '#ff4d4d',
          400: '#ff1a1a',
          500: '#e60000', // Main error
          600: '#b80000',
          700: '#8a0000',
          800: '#5c0000',
          900: '#2e0000',
        },
        neutral: {
          50: '#f2f2f2',
          100: '#d9d9d9',
          200: '#bfbfbf',
          300: '#a6a6a6',
          400: '#8c8c8c',
          500: '#737373',
          600: '#595959',
          700: '#404040',
          800: '#262626',
          900: '#0d0d0d',
        },
        background: '#f0f2f5',
      },
      boxShadow: {
        'neumorph': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
        'neumorph-sm': '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
        'neumorph-pressed': 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff',
        'neumorph-flat': '0px 0px 0px #d1d9e6, 0px 0px 0px #ffffff',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};