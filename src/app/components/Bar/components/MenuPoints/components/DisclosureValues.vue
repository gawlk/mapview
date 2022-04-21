<script setup lang="ts">
  import store from '/src/store'
  import { setDisclosureOpenState, getDisclosureOpenState } from '/src/scripts'

  import IconNumber from '~icons/octicon/number-16'
  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconDotsVertical from '~icons/heroicons-solid/dots-vertical'
  import IconDotsHorizontal from '~icons/heroicons-solid/dots-horizontal'

  const { t } = useI18n()

  const key = 'isPointsValuesDisclosureOpen'

  const pointsGroupedDataLabels = computed(
    () => store.projects.selected?.reports.selected?.dataLabels.groups
  )
</script>

<template>
  <Disclosure
    :icon="IconNumber"
    :text="t('Values settings')"
    @click="(open) => setDisclosureOpenState(key, open)"
    :defaultOpen="getDisclosureOpenState(key)"
  >
    <Listbox
      :icon="IconViewList"
      :values="pointsGroupedDataLabels?.list.map((list) => t(list.from))"
      :selected="t(pointsGroupedDataLabels?.selected?.from || '')"
      @selectIndex="
        (index) =>
          pointsGroupedDataLabels &&
          (pointsGroupedDataLabels.selected =
            pointsGroupedDataLabels.list[index])
      "
      :preSelected="`${t('Values from')}${t(':')}`"
      full
    />
    <Listbox
      v-if="pointsGroupedDataLabels?.selected?.indexes"
      :icon="IconDotsVertical"
      :values="
        pointsGroupedDataLabels?.selected?.indexes.list.map(
          (index) => `${index.displayedIndex} - ${t(index.type)}`
        )
      "
      :preSelected="`${t('Index')}${t(':')}`"
      :selectedIndex="
        (pointsGroupedDataLabels?.selected?.indexes.selected?.displayedIndex ||
          0) - 1
      "
      @selectIndex="
        (index) =>
          pointsGroupedDataLabels?.selected?.indexes &&
          (pointsGroupedDataLabels.selected.indexes.selected =
            pointsGroupedDataLabels.selected.indexes.list[index])
      "
      full
    />
    <Listbox
      :icon="IconDotsHorizontal"
      :values="
        pointsGroupedDataLabels?.selected?.choices.list.map((dataLabel) =>
          t(dataLabel.name)
        )
      "
      :preSelected="`${t('Value')}${t(':')}`"
      :selected="
        t(pointsGroupedDataLabels?.selected?.choices.selected?.name || '')
      "
      @selectIndex="
        (index) =>
          pointsGroupedDataLabels?.selected &&
          (pointsGroupedDataLabels.selected.choices.selected =
            pointsGroupedDataLabels.selected.choices.list[index])
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
