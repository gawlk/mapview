<script setup lang="ts">
  import { setDisclosureOpenState, getDisclosureOpenState } from '/src/scripts'

  import Disclosure from '/src/components/Disclosure.vue'

  const props = defineProps<{
    icon: any
    name: string
    menuProps: MenuProps
  }>()

  const key = `isDesktopMenu${props.name}Open`
</script>

<template>
  <Disclosure
    :icon="props.icon"
    :text="props.name + props.menuProps.route"
    :defaultOpen="getDisclosureOpenState(key)"
    @click="(open) => setDisclosureOpenState(key, open)"
  >
    <slot></slot>
  </Disclosure>
</template>
