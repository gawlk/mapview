<template>
  <div class="flex flex-col lg:flex-row h-screen text-gray-900">
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
