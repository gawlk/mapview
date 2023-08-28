import { fileURLToPath } from 'url'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import Unimport from 'unimport/unplugin'
import unpluginAutoImport from 'unplugin-auto-import/vite'
import unpluginIconsResolver from 'unplugin-icons/resolver'
import unpluginIcons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import solidPages from 'vite-plugin-pages'
import solid from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'
import { configDefaults } from 'vitest/config'

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
