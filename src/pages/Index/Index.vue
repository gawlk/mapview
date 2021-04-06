<template>
    <div>Mapview</div>
</template>

<script setup lang="ts">
    import { useHead } from '@vueuse/head'

    import packageJSON from '/src/../package.json'

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
