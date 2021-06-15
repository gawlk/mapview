<template>
  <div id="map" class="h-full w-full" />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  import { createMap } from '/src/scripts/map/map'
  import { createProject } from '/src/scripts/project/project'
  import { createReport } from '/src/scripts/project/report'
  import store from '/src/store'

  onMounted(() => {
    store.project = createProject()

    const report = createReport('test')
    store.project.reports.push(report)
    store.selectedReport = report

    store.map = createMap('map')
  })
</script>
