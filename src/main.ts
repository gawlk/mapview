import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'

import 'tailwindcss/tailwind.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import App from './App.vue'

import { getBrowserLocale } from './locales'

createApp(App)
  .use(createHead())
  .use(
    createI18n({
      locale: getBrowserLocale(true),
      fallbackLocale: 'en',
      messages,
    })
  )
  .mount('#app')
