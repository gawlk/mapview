<template>
  <Listbox
    :icon="ViewBoardsIcon"
    :values="
      store.project?.selectedReport?.dropsSettings.data.names.map((name) =>
        t(name)
      )
    "
    :preSelected="t('Columns:')"
    full
    isTop
  />
</template>

<script setup lang="ts">
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
