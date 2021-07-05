<template>
  <Listbox
    :icon="ColorSwatchIcon"
    :buttonBackground="styles[0]"
    :backgrounds="styles"
    full
  />
</template>

<script setup>
  import store from '/src/store'

  import { ColorSwatchIcon, DotsHorizontalIcon } from '@heroicons/vue/solid'

  import { Listbox } from '/src/components'

  import mapboxDarkStyle from '/src/assets/png/mapboxStyles/dark.png'
  import mapboxLightStyle from '/src/assets/png/mapboxStyles/light.png'
  import mapboxSatelliteStyle from '/src/assets/png/mapboxStyles/satellite.png'
  import mapboxStreetsStyle from '/src/assets/png/mapboxStyles/streets.png'

  const styles = [
    mapboxStreetsStyle,
    mapboxSatelliteStyle,
    mapboxLightStyle,
    mapboxDarkStyle,
  ]
</script>
