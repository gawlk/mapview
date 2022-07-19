import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import i18n from '@intlify/vite-plugin-vue-i18n'
import icons from 'unplugin-icons/vite'
import iconsResolver from 'unplugin-icons/resolver'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import svgLoader from 'vite-svg-loader'
import sw from 'vite-plugin-sw'
import favicons from '@darkobits/vite-plugin-favicons'
import analyze from 'rollup-plugin-analyzer'
import { viteTS2Mermaid } from 'ts2mermaid'

import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

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

    sw({
      filters: {
        onlineOnly: ['http://', '/demo.'],
      },
      generateRegistrer: false,
    }),

    analyze({
      summaryOnly: true,
    }),

    viteTS2Mermaid({
      global: {
        pathToSave: 'docs/mermaid',
      },
      list: [
        {
          name: 'labelsAndLists',
          include: [/GroupedDataLabels/, /[L|l]ist/],
        },
        // {
        //   name: 'all',
        // },
        // {
        //   name: 'allWithoutDependencies',
        //   hideDependencies: true,
        // },
        // {
        //   name: 'allWithoutExtends',
        //   hideExtends: true,
        // },
        // {
        //   name: 'allInterfaces',
        //   hideTypes: true,
        // },
        // {
        //   name: 'allTypes',
        //   hideInterfaces: true,
        // },
        // {
        //   name: 'onlyHeavydyn',
        //   include: [/[H|h]eavydyn/],
        // },
        // {
        //   name: 'onlyMaxidyn',
        //   include: [/[M|m]axidyn/],
        // },
        // {
        //   name: 'onlyMinidyn',
        //   include: [/[M|m]inidyn/],
        // },
        // {
        //   name: 'onlyMachines',
        //   include: [
        //     /[H|h]eavydyn/,
        //     /[M|m]axidyn/,
        //     /[M|m]inidyn/,
        //     /[M|m]achine/,
        //   ],
        // },
        // {
        //   name: 'exceptMachines',
        //   exclude: [
        //     /[H|h]eavydyn/,
        //     /[M|m]axidyn/,
        //     /[M|m]inidyn/,
        //     /[M|m]achine/,
        //   ],
        // },
      ],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
})
