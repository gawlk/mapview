import messages from '@intlify/unplugin-vue-i18n/messages'
import { createHead } from '@vueuse/head'
import { createI18n } from 'vue-i18n'

import './styles/main.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'tailwindcss/tailwind.css'

import { getBrowserLocale } from './locales'

import App from './App.vue'

// eslint-disable-next-line no-console
console.log(import.meta.env.VITE_CONTEXT)

createApp(App)
  .use(createHead())
  .use(
    createI18n({
      locale: getBrowserLocale(true),
      fallbackLocale: 'en',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      messages,
      fallbackWarn: false,
      missingWarn: false,
    })
  )
  .mount('#app')
