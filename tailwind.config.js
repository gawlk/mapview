const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  purge: {
    mode: 'all',
    content: ['./index.html', './src/**/*.{html,vue,js,ts,jsx,tsx,svelte,md}'],
    options: {
      safelist: ['uplot', /^u-/],
    },
  },
  theme: {
    colors: {
      ...colors,
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      height: {
        screen: 'calc(100vh - env(safe-area-inset-bottom))',
      },
    },
  },
}
