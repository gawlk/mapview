<template>
    <div class="flex-none flex justify-around items-center border-t-8">
        <SubMenu name="Projet" :icon="FolderOpenIcon" />
        <SubMenu name="Report" :icon="ClipboardListIcon" />
        <SubMenu name="Map" :icon="MapIcon" />
    </div>
</template>

<script setup>
    import {
        ClipboardListIcon,
        FolderOpenIcon,
        MapIcon,
    } from '@heroicons/vue/outline'

    import SubMenu from './components/SubMenu.vue'
</script>
