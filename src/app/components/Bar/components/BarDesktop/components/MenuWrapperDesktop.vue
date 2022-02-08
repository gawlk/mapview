<script setup lang="ts">
  const props = defineProps<{
    icon: any
    name: string
  }>()

  const getOpen = () => {
    const open = localStorage.getItem(`isDesktopMenu${props.name}Open`)
    return open === null || open === 'true' ? true : false
  }

  const setOpen = (open: boolean) =>
    localStorage.setItem(`isDesktopMenu${props.name}Open`, String(open))
</script>

<template>
  <Disclosure
    :icon="props.icon"
    :text="props.name"
    @click="setOpen"
    :defaultOpen="getOpen()"
  >
    <slot></slot>
  </Disclosure>
</template>
