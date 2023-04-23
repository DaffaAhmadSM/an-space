/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'base' : '#E1735E',
        'secondary' : '#FFD144',
        'tertiary' : '#F5F5DC',
      }
    },
    fontFamily: {
      base: ['"Barlow"', 'sans-serif'],
    },
    letterSpacing: {
      baseSpace: '0.5rem',
      semi: '0.25rem',
    },
  },
  plugins: []
};