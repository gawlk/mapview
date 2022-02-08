<script setup lang="ts">
  import store from '/src/store'

  import IconDotsHorizontal from '~icons/heroicons-solid/dots-horizontal'
  import IconDotsVertical from '~icons/heroicons-solid/dots-vertical'

  const { t } = useI18n()
</script>

<template>
  <Listbox
    :icon="IconDotsHorizontal"
    :values="
      [
        ...Array(
          store.selectedProject?.selectedReport?.dropsSettings.count.total
        ).keys(),
      ].map((value) => String(value + 1))
    "
    :selected="
      store.selectedProject?.selectedReport?.dropsSettings.count.selected
    "
    @select="
      (value) =>
        store.selectedProject?.selectedReport &&
        (store.selectedProject.selectedReport.dropsSettings.count.selected =
          Number(value))
    "
    :preSelected="`${t('Drop')}${t(':')}`"
    full
  />

  <Listbox
    :icon="IconDotsVertical"
    :values="
      store.selectedProject?.selectedReport?.dropsSettings.data.names.map(
        (name) => t(name)
      )
    "
    :preSelected="`${t('Value')}${t(':')}`"
    :selected="
      t(store.selectedProject?.selectedReport?.dropsSettings.data.names[
        store.selectedProject.selectedReport.dropsSettings.data.selected
      ] as string)
    "
    @selectIndex="
      (index) =>
        store.selectedProject?.selectedReport &&
        (store.selectedProject.selectedReport.dropsSettings.data.selected =
          index)
    "
    full
  />
</template>
