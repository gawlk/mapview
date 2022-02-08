const tailwindcssColors = require('tailwindcss/colors')
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
    colors: {
      inherit: tailwindcssColors.inherit,
      current: tailwindcssColors.current,
      transparent: tailwindcssColors.transparent,
      primary: tailwindcssColors.orange,
      secondary: tailwindcssColors.indigo,
      tertiary: tailwindcssColors.stone,
      black: tailwindcssColors.black,
      white: tailwindcssColors.white,
      slate: tailwindcssColors.slate,
      gray: tailwindcssColors.gray,
      zinc: tailwindcssColors.zinc,
      neutral: tailwindcssColors.neutral,
      stone: tailwindcssColors.stone,
      red: tailwindcssColors.red,
      orange: tailwindcssColors.orange,
      amber: tailwindcssColors.amber,
      yellow: tailwindcssColors.yellow,
      lime: tailwindcssColors.lime,
      green: tailwindcssColors.green,
      emerald: tailwindcssColors.emerald,
      teal: tailwindcssColors.teal,
      cyan: tailwindcssColors.cyan,
      sky: tailwindcssColors.sky,
      blue: tailwindcssColors.blue,
      indigo: tailwindcssColors.indigo,
      violet: tailwindcssColors.violet,
      purple: tailwindcssColors.purple,
      fuchsia: tailwindcssColors.fuchsia,
      pink: tailwindcssColors.pink,
      rose: tailwindcssColors.rose,
    },
    extend: {
      fontFamily: {
        //@ts-ignore
        sans: ['Inter var', ...tailwindcssDefaultTheme.fontFamily.sans],
      },
      height: {
        screen: 'calc(100vh - env(safe-area-inset-bottom))',
      },
    },
  },
}
