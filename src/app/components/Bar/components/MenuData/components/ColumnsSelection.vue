<script setup lang="ts">
  import store from '/src/store'

  import IconDotsVertical from '~icons/heroicons-solid/dots-vertical'
  import IconViewBoards from '~icons/heroicons-solid/view-boards'
  import IconViewList from '~icons/heroicons-solid/view-list'

  import Select from '/src/components/Select.vue'

  const { t } = useI18n()

  const tableDataLabels = computed(
    () => store.projects.selected?.reports.selected?.dataLabels.table
  )

  const selectDataLabelsGroup = (index: number) => {
    tableDataLabels.value?.selected &&
      (tableDataLabels.value.selected = tableDataLabels.value?.list[index])
  }

  const selectDataLabel = (index: number) => {
    const dataLabel = tableDataLabels.value?.selected?.group.choices.list[index]

    if (dataLabel) {
      const index = tableDataLabels.value?.selected?.dataLabels.findIndex(
        (dataLabel2) => dataLabel === dataLabel2
      )
      if (typeof index === 'number') {
        index === -1
          ? tableDataLabels.value?.selected?.dataLabels.push(dataLabel)
          : tableDataLabels.value?.selected?.dataLabels.splice(index, 1)
      }
    }
  }
</script>

<template>
  <Select
    :icon="IconViewList"
    :values="
      tableDataLabels?.list
        .filter((parameters) => parameters.group.choices.list.length)
        .map((parameters) => t(parameters.group.from))
    "
    :selected="t(tableDataLabels?.selected?.group.from || '')"
    @selectIndex="selectDataLabelsGroup"
    :preSelected="`${t('Source')}${t(':')}`"
    :postSelected="`(${store.projects.selected?.reports.selected?.name.value})`"
    full
  />
  <Select
    v-if="tableDataLabels?.selected?.group.from === 'Drop'"
    :icon="IconDotsVertical"
    :values="
      (tableDataLabels?.selected?.group.indexes?.list as MachineDropIndex[]).map(
        (index) =>
          `${index.displayedIndex} - ${t(index.type)}${
            index.machine === 'Heavydyn' && index.value
              ? ` (${index.value.displayedStringWithUnit})`
              : ''
          }`
      )
    "
    :preSelected="`${t('Index')}${t(':')}`"
    :selectedIndex="(tableDataLabels?.selected?.index?.displayedIndex || 1) - 1"
    @selectIndex="
      (index) =>
        tableDataLabels?.selected &&
        tableDataLabels?.selected?.group.from === 'Drop' &&
        (tableDataLabels.selected.index =
          tableDataLabels?.selected?.group.indexes.list[index])
    "
    full
  />
  <Select
    v-if="tableDataLabels?.selected"
    multiple
    :icon="IconViewBoards"
    :values="
      tableDataLabels?.selected?.group.choices.list.map((dataLabel) =>
        dataLabel.getDisplayedName()
      )
    "
    :preSelected="`${t('Columns')}${t(':')}`"
    :selectedList="
      tableDataLabels.selected.dataLabels.map((dataLabel) =>
        dataLabel.getDisplayedName()
      )
    "
    @selectIndex="selectDataLabel"
    @unselectIndex="selectDataLabel"
    full
  />
</template>

<i18n lang="yaml">
fr:
  'Values from': 'Valeurs de'
</i18n>
