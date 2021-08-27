<template>
  <a href="/" class="flex items-center w-1/2 mx-auto">
    <MapviewLogo />
    <span class="flex-none pt-3 text-xs font-bold text-gray-400">
      v. {{ state.version }}
    </span>
  </a>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'

  import packageJSON from '/src/../package.json'

  import MapviewLogo from '/src/assets/svg/mapview/logoFull.svg?component'

  const state = reactive({
    version: packageJSON.version,
  })
</script>
