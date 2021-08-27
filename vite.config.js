import { defineConfig } from 'vite'

import compress from 'vite-plugin-compress'
import favicons from '@darkobits/vite-plugin-favicons'
import i18n from '@intlify/vite-plugin-vue-i18n'
import path from 'path'
import svgLoader from 'vite-svg-loader'
import sw from 'vite-plugin-sw'
import vue from '@vitejs/plugin-vue'

import packageJSON from './package.json'

const faviconBackground = '#ffffff'
const faviconOffset = 5

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    svgLoader(),
    i18n({
      include: [path.resolve(__dirname, 'src/locales/**.(json|yaml)')],
    }),
    compress({
      brotli: false,
      verbose: true,
    }),
    sw({
      verbose: true,
    }),
    favicons({
      cache: false, // until plugin is fixed
      appName: packageJSON.name,
      appDescription: packageJSON.description,
      icons: {
        android: {
          source: './src/assets/svg/mapview/logo.svg',
          background: faviconBackground,
          offset: faviconOffset,
        },
        appleIcon: {
          source: './src/assets/svg/mapview/logo.svg',
          offset: faviconOffset,
        },
        appleStartup: {
          source: './src/assets/svg/mapview/logoFull.svg',
          offset: faviconOffset * 2,
        },
        favicons: {
          source: './src/assets/svg/mapview/logo.svg',
          offset: faviconOffset,
        },
      },
    }),
  ],
})
