<template>
  <Listbox
    :icon="DotsVerticalIcon"
    :values="store.project?.units.map((unit) => unit.name)"
    :preSelected="t('Value:')"
    selected="D200"
    full
  />
</template>

<script setup>
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
