<script setup lang="ts">
  import { setDisclosureOpenState, getDisclosureOpenState } from '/src/scripts'

  const props = defineProps<{
    icon: any
    name: string
  }>()

  const key = `isDesktopMenu${props.name}Open`
</script>

<template>
  <Disclosure
    :icon="props.icon"
    :text="props.name"
    @click="(open) => setDisclosureOpenState(key, open)"
    :defaultOpen="getDisclosureOpenState(key)"
  >
    <slot></slot>
  </Disclosure>
</template>
