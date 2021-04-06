<template>
    <div
        :class="[!props.transparent ? 'bg-white p-10 sm:p-20' : 'p-4 sm:p-12']"
        class="w-full mx-auto rounded-3xl space-y-12 z-10 bg-opacity-90"
    >
        <h3 class="text-4xl sm:text-5xl font-black tracking-tight">
            {{ props.title }}
        </h3>
        <h4
            v-if="props.description"
            class="text-xl sm:text-2xl text-gray-700 leading-relaxed"
        >
            {{ props.description }}
        </h4>
        <slot />
    </div>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue'

    const props = defineProps({
        title: String,
        description: String,
        transparent: Boolean,
    })
</script>
