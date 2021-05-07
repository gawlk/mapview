<template>
    <div id="map" class="h-full w-full" />
</template>

<script setup lang="ts">
    import { onMounted } from 'vue'

    import { createMap } from '/src/scripts/map/map'
    import store from '/src/store'

    onMounted(() => {
        store.map = createMap('map')
    })
</script>
