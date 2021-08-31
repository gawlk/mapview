<template>
  <Listbox
    full
    @selectIndex="setIcon"
    :icon="ColorSwatchIcon"
    :preSelected="t('Icon:')"
    :selected="state.pointIconValues[state.pointIconSelected]"
    :values="state.pointIconValues"
    isTop
  />
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'
  import { icons } from '/src/scripts/map/icon'

  import { ColorSwatchIcon } from '@heroicons/vue/solid'

  import { Listbox } from '/src/components'

  const { t } = useI18n()

  const state = reactive({
    pointIconSelected: 0,
    pointIconValues: Object.keys(icons).map((key) => {
      return `<div class="flex space-x-1.5">
        <div class="ml-1">
          ${icons[key]}
        </div>
        <span>${t(key)}</span>
      </div>`
    }),
  })

  const setIcon = (index: number) => {
    if (store.project?.selectedReport) {
      store.project.selectedReport.icon = Object.keys(icons)[index]
      state.pointIconSelected = index
    }
  }
</script>

<i18n lang="yaml">
en:
  'Icon:': 'Icon:'
  'circle': 'Circle'
  'triangle': 'Triangle'
  'square': 'Square'
  'rhombus': 'Rhombus'
  'flare': 'Flare'
  'pentagon': 'Pentagon'
  'hexagon': 'Hexagon'
  'hexagonAlt': 'Hexagon alt.'
  'heptagon': 'Heptagon'
  'octagon': 'Octagon'
fr:
  'Icon:': 'Icône :'
  'circle': 'Cercle'
  'triangle': 'Triangle'
  'square': 'Carré'
  'rhombus': 'Losange'
  'flare': 'Éclat'
  'pentagon': 'Pentagone'
  'hexagon': 'Hexagone'
  'hexagonAlt': 'Hexagone alt.'
  'heptagon': 'Heptagone'
  'octagon': 'Octagone'
</i18n>
