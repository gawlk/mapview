<template>
  <div id="map" class="w-full h-full" />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  import { createMap } from '/src/scripts'
  import store from '/src/store'

  onMounted(() => {
    const map = createMap('map')

    store.map = map
  })
</script>
