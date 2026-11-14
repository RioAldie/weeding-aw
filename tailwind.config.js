/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F9F9F9',
        sage: '#8A9A5B',
        forest: '#2C4C3B',
        gold: '#D4AF37',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['Lato', 'Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

