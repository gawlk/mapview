<script setup lang="ts">
  import store from '/src/store'

  import IconNumber from '~icons/octicon/number-16'
  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconDotsHorizontal from '~icons/heroicons-solid/dots-horizontal'
  import IconDotsVertical from '~icons/heroicons-solid/dots-vertical'

  const { t } = useI18n()
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
      :values="[t('Drop'), t('Point'), t('Zone')]"
      :selectedIndex="
        store.projects.selected?.reports.selected?.values.selectedList ===
        'Drop'
          ? 0
          : store.projects.selected?.reports.selected?.values.selectedList ===
            'Point'
          ? 1
          : 2
      "
      @selectIndex="
        (index) =>
          store.projects.selected?.reports.selected &&
          (store.projects.selected.reports.selected.values.selectedList =
            index === 0 ? 'Drop' : index === 1 ? 'Point' : 'Zone')
      "
      :preSelected="`${t('Values from')}${t(':')}`"
      full
    />

    <!-- <Listbox
      :icon="IconDotsVertical"
      :values="
        store.projects.selected?.reports.selected?.dropsSettings.data.names.map(
          (name) => t(name)
        )
      "
      :preSelected="`${t('Value')}${t(':')}`"
      @selectIndex="() => {}"
      full
    /> -->
  </Disclosure>
</template>

<i18n lang="yaml">
en:
  'Values settings': 'Values settings'
  'Values from': 'Values from'
fr:
  'Values settings': 'Configurations des valeurs'
  'Values from': 'Valeurs de'
</i18n>
