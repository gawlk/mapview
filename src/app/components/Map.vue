<template>
  <div id="map" class="h-full w-full" />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  import { createMap } from '/src/scripts/map/map'
  import { createProject } from '/src/scripts/project/project'
  import store from '/src/store'

  onMounted(() => {
    store.map = createMap('map')

    store.project = createProject('test project', store.map)
  })
</script>
