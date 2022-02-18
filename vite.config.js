import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueTypeImports from 'vite-plugin-vue-type-imports'
// import Pages from 'vite-plugin-pages'
import i18n from '@intlify/vite-plugin-vue-i18n'
import icons from 'unplugin-icons/vite'
import iconsResolver from 'unplugin-icons/resolver'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import svgLoader from 'vite-svg-loader'
import sw from 'vite-plugin-sw'
import favicons from '@darkobits/vite-plugin-favicons'
import analyze from 'rollup-plugin-analyzer'

import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  resolve: {
    alias: {
      '/src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),

    vueJsx({
      optimize: true,
    }),

    vueTypeImports(),

    // https://github.com/hannoeru/vite-plugin-pages
    // Pages(),

    i18n({
      include: [
        fileURLToPath(new URL('./src/locales/**.(json|yaml)', import.meta.url)),
      ],
    }),

    // // https://github.com/antfu/unplugin-auto-import
    autoImport({
      imports: ['vue', 'vue-i18n', '@vueuse/head'],
      dts: './src/auto-imports.d.ts',
    }),

    // // https://github.com/antfu/unplugin-vue-components
    components({
      resolvers: [
        // https://github.com/antfu/vite-plugin-icons
        iconsResolver({
          componentPrefix: 'Icon',
        }),
      ],
      dts: './src/components.d.ts',
    }),

    icons({
      autoInstall: true,
    }),

    svgLoader(),

    favicons({
      icons: {
        favicons: {
          source: './src/assets/svg/mapview/logo.svg',
        },
        android: {
          source: './src/assets/svg/mapview/logo.svg',
        },
        appleStartup: {
          source: './src/assets/svg/mapview/logo.svg',
        },
      },
    }),

    sw(),

    analyze({
      summaryOnly: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
})
