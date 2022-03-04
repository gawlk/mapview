<script setup lang="ts">
  import store from '/src/store'

  import IconNumber from '~icons/octicon/number-16'
  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconDotsVertical from '~icons/heroicons-solid/dots-vertical'
  import IconDotsHorizontal from '~icons/heroicons-solid/dots-horizontal'

  const { t } = useI18n()

  const pointsGroupedValuesNames = computed(
    () => store.projects.selected?.reports.selected?.valuesNames.groups
  )
</script>

<template>
  <Disclosure
    :icon="IconNumber"
    :text="t('Values settings')"
    @click="() => {}"
    :defaultOpen="true"
  >
    <Listbox
      :icon="IconViewList"
      :values="pointsGroupedValuesNames?.list.map((list) => t(list.from))"
      :selected="t(pointsGroupedValuesNames?.selected?.from || '')"
      @selectIndex="
        (index) =>
          pointsGroupedValuesNames &&
          (pointsGroupedValuesNames.selected =
            pointsGroupedValuesNames.list[index])
      "
      :preSelected="`${t('Values from')}${t(':')}`"
      full
    />
    <Listbox
      v-if="pointsGroupedValuesNames?.selected?.indexes"
      :icon="IconDotsVertical"
      :values="
        pointsGroupedValuesNames?.selected?.indexes.list.map(
          (index) => `${index + 1}`
        )
      "
      :preSelected="`${t('Index')}${t(':')}`"
      :selectedIndex="(pointsGroupedValuesNames?.selected?.indexes.selected as number)"
      @selectIndex="
        (index) =>
          pointsGroupedValuesNames?.selected?.indexes &&
          (pointsGroupedValuesNames.selected.indexes.selected =
            pointsGroupedValuesNames.selected.indexes.list[index])
      "
      full
    />
    <Listbox
      :icon="IconDotsHorizontal"
      :values="
        pointsGroupedValuesNames?.selected?.choices.list.map((valueName) =>
          t(valueName.name)
        )
      "
      :preSelected="`${t('Value')}${t(':')}`"
      :selected="
        t(pointsGroupedValuesNames?.selected?.choices.selected?.name || '')
      "
      @selectIndex="
        (index) =>
          pointsGroupedValuesNames?.selected &&
          (pointsGroupedValuesNames.selected.choices.selected =
            pointsGroupedValuesNames.selected.choices.list[index])
      "
      full
    />
  </Disclosure>
</template>

<i18n lang="yaml">
fr:
  'Values settings': 'Configurations des valeurs'
  'Values from': 'Valeurs de'
</i18n>
