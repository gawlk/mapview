<template>
  <Listbox
    :icon="AdjustmentsIcon"
    :values="store.project?.reports.map((r) => r.name)"
    :preSelected="t('Threshold:')"
    selected="N.S."
    full
  />
  <Listbox
    :icon="ColorSwatchIcon"
    buttonColors="bg-green-200 hover:bg-green-300 hover:bg-opacity-75 text-green-900"
    iconsClasses="text-green-700 group-hover:text-green-800"
    selectedReplacement="0 < D0 < 30,0 um"
    selected="N.S."
    full
  />
  <Listbox
    :icon="ColorSwatchIcon"
    buttonColors="bg-red-200 hover:bg-red-300 hover:bg-opacity-75 text-red-900"
    iconsClasses="text-red-700 group-hover:text-red-800"
    selectedReplacement="30,0 um < D0 < ∞"
    full
  />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { AdjustmentsIcon, ColorSwatchIcon } from '@heroicons/vue/solid'

  import { Disclosure, Listbox } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Threshold:': 'Threshold:'
fr:
  'Threshold:': 'Seuil :'
</i18n>
