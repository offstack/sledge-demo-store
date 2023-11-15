import type {Config} from 'tailwindcss';
declare var require: any;

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        dark: '#070707',
        dark2: '#111111',
        dark3: '#1D1D1D',
        dark4: '#767676',
        dark5: '#181818',
        dark6: '#212121',
        dark7: '#202020',
        dark8: '#242424',
        dark9: '#252525',
        dark10: '#121212',
        gray1: '#9C9C9C',
        green: '#43C6AC',
        yellow: '#F8FFAE',
        yellow2: '#FBFFD1',
        red: '#F85538',
        red2: '#D72C0D',
      },
      fontFamily: {
        sans: ['cabinet-grotesk'],
        inter: [
          'inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
        ],
      },
      keyframes: {
        fadeIn: {
          from: {opacity: 0},
          to: {opacity: 1},
        },
        marquee: {
          '0%': {transform: 'translateX(0%)'},
          '100%': {transform: 'translateX(-100%)'},
        },
        blink: {
          '0%': {opacity: 0.2},
          '20%': {opacity: 1},
          '100% ': {opacity: 0.2},
        },
      },
      animation: {
        fadeIn: 'fadeIn .3s ease-in-out',
        carousel: 'marquee 60s linear infinite',
        blink: 'blink 1.4s both infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
