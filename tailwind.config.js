/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales del rancho
        primary: {
          50: '#f5f8f3',
          100: '#e8f0e3',
          200: '#d1e1c9',
          300: '#aecba1',
          400: '#97B982', // Color principal - Dusty green
          500: '#7fa56b',
          600: '#628654',
          700: '#4f6a44',
          800: '#405538',
          900: '#36472f',
        },
        // Color de acento - Earthy yellow
        accent: {
          50: '#faf8f1',
          100: '#f4efdf',
          200: '#e8dcbb',
          300: '#dac693',
          400: '#C5A34A', // Color de acento principal
          500: '#b8953f',
          600: '#a17f35',
          700: '#86652d',
          800: '#6f5229',
          900: '#5c4325',
        },
        // Fondo principal - Very light desaturated green
        background: {
          DEFAULT: '#F0F4EF',
          light: '#f7faf6',
          dark: '#e8ece7',
        },
        // Mantener colores legacy para compatibilidad
        ranch: {
          50: '#f5f8f3',
          100: '#e8f0e3',
          200: '#d1e1c9',
          300: '#aecba1',
          400: '#97B982',
          500: '#7fa56b',
          600: '#628654',
          700: '#4f6a44',
          800: '#405538',
          900: '#36472f',
        },
        earth: {
          50: '#faf8f1',
          100: '#f4efdf',
          200: '#e8dcbb',
          300: '#dac693',
          400: '#C5A34A',
          500: '#b8953f',
          600: '#a17f35',
          700: '#86652d',
          800: '#6f5229',
          900: '#5c4325',
        }
      },
      fontFamily: {
        sans: ['PT Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Tamaños más grandes para mejor legibilidad
        'xs': ['14px', { lineHeight: '20px' }],
        'sm': ['16px', { lineHeight: '24px' }],
        'base': ['18px', { lineHeight: '28px' }],
        'lg': ['20px', { lineHeight: '32px' }],
        'xl': ['24px', { lineHeight: '36px' }],
        '2xl': ['30px', { lineHeight: '40px' }],
        '3xl': ['36px', { lineHeight: '48px' }],
        'xl-mobile': ['1.5rem', { lineHeight: '2rem' }],
        '2xl-mobile': ['2rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        // Espaciados más generosos para mejor accesibilidad
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        // Bordes más suaves
        'xl': '16px',
        '2xl': '20px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}