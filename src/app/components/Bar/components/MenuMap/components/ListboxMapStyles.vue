<template>
  <Listbox
    :icon="ColorSwatchIcon"
    :selected="stylesImages[state.index]"
    :buttonBackground="stylesImages[state.index]"
    :backgrounds="stylesImages"
    @selectIndex="setStyle"
    full
    isTop
  />
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { ColorSwatchIcon, DotsHorizontalIcon } from '@heroicons/vue/solid'

  import store from '/src/store'
  import { mapStyles } from '/src/scripts'

  import { Listbox } from '/src/components'

  import mapboxDarkStyle from '/src/assets/png/mapboxStyles/dark.png'
  import mapboxLightStyle from '/src/assets/png/mapboxStyles/light.png'
  import mapboxSatelliteStyle from '/src/assets/png/mapboxStyles/satellite.png'
  import mapboxStreetsStyle from '/src/assets/png/mapboxStyles/streets.png'

  const state = reactive({
    index: 0,
  })

  const stylesImages = [
    mapboxStreetsStyle,
    mapboxSatelliteStyle,
    mapboxLightStyle,
    mapboxDarkStyle,
  ]

  const setStyle = (index: number) => {
    state.index = index

    const style = mapStyles[index]

    store.mapStyle = style

    store.map?.setStyle(style)
  }
</script>
