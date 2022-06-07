const tailwindcssDefaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{html,vue,js,ts,jsx,tsx,svelte,md}'],
  safelist: [
    'uplot',
    // {
    //   pattern: /^u-/Ah,
    // },
  ],
  theme: {
    extend: {
      fontFamily: {
        //@ts-ignore
        sans: ['Inter var', ...tailwindcssDefaultTheme.fontFamily.sans],
      },
      screens: {
        '2xl': '1600px',
      },
    },
  },
}
