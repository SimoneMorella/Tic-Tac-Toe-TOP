/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['*.{html,js}'],
  theme: {
    colors: {
      'tangerine': '#FFAD8C',
      'bice': '#176F9F',
      'white': '#ffffff',
    },
    extend: {
      fontFamily: {
        body: ['Plus Jakarta Sans'],
        handwrite: ["Permanent Marker"],
      },
      keyframes: {
        spawn : {
          '0%' : {transform: 'scale(0)'},
          '100%' : {transform : 'scale(1)'}
        },
      },
      animation: {
        spawn: 'spawn 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}

