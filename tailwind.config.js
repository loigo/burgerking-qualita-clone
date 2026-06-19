/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './prodotti/**/*.html',
    './promo/**/*.html',
    './franchising/**/*.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'bk-brown': '#502314',
        'bk-avana': '#F5EBDC',
        'bk-orange': '#FF8732',
        'bk-red': '#D62300',
        'bk-green': '#198737',
        'bk-dark': '#E8DFCF',
      },
      maxWidth: {
        1600: '1600px',
      },
    },
  },
  plugins: [],
};