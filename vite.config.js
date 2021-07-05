import { defineConfig } from 'vite'
import compress from 'vite-plugin-compress'
import path from 'path'
import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'
import i18n from '@intlify/vite-plugin-vue-i18n'

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
    compress({ brotli: false }),
    i18n({
      include: [path.resolve(__dirname, 'src/locales/**.(json|yaml)')],
    }),
  ],
})
