<script setup lang="ts">
  import store from '/src/store'

  import IconViewGrid from '~icons/heroicons-solid/view-grid'

  import Select from '/src/components/Select.vue'

  const { t } = useI18n()

  const possibilities: ReportGroupBy[] = ['Number', 'Zone']

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )
</script>

<template>
  <Select
    v-if="selectedReport?.dataLabels.table.selected?.group.from !== 'Zone'"
    :icon="IconViewGrid"
    :values="[t('Number'), t('Zone')]"
    :preSelected="`${t('Group by')}${t(':')}`"
    :selected="t(selectedReport?.settings.groupBy || '')"
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
