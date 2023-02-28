import store from '/src/store'

import { createMap } from '/src/scripts'

export default () => {
  onMount(() => {
    setTimeout(() => {
      const map = createMap('map')

      store.map = map
    }, 500)
  })

  onCleanup(() => {
    store.map?.remove()
  })

  return <div class="h-full w-full lg:order-2" id="map" />
}
