import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import unpluginAutoImport from 'unplugin-auto-import/vite'
import unpluginIconsResolver from 'unplugin-icons/resolver'
import unpluginIcons from 'unplugin-icons/vite'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import solidPages from 'vite-plugin-pages'
import solid from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'

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

    unpluginAutoImport({
      imports: ['solid-js', '@solidjs/router'],
      dts: './src/auto-imports.d.ts',
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
  ],
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
  build: {
    target: 'esnext',
  },
})
