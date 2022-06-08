<script setup lang="ts">
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

  const state = reactive({
    version: packageJSON.version,
  })
</script>

<template>
  <div class="relative">
    <div class="flex h-screen flex-col text-gray-900 lg:flex-row">
      <Map class="lg:order-2" />
      <Bar />
    </div>
    <span
      class="absolute top-0 right-0 m-2 rounded-full bg-white px-1.5 py-0.5 text-xs font-extrabold tracking-tight text-black opacity-50"
    >
      v. {{ state.version }}
    </span>
  </div>
</template>
