<script setup lang="ts">
  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'

  import store from '/src/store'

  import mapboxDarkStyle from '/src/assets/png/mapboxStyles/dark.png'
  import mapboxLightStyle from '/src/assets/png/mapboxStyles/light.png'
  import mapboxSatelliteStyle from '/src/assets/png/mapboxStyles/satellite.png'
  import mapboxStreetsStyle from '/src/assets/png/mapboxStyles/streets.png'

  const stylesImages = [
    mapboxStreetsStyle,
    mapboxSatelliteStyle,
    mapboxLightStyle,
    mapboxDarkStyle,
  ]

  const setStyle = (index: number) => {
    if (store.selectedProject) {
      console.log(index)

      store.selectedProject.mapviewSettings.map.styleIndex = index
    }
  }
</script>

<template>
  <Listbox
    :icon="IconColorSwatch"
    :selected="
      stylesImages[store.selectedProject?.mapviewSettings.map.styleIndex || 0]
    "
    :buttonBackground="
      stylesImages[store.selectedProject?.mapviewSettings.map.styleIndex || 0]
    "
    :backgrounds="stylesImages"
    @selectIndex="setStyle"
    full
  />
</template>
