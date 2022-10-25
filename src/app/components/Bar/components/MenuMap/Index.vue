<script setup lang="ts">
  import GroupImages from './components/GroupImages.vue'
  import GroupPoints from './components/GroupPoints.vue'
  import ListboxMapStyles from './components/ListboxMapStyles.vue'

  const props = defineProps<{
    readonly menu: MenuProps
  }>()
</script>

<template>
  <ListboxMapStyles />
  <GroupImages />
  <GroupPoints />
</template>
