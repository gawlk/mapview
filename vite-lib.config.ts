import { resolve } from 'path'
import { fileURLToPath } from 'url'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import Unimport from 'unimport/unplugin'
import unpluginAutoImport from 'unplugin-auto-import/vite'
import unpluginIconsResolver from 'unplugin-icons/resolver'
import unpluginIcons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import solidPages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'
import solid from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'

export default defineConfig({
  plugins: [
    solid(),

    solidSvg(),

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

    dts({ insertTypesEntry: true }),
  ],
  resolve: {
    alias: {
      '/src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'MyLib',
      fileName: 'main',
    },
    target: 'esnext',
    copyPublicDir: false,
  },
})
