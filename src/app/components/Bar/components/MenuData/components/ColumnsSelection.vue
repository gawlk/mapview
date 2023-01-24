<script setup lang="ts">
  import store from '/src/store'

  import IconCheck from '~icons/heroicons-solid/check'
  import IconDotsVertical from '~icons/heroicons-solid/dots-vertical'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconViewBoards from '~icons/heroicons-solid/view-boards'
  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconX from '~icons/heroicons-solid/x'

  import Button from '/src/components/Button.vue'
  import Divider from '/src/components/Divider.vue'
  import Popover from '/src/components/Popover.vue'
  import Select from '/src/components/Select.vue'

  import Empty from './Empty.vue'

  const { t } = useI18n()

  const tableDataLabels = computed(
    () => store.projects.selected?.reports.selected?.dataLabels.table
  )

  const filteredDataLabels = computed(() =>
    tableDataLabels.value?.selected?.group.choices.list.filter(
      (dataLabel) =>
        !tableDataLabels.value?.selected?.dataLabels.find(
          (dataLabel2) => dataLabel === dataLabel2
        )
    )
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
      tableDataLabels?.list.map((parameters) => t(parameters.group.from))
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
  <!-- <Popover
    v-if="tableDataLabels?.selected"
    :icon="IconViewBoards"
    :preText="`${t('Columns')}${t(':')}`"
    :buttonText="`${
      tableDataLabels.selected.dataLabels
        .map((dataLabel) => t(dataLabel.name))
        .join(', ') || t('None')
    }`"
    full
  >
    <div class="space-y-2">
      <div v-if="tableDataLabels.selected.dataLabels.length" class="space-y-1">
        <Button
          v-for="(name, index) of tableDataLabels.selected.dataLabels.map(
            (dataLabel) => dataLabel.name
          )"
          :key="name"
          @click="() => tableDataLabels?.selected?.dataLabels.splice(index, 1)"
          :leftIcon="IconCheck"
          :rightIcon="IconX"
          truncate
          full
        >
          {{ t(name) }}
        </Button>
      </div>
      <Empty v-else />
      <Divider class="-mx-1" />
      <div v-if="filteredDataLabels?.length" class="space-y-1">
        <Button
          v-for="dataLabel of filteredDataLabels"
          :key="dataLabel.name"
          @click="
            () =>
              tableDataLabels?.selected?.dataLabels.find(
                (dataLabel2) => dataLabel === dataLabel2
              ) || tableDataLabels?.selected?.dataLabels.push(dataLabel)
          "
          :leftIcon="IconPlus"
          truncate
          full
        >
          {{ t(dataLabel.name) }}
        </Button>
      </div>
      <Empty v-else />
    </div>
  </Popover> -->
</template>

<i18n lang="yaml">
fr:
  'Values from': 'Valeurs de'
</i18n>
