<template>
  <Disclosure :icon="props.icon" :text="props.name">
    <slot></slot>
  </Disclosure>
</template>

<script setup>
  import { defineProps } from 'vue'

  import { Disclosure } from '/src/components'

  const props = defineProps({
    icon: Object | Function,
    name: String,
  })
</script>
