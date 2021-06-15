<template>
  <Disclosure :icon="TableIcon" :text="t('Table')">
    <ListboxColumns />
    <Table />
  </Disclosure>
</template>

<script setup>
  import { useI18n } from 'vue-i18n'

  import { TableIcon } from '@heroicons/vue/solid'

  import { Disclosure } from '/src/components'
  import ListboxColumns from './components/ListboxColumns.vue'
  import Table from './components/Table.vue'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Table': 'Table'
fr:
  'Table': 'Tableau'
</i18n>
