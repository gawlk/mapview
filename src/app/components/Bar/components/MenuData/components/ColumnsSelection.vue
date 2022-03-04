<script setup lang="ts">
  import store from '/src/store'

  import Empty from './Empty.vue'
  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconDotsVertical from '~icons/heroicons-solid/dots-vertical'
  import IconViewBoards from '~icons/heroicons-solid/view-boards'
  import IconCheck from '~icons/heroicons-solid/check'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconX from '~icons/heroicons-solid/x'

  const { t } = useI18n()

  const tableValuesNames = computed(
    () => store.projects.selected?.reports.selected?.valuesNames.table
  )

  const filteredValuesNames = computed(() =>
    tableValuesNames.value?.selected?.group.choices.list.filter(
      (valueName) =>
        !tableValuesNames.value?.selected?.valuesNames.find(
          (valueName2) => valueName === valueName2
        )
    )
  )

  const selectGroupedValuesNames = (index: number) => {
    tableValuesNames.value?.selected &&
      (tableValuesNames.value.selected = tableValuesNames.value?.list[index])
    console.log(tableValuesNames.value?.selected?.group.from)
  }
</script>

<template>
  <Listbox
    :icon="IconViewList"
    :values="
      tableValuesNames?.list.map((parameters) => t(parameters.group.from))
    "
    :selected="t(tableValuesNames?.selected?.group.from || '')"
    @selectIndex="selectGroupedValuesNames"
    :preSelected="`${t('Values from')}${t(':')}`"
    full
  />
  <Listbox
    v-if="tableValuesNames?.selected?.group.indexes"
    :icon="IconDotsVertical"
    :values="
      tableValuesNames?.selected?.group.indexes?.list.map(
        (index) => `${index + 1}`
      )
    "
    :preSelected="`${t('Index')}${t(':')}`"
    :selectedIndex="tableValuesNames?.selected?.index"
    @selectIndex="
      (index) =>
        tableValuesNames?.selected &&
        (tableValuesNames.selected.index =
          tableValuesNames?.selected?.group.indexes?.list[index])
    "
    full
  />
  <Popover
    v-if="tableValuesNames?.selected"
    :icon="IconViewBoards"
    :buttonText="`${t('Columns')}${t(':')} ${
      tableValuesNames.selected.valuesNames
        .map((valueName) => t(valueName.name))
        .join(', ') || t('None')
    }`"
    full
  >
    <div class="space-y-2">
      <div
        v-if="tableValuesNames.selected.valuesNames.length"
        class="space-y-1"
      >
        <Button
          v-for="(name, index) of tableValuesNames.selected.valuesNames.map(
            (valueName) => valueName.name
          )"
          :key="name"
          @click="
            () => tableValuesNames?.selected?.valuesNames.splice(index, 1)
          "
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
      <div v-if="filteredValuesNames?.length" class="space-y-1">
        <Button
          v-for="valueName of filteredValuesNames"
          :key="valueName.name"
          @click="
            () =>
              tableValuesNames?.selected?.valuesNames.find(
                (valueName2) => valueName === valueName2
              ) || tableValuesNames?.selected?.valuesNames.push(valueName)
          "
          :leftIcon="IconPlus"
          truncate
          full
        >
          {{ t(valueName.name) }}
        </Button>
      </div>
      <Empty v-else />
    </div>
  </Popover>
</template>

<i18n lang="yaml">
fr:
  'Values from': 'Valeurs de'
</i18n>
