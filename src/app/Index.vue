<script setup lang="ts">
  import store from '/src/store'

  import Sticky from '/src/components/Sticky.vue'

  import Bar from './components/Bar/Index.vue'
  import Map from './components/Map.vue'

  import packageJSON from '/src/../package.json'

  useHead({
    title: 'Mapview',
    meta: [
      {
        name: 'description',
        content: packageJSON.description,
      },
    ],
  })

  const { t } = useI18n()

  const state = reactive({
    version: packageJSON.version,
  })

  const fixMapHeight = (delay: number = 50) => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, delay)
  }

  onMounted(async () => {
    fixMapHeight(200)

    if (navigator.serviceWorker) {
      if (window.location.protocol === 'https:') {
        const registration = await navigator.serviceWorker.register('/sw.js')

        registration.addEventListener('updatefound', () => {
          const worker = registration.installing

          worker?.addEventListener('statechange', () => {
            if (
              worker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              store.updateAvailable = true
            }
          })
        })
      } else {
        const registrations = await navigator.serviceWorker.getRegistrations()

        if (registrations.length > 0) {
          registrations.forEach((registration) => {
            registration.unregister()
          })

          location.reload()
        }
      }
    }
  })

  onUnmounted(() => {
    store.projects.list.forEach((project) => project.remove())

    store.map?.stop()
  })
</script>

<template>
  <div class="relative h-full">
    <Sticky
      v-if="store.updateAvailable"
      @close="
        () => {
          store.updateAvailable = false
        }
      "
    >
      <span> {{ t('A new version is available.') }} </span>
      {{ ' ' }}
      <span class="inline-block">
        <a href="/" class="font-bold text-white underline">
          {{ t('Update') }} <span aria-hidden="true">&rarr;</span>
        </a>
      </span>
    </Sticky>
    <div class="flex h-full flex-col text-gray-900 lg:flex-row">
      <Map class="lg:order-2" />
      <Bar />
    </div>
    <span
      class="absolute top-0 right-0 m-2 rounded-full bg-white px-1.5 py-0.5 text-xs font-extrabold tracking-tight text-black opacity-50"
    >
      v. {{ state.version }}
    </span>
  </div>
</template>

<i18n lang="yaml">
fr:
  'A new version is available.': 'Une nouvelle version est disponible.'
  'Update': 'Mettre à jour'
</i18n>
