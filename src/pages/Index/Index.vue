<template>
    <div class="flex flex-col lg:flex-row h-screen">
        <Map class="lg:order-2" />
        <Menu />
    </div>
</template>

<script setup lang="ts">
    import { useHead } from '@vueuse/head'

    import packageJSON from '/src/../package.json'

    import Map from './components/Map.vue'
    import Menu from './components/Menu/Index.vue'

    useHead({
        title: 'Home - Mapview',
        meta: [
            {
                name: 'description',
                content: packageJSON.description,
            },
        ],
    })
</script>
