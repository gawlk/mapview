/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{html,vue,js,ts,jsx,tsx,svelte,md}'],
  theme: {
    extend: {
      fontFamily: {
        //@ts-ignore
        sans: [
          'Inter var',
          ...require('tailwindcss/defaultTheme').fontFamily.sans,
        ],
      },
      screens: {
        '2xl': '1600px',
      },
    },
  },
}
