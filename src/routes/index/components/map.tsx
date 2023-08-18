import { createMap } from '/src/scripts'
import { store } from '/src/store'

const fixMapHeight = () =>
  setTimeout(() => window.dispatchEvent(new Event('resize')), 200)

export const Map = () => {
  onMount(() => {
    setTimeout(() => {
      const map = createMap('map')

      store.map = map

      fixMapHeight()
    }, 500)
  })

  onCleanup(() => {
    store.map?.remove()
  })

  return <div class="h-full w-full lg:order-2" id="map" />
}
