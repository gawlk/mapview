<script setup lang="ts">
  import ColumnsSelection from './components/ColumnsSelection.vue'
  import Table from './components/Table.vue'

  import IconArrowsExpand from '~icons/heroicons-solid/arrows-expand'
</script>

<template>
  <ColumnsSelection />
  <Table />
  <Button full :leftIcon="IconArrowsExpand">Fullscreen</Button>
</template>
