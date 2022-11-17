<script setup lang="ts">
  import store from '/src/store'

  import IconDotsHorizontal from '~icons/heroicons-solid/dots-horizontal'
  import IconDotsVertical from '~icons/heroicons-solid/dots-vertical'
  import IconViewList from '~icons/heroicons-solid/view-list'

  import Listbox from '/src/components/Listbox.vue'

  const { t } = useI18n()

  const groupedDataLabels = computed(
    () => store.projects.selected?.reports.selected?.dataLabels.groups
  )
</script>

<template>
  <Listbox
    :icon="IconDotsHorizontal"
    :values="
      (groupedDataLabels?.list as MachineGroupedDataLabels[] | undefined)?.filter((list) => list.from !== 'Zone')
        .map((list) => t(list.from))
    "
    :selected="t(groupedDataLabels?.selected?.from || '')"
    @selectIndex="
      (index) =>
        groupedDataLabels &&
        (groupedDataLabels.selected = groupedDataLabels.list[index])
    "
    :preSelected="`${t('Source')}${t(':')}`"
    full
  />
  <Listbox
    v-if="groupedDataLabels?.selected?.indexes"
    :icon="IconDotsVertical"
    :values="
      groupedDataLabels?.selected?.indexes.list.map(
        (index) =>
          `${index.displayedIndex} - ${t(index.type)}${
            index.machine === 'Heavydyn' && index.value
              ? ` (${index.value.displayedStringWithUnit})`
              : ''
          }`
      )
    "
    :preSelected="`${t('Index')}${t(':')}`"
    :selectedIndex="
      (groupedDataLabels?.selected?.indexes.selected?.displayedIndex || 0) - 1
    "
    @selectIndex="
      (index) =>
        groupedDataLabels?.selected?.indexes &&
        (groupedDataLabels.selected.indexes.selected =
          groupedDataLabels.selected.indexes.list[index])
    "
    full
  />
  <Listbox
    :icon="IconViewList"
    :values="
      groupedDataLabels?.selected?.choices.list.map(
        (dataLabel) =>
          `${t(dataLabel.name)} - ${t(
            typeof dataLabel.unit === 'string'
              ? dataLabel.unit
              : dataLabel.unit.name
          )}`
      )
    "
    :preSelected="`${t('Selected')}${t(':')}`"
    :selected="`${t(
      groupedDataLabels?.selected?.choices.selected?.name || ''
    )} - ${t(
      typeof groupedDataLabels?.selected?.choices.selected?.unit === 'string'
        ? groupedDataLabels?.selected?.choices.selected?.unit
        : groupedDataLabels?.selected?.choices.selected?.unit.name || ''
    )}`"
    @selectIndex="
      (index) =>
        groupedDataLabels?.selected &&
        (groupedDataLabels.selected.choices.selected =
          groupedDataLabels.selected.choices.list[index])
    "
    full
  />
</template>
