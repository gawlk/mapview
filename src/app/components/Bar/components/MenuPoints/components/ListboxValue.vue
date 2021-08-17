<template>
  <Listbox
    :icon="DotsVerticalIcon"
    :values="store.project?.selectedReport?.dataSettings.keys"
    :preSelected="t('Value:')"
    :selected="store.project?.selectedReport?.dataSettings.selected"
    @select="
      (value) => (store.project.selectedReport.dataSettings.selected = value)
    "
    full
  />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { DotsVerticalIcon } from '@heroicons/vue/solid'

  import { Listbox } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Value:': 'Value:'
fr:
  'Value:': 'Valeur :'
</i18n>
