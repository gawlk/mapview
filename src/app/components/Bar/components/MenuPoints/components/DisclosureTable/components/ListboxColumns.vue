<template>
  <Listbox
    :icon="ViewBoardsIcon"
    :values="store.project?.reports.map((r) => r.name)"
    :preSelected="t('Columns:')"
    selected="D0, D200, D400"
    full
  />
</template>

<script setup>
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { ViewBoardsIcon } from '@heroicons/vue/solid'

  import { Listbox } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Columns:': 'Columns:'
fr:
  'Columns:': 'Colonnes :'
</i18n>
