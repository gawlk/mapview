<script setup lang="ts">
  import { colorsClasses } from '/src/scripts'

  const emit = defineEmits<{
    (event: 'selectColor', value: Color): void
  }>()

  const props = defineProps<{
    icon?: any
    text: string
    color: Color
  }>()
</script>

<template>
  <Listbox
    :icon="props.icon"
    :buttonColors="colorsClasses[props.color].buttonColors"
    :iconsClasses="colorsClasses[props.color].iconsClasses"
    :selectedReplacement="props.text"
    :selectedIndex="
      Object.keys(colorsClasses).findIndex((color) => color === props.color)
    "
    @selectIndex="(index) => 
      emit('selectColor', (Object.keys(colorsClasses) as Color[])[index])
    "
    :classes="Object.values(colorsClasses).map((color) => color.buttonColors)"
    full
  />
</template>
