<template>
  <div id="map" class="w-full h-full" />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  import { createMap } from '/src/scripts/map/map'
  import store from '/src/store'

  onMounted(() => {
    const map = createMap('map')

    store.map = map
  })
</script>
