<template>
  <div id="map" class="w-full h-full" />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  import { createMap } from '/src/scripts/map/map'
  import { createProject } from '/src/scripts/project/project'
  import store from '/src/store'

  onMounted(() => {
    const map = createMap('map')

    store.map = map

    map.on('style.load', () => {
      store.project = createProject('test project', map)
    })
  })
</script>
