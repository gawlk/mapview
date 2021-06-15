<template>
  <Listbox
    :icon="DotsHorizontalIcon"
    :values="store.project?.reports.map((r) => r.name)"
    :preSelected="t('Drop:')"
    selected="1"
    full
  />
</template>

<script setup>
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { DotsHorizontalIcon } from '@heroicons/vue/solid'

  import { Listbox } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Drop:': 'Drop:'
fr:
  'Drop:': 'Frappe :'
</i18n>
