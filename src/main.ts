import { createHead } from '@vueuse/head'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'

import 'tailwindcss/tailwind.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import './styles/main.css'

import App from './App.vue'

import { getBrowserLocale } from './locales'

import { createApp } from 'vue'

createApp(App)
  .use(createHead())
  .use(
    createI18n({
      locale: getBrowserLocale(true),
      fallbackLocale: 'en',
      messages,
      fallbackWarn: false,
      missingWarn: false,
    })
  )
  .mount('#app')
