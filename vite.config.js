import { faviconsPlugin as favicons } from '@darkobits/vite-plugin-favicons'
import unpluginVueI18N from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwindcss from 'tailwindcss'
import unpluginAutoImport from 'unplugin-auto-import/vite'
import unpluginIconsResolver from 'unplugin-icons/resolver'
import unpluginIcons from 'unplugin-icons/vite'
import unpluginComponents from 'unplugin-vue-components/vite'
import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import viteVueSvgLoader from 'vite-svg-loader'
import { configDefaults } from 'vitest/config'

import packageJSON from './package.json'

export default defineConfig({
  assetsInclude: [
    '**/*.prjz',
    '**/*.mpvz',
    '**/*.dynz',
    '**/*.mvrz',
    '**/*.xlsx',
  ],

  resolve: {
    alias: {
      '/src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [
    vue(),

    unpluginVueI18N({
      include: [
        fileURLToPath(new URL('./src/locales/**.(json|yaml)', import.meta.url)),
      ],
    }),

    // https://github.com/antfu/unplugin-auto-import
    unpluginAutoImport({
      imports: ['vue', 'vue-i18n', '@vueuse/head'],
      dts: './src/auto-imports.d.ts',
    }),

    // https://github.com/antfu/unplugin-vue-components
    unpluginComponents({
      dirs: [],
      resolvers: [
        // https://github.com/antfu/vite-plugin-icons
        unpluginIconsResolver({
          componentPrefix: 'Icon',
        }),
      ],
      dts: './src/components.d.ts',
    }),

    // https://github.com/antfu/vite-plugin-icons
    unpluginIcons({
      autoInstall: true,
    }),

    viteVueSvgLoader(),

    favicons({
      appName: packageJSON.name[0].toUpperCase() + packageJSON.name.slice(1),
      appDescription: packageJSON.description,
      start_url: '',
      cache: true,
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

    VitePWA({
      manifest: false,
      workbox: {
        skipWaiting: true,
      },
    }),

    visualizer({
      template: 'treemap',
      filename: './docs/visualizer/treemap.html',
    }),

    visualizer({
      template: 'network',
      filename: './docs/visualizer/network.html',
    }),

    visualizer({
      template: 'sunburst',
      filename: './docs/visualizer/sunburst.html',
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
  test: {
    environment: 'edge-runtime',
    exclude: [...configDefaults.exclude, '**/e2e-tests/**', '**/importer/**'],
    setupFiles: ['./test/extendMatchers/index.ts'],
  },
})
