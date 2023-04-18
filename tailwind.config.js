/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.html', './src/**/*.{html,vue,js,ts,jsx,tsx,svelte,md}'],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
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
  plugins: [require('@tailwindcss/container-queries')],
}
