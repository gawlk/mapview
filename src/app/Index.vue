<template>
  <div class="flex flex-col h-screen text-gray-900 lg:flex-row">
    <Map class="lg:order-2" />
    <Bar />
  </div>
</template>

<script setup lang="ts">
  import { useHead } from '@vueuse/head'

  import packageJSON from '/src/../package.json'

  import Bar from './components/Bar/Index.vue'
  import Map from './components/Map.vue'

  useHead({
    title: 'Mapview',
    meta: [
      {
        name: 'description',
        content: packageJSON.description,
      },
    ],
  })
</script>
