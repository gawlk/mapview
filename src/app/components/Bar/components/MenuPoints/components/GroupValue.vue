<template>
  <Listbox
    :icon="DotsHorizontalIcon"
    :values="
      [
        ...Array(
          store.project?.selectedReport?.dropsSettings.count.total
        ).keys(),
      ].map((value) => String(value + 1))
    "
    :selected="store.project?.selectedReport?.dropsSettings.count.selected"
    @select="
      (value) =>
        store.project?.selectedReport &&
        (store.project.selectedReport.dropsSettings.count.selected =
          Number(value))
    "
    :preSelected="t('Drop:')"
    full
    isTop
  />

  <Listbox
    :icon="DotsVerticalIcon"
    :values="
      store.project?.selectedReport?.dropsSettings.data.names.map((name) =>
        t(name)
      )
    "
    :preSelected="t('Value:')"
    :selected="
      t(store.project?.selectedReport?.dropsSettings.data.names[
        store.project.selectedReport.dropsSettings.data.selected
      ] as string)
    "
    @selectIndex="
      (index) =>
        store.project?.selectedReport &&
        (store.project.selectedReport.dropsSettings.data.selected = index)
    "
    full
    isTop
  />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { DotsHorizontalIcon, DotsVerticalIcon } from '@heroicons/vue/solid'

  import { Listbox } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Drop:': 'Drop:'
  'Value:': 'Value:'
fr:
  'Drop:': 'Frappe :'
  'Value:': 'Valeur :'
</i18n>
