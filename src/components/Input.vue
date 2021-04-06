<template>
    <input
        :placeholder="props.placeholder"
        :type="props.type"
        :value="props.value"
        :class="[
            props.invalid
                ? props.dark
                    ? 'bg-red-800 bg-opacity-50 focus:ring-red-500 focus:ring-opacity-50 text-red-50 placeholder-red-300'
                    : 'bg-red-100 bg-opacity-50 focus:ring-red-400 text-red-900  placeholder-red-600'
                : props.dark
                ? 'bg-gray-800 focus:ring-gray-600 text-gray-50 placeholder-gray-500'
                : 'bg-gray-50 focus:ring-gray-100 placeholder-gray-600',
            props.xl
                ? 'text-xl font-semibold p-4 px-6 rounded-xl focus:ring-8'
                : props.lg
                ? 'text-lg font-medium py-3 px-5 rounded-xl focus:ring-4'
                : 'text-base py-2 px-3 rounded-lg focus:ring',
        ]"
        class="w-full flex-1 leading-6 focus:outline-none transition-colors duration-200"
    />
</template>

<script setup lang="ts">
    import { defineEmit, defineProps } from 'vue'

    const emit = defineEmit()

    const props = defineProps({
        invalid: Boolean,
        placeholder: String,
        type: String,
        value: String,
        lg: Boolean,
        xl: Boolean,
        dark: Boolean,
    })
</script>
