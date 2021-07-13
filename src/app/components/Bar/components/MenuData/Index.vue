<template>
  <div
    class="
      px-4
      py-2
      text-sm
      font-medium
      text-red-900 text-center
      bg-red-200
      leading-6
      rounded-lg
    "
  >
    {{ t('Average') }} D200 : <strong class="font-bold">45.6 um</strong>
  </div>
  <ListboxColumns />
  <Table />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import ListboxColumns from './components/ListboxColumns.vue'
  import Table from './components/Table.vue'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Average': 'Average'
fr:
  'Average': 'Moyenne'
</i18n>
