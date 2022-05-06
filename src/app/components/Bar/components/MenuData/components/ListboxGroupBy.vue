<script setup lang="ts">
  import store from '/src/store'

  import IconViewGrid from '~icons/heroicons-solid/view-grid'

  import Listbox from '/src/components/Listbox.vue'

  const { t } = useI18n()

  const possibilities: ReportGroupByPossibilities[] = ['Nothing', 'Zone']

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )
</script>

<template>
  <Listbox
    v-if="
      selectedReport?.zones.length > 1 &&
      selectedReport?.dataLabels.table.selected?.group.from !== 'Zone'
    "
    :icon="IconViewGrid"
    :values="[t('Nothing'), t('Zone')]"
    :preSelected="`${t('Group by')}${t(':')}`"
    :selected="t(selectedReport?.settings.groupBy)"
    @selectIndex="
      (index) =>
        selectedReport &&
        (selectedReport.settings.groupBy = possibilities[index])
    "
    full
  />
</template>

<i18n lang="yaml">
fr:
  'Group by': 'Grouper par'
</i18n>
