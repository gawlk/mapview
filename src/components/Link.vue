<template>
    <a
        :disabled="disabled"
        :href="href"
        @click.prevent="to"
        :class="disabled ? 'cursor-not-allowed' : ''"
        class="inline-block"
    >
        <slot></slot>
    </a>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue'

    import router from '/src/router'

    const props = defineProps({
        disabled: Boolean,
        href: String,
    })

    const to = () => {
        if (!props.disabled && props.href) {
            router.to(props.href)
        }
    }
</script>
