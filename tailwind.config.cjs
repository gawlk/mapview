/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter var',
          ...require('tailwindcss/defaultTheme').fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
}
