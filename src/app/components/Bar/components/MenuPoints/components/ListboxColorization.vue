<script setup lang="ts">
  import store from '/src/store'

  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'

  import Listbox from '/src/components/Listbox.vue'

  const { t } = useI18n()

  const possibilities: ReportColorizationPossibilities[] = ['Threshold', 'Zone']

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )
</script>

<template>
  <Listbox
    :icon="IconColorSwatch"
    :preSelected="`${t('Colorization by')}${t(':')}`"
    :values="possibilities.map((possibility) => t(possibility))"
    :selected="t(selectedReport?.settings.colorization)"
    @selectIndex="
      (index) =>
        selectedReport &&
        (selectedReport.settings.colorization = possibilities[index])
    "
    full
  />
</template>

<i18n lang="yaml">
fr:
  'Colorization by': 'Colorisation par'
</i18n>
