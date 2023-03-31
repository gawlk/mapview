// import Sticky from '/src/components/Sticky.vue'
import { useI18n } from '@solid-primitives/i18n'
import { Meta, Title } from '@solidjs/meta'

import store from '/src/store'

import { Sticky } from '/src/components'

import Bar from './components/bar'
import Map from './components/map'

import packageJSONRaw from '/src/../package.json?raw'

const packageJSON = JSON.parse(packageJSONRaw)

export default () => {
  const [t] = useI18n()

  const state = createMutable({
    version: packageJSON.version,
  })

  const fixMapHeight = () =>
    setTimeout(() => window.dispatchEvent(new Event('resize')), 200)

  onMount(async () => {
    fixMapHeight()

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

  onCleanup(() => {
    store.projects.list.forEach((project) => project.remove())

    store.map?.stop()
  })

  return (
    <div class="relative h-full">
      <Title>Mapview</Title>
      <Meta name="description" content={packageJSON.description} />
      <Show when={store.importingFile}>
        <div class="absolute inset-0 z-10 h-screen w-screen backdrop-blur">
          <div class="flex h-full flex-col items-center justify-center space-y-2">
            <svg
              class="h-24 w-24 animate-spin text-black/20 sm:h-32 sm:w-32"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 6l0 -3"></path>
              <path d="M16.25 7.75l2.15 -2.15"></path>
              <path d="M18 12l3 0"></path>
              <path d="M16.25 16.25l2.15 2.15"></path>
              <path d="M12 18l0 3"></path>
              <path d="M7.75 16.25l-2.15 2.15"></path>
              <path d="M6 12l-3 0"></path>
              <path d="M7.75 7.75l-2.15 -2.15"></path>
            </svg>
            <p class="font-medium">{t('Opening in progress...')}</p>
          </div>
        </div>
      </Show>

      <Show when={store.updateAvailable}>
        <Sticky onClose={() => (store.updateAvailable = false)}>
          <span> {t('A new version is available')}. </span>{' '}
          <span class="inline-block">
            <a class="font-bold text-white underline" href="/">
              {t('Update')} <span aria-hidden="true">&rarr;</span>
            </a>
          </span>
        </Sticky>
      </Show>

      <div class="flex h-full flex-col text-gray-900 lg:flex-row">
        <Map />
        <Bar />
      </div>
      <span class="absolute right-0 top-0 m-2 rounded-full bg-white px-1.5 py-0.5 text-xs font-extrabold tracking-tight text-black opacity-50">
        v. {state.version}
      </span>
    </div>
  )
}
