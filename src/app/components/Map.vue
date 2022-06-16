<script setup lang="ts">
  import { createMap } from '/src/scripts'
  import store from '/src/store'

  onMounted(() => {
    setTimeout(() => {
      const map = createMap('map')

      store.map = map
    }, 500)
  })
</script>

<template>
  <div id="map" class="h-full w-full" />
</template>
