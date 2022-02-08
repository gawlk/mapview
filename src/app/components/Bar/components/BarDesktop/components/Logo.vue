<script setup lang="ts">
  import packageJSON from '/src/../package.json'

  import MapviewLogo from '/src/assets/svg/mapview/logoFull.svg?component'

  const state = reactive({
    version: packageJSON.version,
  })
</script>

<template>
  <a href="/" class="mx-auto flex w-1/2 items-center">
    <MapviewLogo class="h-full w-full" />
    <span class="flex-none pt-3 text-xs font-bold text-gray-400">
      v. {{ state.version }}
    </span>
  </a>
</template>
