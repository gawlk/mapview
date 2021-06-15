<template>
  <a href="/" class="w-1/2 flex items-center mx-auto">
    <MapviewLogo />
    <span class="flex-none text-xs pt-3 font-bold text-gray-400">
      v. {{ state.version }}
    </span>
  </a>
</template>

<script setup>
  import { reactive } from 'vue'

  import packageJSON from '/src/../package.json'

  import MapviewLogo from '/src/assets/svg/mapview/logo.svg'

  const state = reactive({
    version: packageJSON.version,
  })
</script>
