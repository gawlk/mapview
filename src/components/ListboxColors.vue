<script setup lang="ts">
  import { colorsClasses } from '/src/scripts'

  const emit = defineEmits<{
    (event: 'selectColor', value: ColorName): void
  }>()

  const props = defineProps<{
    color: ColorName
    icon?: any
    text?: string
    full?: boolean
  }>()
</script>

<template>
  <Listbox
    :icon="props.icon"
    :buttonColors="colorsClasses[props.color].buttonColors"
    :iconsClasses="colorsClasses[props.color].iconsClasses"
    :selectedReplacement="props.text || ''"
    :selectedIndex="
      Object.keys(colorsClasses).findIndex((color) => color === props.color)
    "
    @selectIndex="(index) => 
      emit('selectColor', (Object.keys(colorsClasses) as ColorName[])[index])
    "
    :classes="Object.values(colorsClasses).map((color) => color.buttonColors)"
    :full="props.full"
  />
</template>
