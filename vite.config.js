import favicons from '@darkobits/vite-plugin-favicons'
import i18n from '@intlify/vite-plugin-vue-i18n'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { viteTS2Mermaid } from 'ts2mermaid'
import autoImport from 'unplugin-auto-import/vite'
import iconsResolver from 'unplugin-icons/resolver'
import icons from 'unplugin-icons/vite'
import components from 'unplugin-vue-components/vite'
import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgLoader from 'vite-svg-loader'

import packageJSON from './package.json'

export default defineConfig({
  resolve: {
    alias: {
      '/src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),

    // https://github.com/hannoeru/vite-plugin-pages
    // pages(),

    i18n({
      include: [
        fileURLToPath(new URL('./src/locales/**.(json|yaml)', import.meta.url)),
      ],
    }),

    // https://github.com/antfu/unplugin-auto-import
    autoImport({
      imports: ['vue', 'vue-i18n', '@vueuse/head'],
      dts: './src/auto-imports.d.ts',
    }),

    // https://github.com/antfu/unplugin-vue-components
    components({
      dirs: [],
      resolvers: [
        // https://github.com/antfu/vite-plugin-icons
        iconsResolver({
          componentPrefix: 'Icon',
        }),
      ],
      dts: './src/components.d.ts',
    }),

    // https://github.com/antfu/vite-plugin-icons
    icons({
      autoInstall: true,
    }),

    svgLoader(),

    favicons({
      appName: packageJSON.name[0].toUpperCase() + packageJSON.name.slice(1),
      appDescription: packageJSON.description,
      start_url: '',
      icons: {
        favicons: {
          source: './src/assets/svg/mapview/logo.svg',
        },
        android: {
          source: './src/assets/svg/mapview/logo.svg',
        },
        appleIcon: {
          source: './src/assets/svg/mapview/logo.svg',
        },
        appleStartup: {
          source: './src/assets/svg/mapview/logo.svg',
        },
      },
    }),

    VitePWA({}),

    viteTS2Mermaid({
      global: {
        pathToSave: 'docs/mermaid',
      },
      list: [
        {
          name: 'Objects',
          exclude: [/JSON/],
        },
        {
          name: 'JSONs',
          include: [/JSON/],
        },
        {
          name: 'Heavydyn',
          include: [/Heavydyn/],
        },
        {
          name: 'Maxidyn',
          include: [/Maxidyn/],
        },
        {
          name: 'Minidyn',
          include: [/Minidyn/],
        },
        {
          name: 'Base',
          include: [/Base/],
        },
      ],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
})
