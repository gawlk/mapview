<script setup lang="ts">
  import store from '/src/store'

  import IconAdjustments from '~icons/heroicons-solid/adjustments'
  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'

  const { t } = useI18n()
</script>

<template>
  <Listbox
    :icon="IconAdjustments"
    :values="store.selectedProject?.reports.map((r) => r.name)"
    :preSelected="`${t('Threshold')}${t(':')}`"
    selected="N.S."
    full
  />
  <Listbox
    :icon="IconColorSwatch"
    buttonColors="bg-green-200 hover:bg-green-300 hover:bg-opacity-75 text-green-900"
    iconsClasses="text-green-700 group-hover:text-green-800"
    :selectedReplacement="`0 < ${
      t(store.selectedProject?.selectedReport?.dropsSettings.data.names[
        store.selectedProject.selectedReport.dropsSettings.data.selected
      ] as string)
    } < 30,0 um`"
    selected="N.S."
    full
  />
  <Listbox
    :icon="IconColorSwatch"
    buttonColors="bg-red-200 hover:bg-red-300 hover:bg-opacity-75 text-red-900"
    iconsClasses="text-red-700 group-hover:text-red-800"
    :selectedReplacement="`30,0 um < ${
      t(store.selectedProject?.selectedReport?.dropsSettings.data.names[
        store.selectedProject.selectedReport.dropsSettings.data.selected
      ] as string)
    } < ∞`"
    full
  />
</template>
