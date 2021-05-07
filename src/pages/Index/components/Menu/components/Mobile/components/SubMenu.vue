<template>
    <div
        class="w-full flex flex-col items-center justify-center p-4 cursor-pointer opacity-50 hover:opacity-100"
    >
        <component :is="props.icon" class="h-6 w-6" />
        <span>{{ props.name }}</span>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue'

    const props = defineProps({
        icon: Object,
        name: String,
    })
</script>
