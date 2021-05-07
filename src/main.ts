import { createApp } from 'vue'
import { createHead } from '@vueuse/head'

import 'tailwindcss/tailwind.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import App from './App.vue'

createApp(App).use(createHead()).mount('#app')
