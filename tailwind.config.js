/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f8f3',
          100: '#e4efdc',
          200: '#c9dfbd',
          300: '#a7ca98',
          400: '#85b074',
          500: '#4f6a44',
          600: '#3f5634',
          700: '#2f4126',
          800: '#24341d',
          900: '#1a2715',
        },
        accent: {
          50: '#faf8f1',
          100: '#f1ead6',
          200: '#e2d1a6',
          300: '#d1b372',
          400: '#b98f3a',
          500: '#6f5229',
          600: '#5c4325',
          700: '#4b361f',
          800: '#3b2a19',
          900: '#2b1f13',
        },
        background: {
          DEFAULT: '#F0F4EF',
          light: '#f7faf6',
          dark: '#e8ece7',
        },
        ranch: {
          50: '#f5f8f3',
          100: '#e4efdc',
          200: '#c9dfbd',
          300: '#a7ca98',
          400: '#85b074',
          500: '#4f6a44',
          600: '#3f5634',
          700: '#2f4126',
          800: '#24341d',
          900: '#1a2715',
        },
        earth: {
          50: '#faf8f1',
          100: '#f1ead6',
          200: '#e2d1a6',
          300: '#d1b372',
          400: '#b98f3a',
          500: '#6f5229',
          600: '#5c4325',
          700: '#4b361f',
          800: '#3b2a19',
          900: '#2b1f13',
        }
      },
      fontFamily: {
        sans: ['PT Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
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
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      animation: {
        'slide-in-from-right': 'slideInFromRight 300ms ease-out',
        'slide-out-to-right': 'slideOutToRight 300ms ease-in',
      },
      keyframes: {
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutToRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
