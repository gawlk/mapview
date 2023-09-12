import { fileURLToPath } from 'url'
import { faviconsPlugin } from '@darkobits/vite-plugin-favicons'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import Unimport from 'unimport/unplugin'
import unpluginAutoImport from 'unplugin-auto-import/vite'
import unpluginIconsResolver from 'unplugin-icons/resolver'
import unpluginIcons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import solidPages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'
import solid from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'
import { configDefaults } from 'vitest/config'

import packageJSON from './package.json'

const logoPath = './src/assets/svg/mapview/logo.svg'
const white = '#ffffff'

export default defineConfig({
  plugins: [
    solid(),

    solidSvg(),

    solidPages({
      dirs: 'src/routes',
      exclude: [
        '**/components/*',
        '**/components/**/*',
        '**/scripts/*',
        '**/scripts/**/*',
        '**/*.d.ts',
      ],
    }),

    Unimport.vite({
      dts: './src/types/unimport.d.ts',
      presets: [],
    }),

    unpluginAutoImport({
      imports: ['solid-js', '@solidjs/router'],
      dts: './src/types/auto-imports.d.ts',
      resolvers: [
        unpluginIconsResolver({
          prefix: 'Icon',
          extension: 'jsx',
        }),
      ],
    }),

    unpluginIcons({ autoInstall: true, compiler: 'solid' }),

    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      devOptions: {
        enabled: true,
      },
      mode: 'development',
      workbox: {
        skipWaiting: true,
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,json,woff2,ttf,zip,mpvz,dynz}',
        ],
      },
    }),

    faviconsPlugin({
      cache: true,
      appName: packageJSON.name[0].toUpperCase() + packageJSON.name.slice(1),
      appDescription: packageJSON.description,
      start_url: '/',
      theme_color: white,
      background: white,
      icons: {
        favicons: {
          source: logoPath,
          background: white,
          offset: 5,
        },
        android: {
          source: logoPath,
          background: white,
          offset: 10,
        },
        appleIcon: {
          background: white,
          source: logoPath,
          offset: 10,
        },
        appleStartup: {
          background: white,
          source: logoPath,
          offset: 15,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '/src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  assetsInclude: [
    '**/*.prjz',
    '**/*.mpvz',
    '**/*.dynz',
    '**/*.mvrz',
    '**/*.xlsx',
    '**/*.zip',
  ],
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
  build: {
    target: 'esnext',
  },
  test: {
    environment: 'happy-dom',
    exclude: [...configDefaults.exclude, '**/e2e/**', '**/importer/**'],
    setupFiles: [
      './src/tests/setup/mocks/url.ts',
      './src/tests/setup/extendMatchers/index.ts',
    ],
    testTimeout: 600000,
  },
})
