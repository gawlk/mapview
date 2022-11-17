<script setup lang="ts">
  import store from '/src/store'

  import { createMap } from '/src/scripts'

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
