<script setup lang="ts">
  import { getDisclosureOpenState, setDisclosureOpenState } from '/src/scripts'

  import Disclosure from '/src/components/Disclosure.vue'

  const props = defineProps<{
    readonly icon: any
    readonly name: string
    readonly menuProps: MenuProps
  }>()

  const key = `isDesktopMenu${props.name}Open`
</script>

<template>
  <Disclosure
    :id="props.name"
    :icon="props.icon"
    :text="props.name + props.menuProps.route"
  >
    <slot></slot>
  </Disclosure>
</template>
