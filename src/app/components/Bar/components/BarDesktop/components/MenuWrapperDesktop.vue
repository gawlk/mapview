<template>
  <Disclosure :icon="props.icon" :text="props.name" defaultOpen>
    <slot></slot>
  </Disclosure>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue'

  import { Disclosure } from '/src/components'

  const props = defineProps<{
    icon: () => any
    name: string
  }>()
</script>
