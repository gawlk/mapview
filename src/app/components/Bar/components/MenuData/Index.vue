<script setup lang="ts">
  import store from '/src/store'

  import ListboxColumns from './components/ListboxColumns.vue'
  import Table from './components/Table.vue'

  const { t } = useI18n()
</script>

<template>
  <div
    class="rounded-lg bg-red-200 py-2 px-4 text-center text-sm font-medium leading-6 text-red-900"
  >
    {{ t('Average') }}
    {{
      t(store.selectedProject?.selectedReport?.dropsSettings.data.names[
        store.selectedProject?.selectedReport?.dropsSettings.data.selected
      ] as string)
    }}
    :
    <strong class="font-bold">45.6 um</strong>
  </div>
  <ListboxColumns />
  <Table />
</template>
