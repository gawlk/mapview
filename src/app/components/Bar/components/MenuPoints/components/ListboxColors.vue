<script setup lang="ts">
  import store from '/src/store'

  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'

  const { t } = useI18n()

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )
</script>

<template>
  <Listbox
    :icon="IconColorSwatch"
    :values="[t('Colorization by threshold'), t('Colorization by zone')]"
    :selectedIndex="
      selectedReport?.settings.selectedColorization === 'Threshold' ? 0 : 1
    "
    @selectIndex="
      (index) =>
        selectedReport &&
        (selectedReport.settings.selectedColorization =
          index === 0 ? 'Threshold' : 'Zone')
    "
    full
  />
</template>

<i18n lang="yaml">
fr:
  'Colorization by threshold': 'Colorisation par seuil'
  'Colorization by zone': 'Colorisation par zone'
</i18n>
