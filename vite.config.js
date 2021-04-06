import cdnAuto from 'vite-plugin-cdn-auto'
import compress from 'vite-plugin-compress'
import path from 'path'
import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    cdnAuto(),
    svgLoader(),
    compress({ brotli: false }),
  ],
}
