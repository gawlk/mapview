<template>
    <component
        :is="props.href ? Link : 'button'"
        :disabled="props.disabled"
        :href="href"
        :class="[
            props.xxl
                ? 'text-2xl font-medium py-6 px-12 rounded-2xl'
                : props.xl
                ? 'text-xl font-medium py-4 px-8 rounded-xl'
                : props.lg
                ? 'text-base sm:text-lg font-medium p-2.5 px-5 sm:py-3 sm:px-6 rounded-xl'
                : 'text-base font-medium py-2 px-4 rounded-lg',
            props.dark
                ? 'bg-gray-800 text-white focus:ring-gray-500'
                : props.green
                ? 'bg-green-800 text-white focus:ring-green-500'
                : props.red
                ? 'bg-red-800 text-white focus:ring-red-500'
                : props.transparent
                ? 'text-gray-900'
                : 'bg-gray-100 text-gray-900 focus:ring-gray-400',
            !props.disabled &&
                (props.dark
                    ? 'hover:bg-gray-700'
                    : props.green
                    ? 'hover:bg-green-700'
                    : props.red
                    ? 'hover:bg-red-700'
                    : 'hover:bg-white'),
            props.center && 'justify-center',
            props.disabled ? 'opacity-75 cursor-default' : 'cursor-pointer',
        ]"
        class="inline-flex items-center leading-6 focus:outline-none focus:ring transition-colors duration-200"
    >
        <slot></slot>
    </component>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue'

    import Link from './Link.vue'

    const props = defineProps({
        disabled: Boolean,
        href: String,
        dark: Boolean,
        green: Boolean,
        red: Boolean,
        transparent: Boolean,
        lg: Boolean,
        xl: Boolean,
        xxl: Boolean,
        full: Boolean,
        center: Boolean,
    })
</script>
