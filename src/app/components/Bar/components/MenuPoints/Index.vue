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
  <ListboxValue />
  <ListboxDrop />
  <DisclosureThreshold />
  <DisclosureTable />
</template>

<script setup>
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { Button } from '/src/components'
  import DisclosureTable from './components/DisclosureTable/Index.vue'
  import DisclosureThreshold from './components/DisclosureThreshold.vue'
  import ListboxDrop from './components/ListboxDrop.vue'
  import ListboxValue from './components/ListboxValue.vue'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Average': 'Average'
fr:
  'Average': 'Moyenne'
</i18n>
